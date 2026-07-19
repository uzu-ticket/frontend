# UzuTicket — Ticket Integrity & Offline Scanning

**Stack**
This application has to be build with nestjs, redis, postgres - all other decisions will be discussed.


**Engineering design note for development.**
Scope: how tickets are made trustworthy, and how gate scanning behaves when the venue has no network. This document explains the *why* behind the schema so the implementation doesn't accidentally drop a property that something else depends on.

Related artefacts: `uzuticket-schema.dbml` (data model), PRD §3.2 (sales close), §3.9 (scanner app & offline mode), §4.1–4.2 (ticket integrity, lifecycle).

---

## 1. The two properties a ticket must have

These are different things and are often confused. Keep them separate in your head.

| Property | What it means | What provides it |
|---|---|---|
| **Unguessable** | An attacker can't fabricate a valid ticket identifier out of thin air. | A UUIDv7 ticket ID. Random enough that guessing is infeasible. |
| **Unforgeable / offline-verifiable** | A scanner can confirm, *with no network*, that the organiser actually issued this ticket. | An Ed25519 **signature** over the ticket payload, verified against a **public key** the device already holds. |

A UUID alone gives you the first property, not the second.

### Why the second property matters *only* offline

- **Online scanning:** every scan hits the server. A bare ticket ID plus a server-side check ("does this ID exist, is it unused, mark it used") is genuinely enough. The signature buys little here. Many ticketing systems stop at this.
- **Offline scanning:** the scanner has no server to ask. It must decide *on-device* whether a QR it may be seeing for the first time is a real, organiser-issued ticket. A bare ID can't answer that — the device has no way to distinguish a genuine ID from a copied-but-real one, or from a fabricated one, without either (a) the full manifest and (b) a way to verify authenticity. The signature is what lets an offline device trust a ticket locally.

**Design rule:** because the PRD requires offline scanning, tickets are signed. If the product ever became online-only at the gate, signatures (and the signing-keys table) could be dropped.

---

## 2. What goes in the QR code

Do **not** put only the raw ticket ID in the QR. Sign a small structured payload so the signature is bound to a specific ticket *and* event (prevents replaying a valid QR from Event A against Event B).

**QR payload (conceptual):**

```
{
  "tid": "<ticket UUIDv7>",
  "eid": "<event UUIDv7>",
  "iat": <issued-at unix seconds>,
  "kid": "<signing key id>"      // which key signed this, for rotation
}
```

**QR contents = `base64url(payload)` + `.` + `base64url(Ed25519 signature)`**
(A compact JWT-style or COSE encoding is fine. It's still an ordinary QR, just more bytes.)

Verification on the device:
1. Decode payload + signature.
2. Look up the public key by `kid` in the downloaded manifest.
3. Verify the Ed25519 signature over the payload bytes.
4. Check `eid` matches the event this device is scanning.
5. Then apply the used/duplicate logic (Section 4).

Steps 1–4 are pure crypto/lookup and need **no network**.

---

## 3. Signing keys (why `event_signing_keys` exists)

The signing key model exists to support **offline verification + key rotation + compromise response** at once.

- The **private key** never touches this table or the device. It lives in a KMS / secrets manager. Signing happens server-side at ticket issuance.
- The **public key** is safe to distribute and ships inside the offline manifest so devices can verify.
- **`tickets.signing_key_id`** records which key signed each ticket. This is what makes rotation safe: rotating the active key does **not** invalidate already-issued tickets, because each ticket still verifies against the specific key that signed it.
- **`is_active`** marks which key signs *new* tickets. Old keys stay in the table (inactive) so their existing tickets keep verifying.
- **Compromise:** if a private key leaks, set its key `is_active = false`, issue a new key, and void/reissue only the affected tickets.

### Scope decision (choose one)

| Scope | Blast radius of a leaked key | Complexity |
|---|---|---|
| **Per-event key** (current schema) | One event's tickets | Highest — a key pair per event |
| **Per-organisation key** | That org's tickets until rotation | Medium |
| **Global key** | Everything until rotation + reissue | Lowest |

The schema currently models **per-event** keys. If you relax the PRD's "rotated per event" to "one long-lived key we rarely rotate," collapse this to org-level or global and simplify/remove `event_signing_keys`, pointing `tickets.signing_key_id` at the coarser key (or dropping it).

---

## 4. The copied-ticket problem (this is the important one)

**Signatures do NOT solve this. It is a duplicate problem, not a forgery problem.**

### The attack

A buyer purchases one ticket, screenshots the QR, and sends it to 4 friends. All 5 QR codes are **byte-for-byte identical** and every one carries a **valid** signature — because it *is* the genuine, organiser-signed ticket. Signature verification says "yes, issued by the organiser" for all 5, correctly. Nothing about signing catches this.

### Why pure offline can't fully prevent it

"Has this ticket been used already?" is a question about **shared state across all gates**. Offline devices don't share state until they reconnect. So during the offline window:

1. Gate 1 scans → local manifest says `valid` → admits → marks used **locally**.
2. Gates 2, 3, 4 each do the same, independently, unaware of Gate 1.
3. All 4 friends get in.
4. `first-scan-wins` reconciliation (Section 5) fires **later**, when devices sync, and correctly flags "scanned 4× across 4 gates" — but everyone is already inside.

**Conclusion:** no purely-offline design hard-stops a copied ticket across multiple gates. You shrink the window and raise the cost. The mitigations below are ordered by impact.

### The unavoidable trade-off

You cannot have all four of these at once:

> **offline** · **duplicate-proof** · **screenshot-proof** · **printable/static ticket**

Pick which to relax. This drives the mitigation choice.

---

## 5. Mitigations

### 5.1 Peer-to-peer gate sync — *recommended default*

Gates usually can't reach the **internet**, but they can reach **each other**. Devices gossip "ticket X used" records among themselves so every gate learns of an admission within a second or two, collapsing the copied-ticket window from *the whole event* to *the propagation delay*.

This is what UzuTicket should design for. The data model already supports it — `ticket_scans` records mode/result/conflict; you add a **device↔device** sync path alongside device↔server. Sections 5.1.1–5.1.4 specify the transport, the algorithm, and the honest limits.

#### 5.1.1 Transport — app-only, no infrastructure required

Phones can connect **directly to each other** with no router, no internet, and no coordinator box — the same mechanism Xender/SHAREit use: on Android one device becomes a **Wi-Fi Direct group owner** (or opens a local hotspot) and peers join it like a router. This is production-proven and routine **for Android↔Android**.

Two things Xender does *not* have to solve, which we do:

- **Range** — a single Wi-Fi hop is short in a crowd (see table). Xender shares are ~1 m apart so range never bites; gates can be further.
- **Topology** — Xender is one group owner + a few clients. We need multi-hop relaying so a record reaches gates that can't hear each other directly.

The fix for both is the **multi-hop gossip mesh** in 5.1.2: each device relays to the next, chaining short hops across the venue.

**Platform reality:**

| Platform | Device-to-device capability | Verdict |
|---|---|---|
| **Android ↔ Android** | Wi-Fi Direct, Wi-Fi Aware (NAN), local hotspot | **Solved, routine.** This is the target. |
| **iOS ↔ iOS** | Multipeer Connectivity (BT + peer Wi-Fi) | Works, but Apple-only. |
| **iOS ↔ Android** | No common app-level Wi-Fi mesh | **Hard — avoid.** |

**Enabling decision: the organiser chooses the mesh platform per event — but it must be homogeneous within that event.** The real constraint isn't "Android everywhere"; it's that iOS and Android can't mesh with *each other*, so every scanner at a single event must be on the **same** mesh transport. Since scanning is per-event and staff bring whatever devices they have, let the organiser pick per event:

| Per-event mesh option | When it fits | Notes |
|---|---|---|
| **Android mesh** (Wi-Fi Direct / Aware) | Default; cheap-Android teams; most events | Best supported; the launch-market default |
| **iPhone mesh** (Multipeer Connectivity) | Small events where staff all carry iPhones | Apple-only; fine when the whole gate team is iOS |
| **Shared Wi-Fi / LAN** (existing venue router or a travel router) | Venue already has Wi-Fi, or organiser brings a router | Platform-agnostic — **iOS and Android scanners mix freely** because they talk over the LAN, not device-to-device |

The homogeneity rule only applies to the two **direct device-to-device** modes (Android mesh, iPhone mesh). The **shared-Wi-Fi mode removes the constraint entirely** — everyone joins the same network and gossips over it, so a mixed-device team works. This is also the natural bridge to the optional Pro coordinator box (§5.1.5), which *is* a shared-Wi-Fi access point.

Forcing Android on a small event where the organiser and two friends all have iPhones makes no sense — so the platform is a **per-event setting** the organiser selects at event setup, not a platform-wide mandate. Android remains the *recommended default* (best support, cheapest devices), not the only option.

#### 5.1.2 Propagation — multi-hop gossip (CRDT merge)

Connectivity is one hop; **coverage** is many hops chained together. Rules:

- **Gossip, don't route.** Each device keeps a set of "used" records. Every 1–3 s it exchanges sets with whatever peers it can currently see; anything new is merged and re-shared next round. Reaching everyone is *emergent* — you never compute paths.
- **Mergeable, order-free records.** Each record is `{ticket_id, admitting_device_id, monotonic-derived timestamp}`. Merge = set **union** with **first-scan-wins** on conflict. Because union is commutative, associative, and idempotent, it doesn't matter what order records arrive in or if the same one arrives twice — every device converges to the same state. (Formally a CRDT.)
- **Bounded payload.** Gossip only this event's admissions; a reconnecting/late device catches up with a compact digest, not a full replay.
- **Self-healing.** Devices join, leave, sleep, die — the mesh re-forms each round. If it splits into islands, each island keeps working and reconciles when any link (or the server) rejoins them.

`ticket_scans` already carries what's needed; add the device-to-device gossip path and store both the monotonic reading and its derived wall-clock estimate per row (per decision 3) for cross-device ordering.

#### 5.1.3 Range per transport — realistic, not spec-sheet

A crowd is a room full of water, and water absorbs 2.4/5 GHz. Marketing range ≠ event range. Figures below are realistic ballparks (device/antenna/obstacle dependent), not guarantees:

| Transport | Open line-of-sight | Packed venue (crowd + walls) | Role |
|---|---|---|---|
| **Wi-Fi Direct / hotspot (2.4 GHz)** | ~100–200 m claimed | **~10–30 m** | Primary carrier |
| **Wi-Fi Direct (5 GHz)** | shorter reach, faster | **~5–15 m** | Faster, dies quicker through bodies |
| **Wi-Fi Aware (NAN)** | ~ like Wi-Fi Direct | **~10–30 m** | Better cluster topology, similar range |
| **Bluetooth / BLE** | 10–100 m (class-dependent) | **~5–10 m** | Low-bandwidth fallback only |
| **LoRa** (optional Pro box, §5.1.5) | **2–15 km** | hundreds of m–km | Tiny messages only; long-haul sync between boxes |

**Headline: budget ~10–30 m per Wi-Fi hop in a real crowd.** Everything about mesh reliability follows from that number.

#### 5.1.4 Why the short hop is usually fine — gate geography is clustered

The 10–30 m limit sounds alarming in the abstract, but real gate layouts are **clustered**, not spread out:

- Venues funnel attendees through **one controlled entrance zone** for staffing and security. Typical picture: several scanners **side by side, 1–2 m apart** — trivially in range.
- Separation only appears in a **minority** of events: multiple entrances (main + VIP/side, 50–100 m apart), large stadiums (different concourses), or sprawling outdoor festivals.
- Even then, scanners **at each entrance are still clustered**. You don't get "20 devices evenly spread over 200 m"; you get **two tight clusters 100 m apart**. Within a cluster the mesh is rock-solid; only the **cluster-to-cluster** gap needs bridging.

So the common case (most of the launch market — comedy nights, club shows, campus events, mid-size concerts, conferences) is **one clustered entrance → app-only mesh just works, no hardware**. The spread-out case is a **cluster-bridging** problem (§5.1.5), not an every-device-isolated problem — a much smaller thing to solve, and it coincides exactly with the larger events that are on Pro anyway.

> **Measure it early.** On the first handful of real events, record actual gate layouts and whether the mesh ever split into islands. Cheap data that settles how often the spread-out case really occurs in your market — i.e. whether cluster-bridging is a rare edge feature or something a meaningful slice of events needs.

#### 5.1.5 Cluster bridging — optional, for spread-out venues only

When entrances are too far apart to chain hops, bridge the clusters. Options, cheapest first:

1. **A relay device in the gap** — a spare Android in the middle extends the chain. Free, often enough.
2. **A carried device** — staff moving between entrances physically ferries recent "used" records.
3. **Pro coordinator box** — a shipped device that is a **local access point + authoritative used-set server**, not a mesh peer. Every scanner talks to the box; the box answers instantly. Bonus: because it speaks plain Wi-Fi/LAN, **iOS and Android scanners both work** through it. For multi-zone venues, boxes sync to each other over **LoRa** (tiny "used" records travel km at legal low power; never run scanning over LoRa — too slow).

**On "very wide range" from one powerful box — mostly a myth.** Wi-Fi transmit power is capped by regulators (NCC in Nigeria; FCC/ETSI-equivalent elsewhere), and the real limit is the **phone's** weak return signal, not the box. Coverage comes from **multiple zone boxes**, or LoRa for the long links — not from one loud transmitter. A custom box is also a real hardware program (NCC type-approval per market, firmware, spares, logistics); start with **off-the-shelf** (a rugged mini-PC or travel router running the coordinator software) and only build custom hardware once demand is proven. If bundled into Pro, prefer a **rental/deposit** model over outright sale to avoid becoming a low-margin hardware business.

#### 5.1.6 Downsides to design around (the honest list)

None is fatal; together they mark *where the free mesh stops being enough*.

1. **Short hop → chain can split.** A gap wider than ~10–30 m with no device between creates islands that don't share records until bridged. Coverage depends on device density/layout, which you don't fully control.
2. **Multi-hop mesh is real distributed-systems work.** Xender proves the *hop*, not the *mesh*. Devices arriving late, wandering out of range, sleeping, and dying mean the mesh must continuously re-form — the actual thing you're building.
3. **OS kills background networking.** Android/iOS suspend backgrounded apps. Scanners must stay **foreground, screen-on, ideally charging**. Implies dedicated devices, not staff pocketing their phones.
4. **Wi-Fi Direct group-owner model is awkward for relaying** (a relay wants to be in two groups at once). Wi-Fi Aware handles clusters more naturally; expect some per-hop latency/fiddliness.
5. **Band congestion at big events.** Hundreds of phones + venue Wi-Fi + hotspots contend for 2.4 GHz. More devices and relaying = slower gossip = wider window — worst exactly when the event is biggest.
6. **Battery.** Camera-on scanning + held mesh links + relaying + screen-on drains fast. Budget power banks/mains per gate.
7. **Propagation window never hits zero.** Even a perfect mesh takes time to ripple a record across hops; two far gates scanning a copy within that window both admit. Gossip shrinks it to sub-second; reconciliation (§5.4) catches the rest.
8. **iOS↔Android can't mesh directly.** The two direct device-to-device modes don't interoperate, so a single event's scanners must be homogeneous (all Android *or* all iPhone) — or use **shared Wi-Fi mode**, which sidesteps it entirely and allows mixed teams (§5.1.1). This is why mesh platform is a per-event choice, not a free-for-all mix within one gate team.

**Net:** app-only Android mesh is a solid **default for compact, clustered-gate venues** (most events). It gets shaky at **large, spread-out, densely crowded** venues — precisely where §5.1.5 cluster-bridging (relay device, then Pro box) earns its place as an *upgrade*, not the baseline.

### 5.2 Single / channelled entry point

Funnel all attendees (or all of one ticket tier) through one scanning station. One device = one source of truth = duplicates caught instantly. Purely operational; combine with 5.1 for multi-gate events.

### 5.3 Rotating QR — *defeats screenshots specifically*

The buyer's **app** regenerates a short-lived QR every ~30s from a shared secret (TOTP-style over the signed payload). A screenshot is stale within seconds.

Cost: requires attendees to present a **live app**, not a printed PDF or saved image — this breaks the "email me the ticket" flow and is a heavy UX ask in the launch market. Reserve for specific high-demand / high-value events; do not make it the default.

### 5.4 Detect-and-deter (always on, regardless of the above)

Reconciliation flags every multi-scanned ticket. Use it to:
- Alert a roaming supervisor the instant any two briefly-online gates report the same ticket.
- Produce a post-event integrity report: refuse refunds on abused tickets, ban repeat-offender buyers, feed fraud scoring.

Doesn't prevent; deters and quantifies. This is roughly where a bare-ID online system also lands.

### 5.5 Identity binding — high-value only

Name-on-ticket + ID check at the gate. Slow and expensive; only for premium tiers.

---

## 6. Recommended build for UzuTicket

**Default:** §5.1 app-only Android Wi-Fi Direct **multi-hop gossip mesh** between scanner devices **+** §5.4 reconciliation alerts + post-event integrity report. No hardware for the common (clustered-gate) case.
**Upgrade (spread-out venues only):** §5.1.5 cluster bridging — relay device first, Pro coordinator box (off-the-shelf, then custom + LoRa) once demand is proven.
**Reserve:** §5.3 rotating in-app QR for specific high-demand events (currently off per decision 4).
**Keep:** Ed25519 signatures + `event_signing_keys` (per-event, decision 1) — they stop *forged* tickets, a separate attack the mesh does not address.
**Enabling decision:** mesh platform is a **per-event choice** — Android mesh (default), iPhone mesh, or shared Wi-Fi/LAN — homogeneous within an event, with shared-Wi-Fi allowing mixed-device teams (§5.1.1). This, not a hardware purchase, is what keeps the mesh easy while not forcing Android on small all-iOS teams.

Signatures and peer-sync are complementary and cover different attacks:

| Attack | Stopped by |
|---|---|
| Fabricated / forged ticket (no valid signature) | **Ed25519 signature** verified offline |
| Replayed ticket from another event | Signed payload binds `event_id` |
| Copied/screenshotted real ticket, multiple gates | **Peer-to-peer gate sync** (shrinks window) + reconciliation |
| Copied real ticket, single gate | Local used-set (instant duplicate reject) |

---

## 7. Ticket lifecycle (end to end)

1. **Purchase confirmed** (payment webhook) → create `orders` (paid) and `tickets` rows (UUIDv7 each). For split delivery, each ticket gets its own recipient.
2. **Sign** each ticket server-side with the event's active private key (KMS); store `signing_key_id` + `signature`; build the QR payload.
3. **Deliver** per `ticket_deliveries` (email/SMS/WhatsApp); resends reuse the same QR unless explicitly regenerated+voided.
4. **Sales close** at `events.sales_close_at` → block new purchases → seal manifest, bump `manifest_version`, set `manifest_sealed_at`.
5. **Manifest download** to assigned `scanner_devices` — the **full manifest** (all valid ticket IDs + the event's public key + status snapshot), stored in local SQLite. Record each device's **monotonic-clock offset against the server timestamp** here, for cross-device scan ordering later.
6. **Scan (online):** verify signature → server marks used, broadcasts over the real-time channel → instant cross-gate consistency.
7. **Scan (offline):** verify signature locally → check local + peer used-set → admit and mark used locally → gossip to peers → queue `ticket_scans` for server sync.
8. **Reconnect:** offline scans sync to server; conflicts resolved first-scan-wins; flagged rows (`is_conflict`) reviewed; post-event integrity report generated.

---

## 8. Resolved decisions

These are settled. Implement to them.

1. **Signing key scope — PER EVENT.** Keep `event_signing_keys` as modelled and populate `tickets.signing_key_id` on every ticket. A leaked key endangers only that one event. Generate a fresh Ed25519 key pair at event creation (or first ticket issuance); private key in KMS, public key shipped in that event's manifest.

2. **Peer-sync transport — APP-ONLY Wi-Fi DIRECT MESH (no infrastructure).** Scanner devices connect **directly to each other** (Wi-Fi Direct / Wi-Fi Aware / local hotspot, Xender-style — one device hosts, peers join) and gossip "used" records in a **multi-hop mesh** so records chain across short hops to reach all gates. No router, coordinator box, or internet required for the common case. See §5.1 for the full transport/propagation/range treatment. Design implications:
   - Build **multi-hop gossip** (§5.1.2), not just single-hop pairing — the mesh must self-heal as devices join/leave/sleep.
   - Budget **~10–30 m per hop** in a crowd (§5.1.3); rely on gates being **clustered** (§5.1.4), which they usually are.
   - Gossip payload stays compact: `{ticket_id, event_id, device_id, scanned_at_monotonic, scanned_at_wall}`.
   - **Cluster bridging** (§5.1.5) — relay device, then optional Pro coordinator box — handles only the minority of spread-out/multi-entrance venues. Not baseline.
   - Devices must stay **foreground, screen-on, charging** so the OS doesn't kill the mesh (§5.1.6).

3. **Clock trust — MONOTONIC.** First-scan-wins ordering uses each device's **monotonic clock**, not wall-clock time (wall clocks drift and can be tampered with offline). Consequence to handle explicitly:
   - Monotonic clocks are **per-device** and not comparable across devices directly. To order scans from *different* gates, establish a **shared reference at manifest download** (record each device's monotonic offset against a single server timestamp at sync time), then compare using `(server_reference + monotonic_delta)`.
   - Persist both the monotonic reading and the derived wall-clock estimate on each `ticket_scans` row so reconciliation can order cross-device scans and the server can audit them.
   - Ties (or unresolvable ordering) break deterministically by `device_id`. Store a stable per-device ordinal so this is reproducible.

4. **Rotating QR — NOT USED.** All tickets are static, printable/screenshottable QR codes (preserves the "email me the ticket" flow). Copied-ticket defence therefore rests entirely on the **Wi-Fi Direct gossip mesh (§5.1) + the local used-set**, with detect-and-deter (§5.4) as the safety net. Accept that a copied ticket admitted at two gates *within the propagation window* is possible; the window is sub-second on a healthy mesh. If a specific event later needs stronger protection, revisit §5.3 — the design doesn't preclude adding it per-event.

5. **Manifest — FULL MANIFEST PER DEVICE.** Every scanner device downloads the complete sealed manifest for its event (all valid ticket IDs + the event's public key + status snapshot). Simpler and makes any device able to scan any gate. Consequences to size for:
   - **Download time / size:** budget the manifest at roughly a few hundred KB to low MB for typical events; verify the 100k-ticket target from the PRD (§4.3 NFRs: 100k-ticket manifest sync in < 2 min on 4G) holds with full — not sharded — manifests.
   - **On-device memory:** the used-set grows with admissions; a full ticket-ID index must fit comfortably on a mid-range Android device. Store the manifest in local SQLite (per PRD §4.1), not in memory, and index by ticket_id.
   - This decision means there is **no gate-sharding logic** to build now. If a future mega-event (>250k tickets) strains devices, sharding can be added without schema change.

6. **Resend — REUSE SAME QR.** Resending a ticket re-delivers the identical, still-valid QR; the QR is **not** regenerated on resend (matches PRD §3.6). The signature and used-state are unchanged, so a resent ticket and its original are the same ticket — the used-set naturally prevents double-admission. The "regenerate & void old" path remains available only as an explicit, audit-logged action for genuinely compromised tickets, never as the default resend behaviour.

7. **Scanner mesh platform — PER-EVENT CHOICE (homogeneous within an event).** The organiser selects the mesh transport at event setup: **Android mesh** (default), **iPhone mesh**, or **shared Wi-Fi/LAN**. The constraint is only that the two *direct device-to-device* modes can't mix iOS and Android within one event — so a single event's scanners must all be on the same one. **Shared Wi-Fi mode is platform-agnostic** and lets mixed iOS/Android teams work (they gossip over the LAN, not device-to-device); it's also the natural path to the optional Pro coordinator box (§5.1.5). Android stays the *recommended default* (best support, cheapest devices in the launch market), not a mandate — forcing Android on a small all-iPhone team makes no sense. Store the selected mode on the event (see PRD §3.2 / `events.scanner_mesh_mode`).

### Net effect on the copied-ticket defence

With rotating QRs off (decision 4) and static printable tickets, the **only** thing standing between a screenshotted ticket and multiple admissions is the **Wi-Fi Direct gossip mesh (decision 2)**. That makes multi-hop gossip and its propagation latency **core, launch-blocking scanner features**, not nice-to-haves. Two things follow:

- **Treat the propagation window as a measured number.** Test real gossip latency on representative Android hardware and gate layouts; target sub-second within a cluster.
- **Lean on clustered geography (§5.1.4), which does most of the work for free.** Most events have one clustered entrance where the mesh is trivial. Build the relay-device / Pro-box cluster-bridging (§5.1.5) only for the minority of spread-out venues — and use early real events to measure how often that minority actually shows up before investing in hardware.
