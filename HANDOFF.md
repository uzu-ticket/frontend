# UzuTicket Backend — Handoff / Where We Dropped Off

Written 2026-07-19, right before switching machines/OS. Read this first when
picking the project back up.

## TL;DR

The M1–M3 backend (see the build plan) is fully scaffolded, and — as of
this session — **verified actually running** against real Postgres/Redis/
MQTT/Mailhog: register → create org → create free event → publish → guest
checkout → signed ticket issued → email delivered → wallet credited, all
confirmed via live HTTP calls, not just code review. Unit tests (14) and
one e2e suite (3 tests, full purchase flow) pass.

**This project is NOT a git repo.** There is no commit history anywhere.
If you're moving to a new machine, copy the whole `server/` directory
(including the gitignored `.env` — see below) rather than relying on git.
Strongly consider running `git init` + an initial commit before doing
anything else, on either the old or new machine, so this stops being fragile.

## Reference docs (read in this order if you're new to the session)

1. `UzuTicket-PRD.docx`, `uzuticket-schema.dbml`,
   `uzuticket-ticket-integrity-and-offline-scanning.md` — the three source
   documents everything was built from.
2. The build plan: `~/.claude/plans/i-have-provide-3-binary-quiche.md` on
   *this* machine. It won't travel with the repo automatically — if you
   want it on the new machine, copy
   `~/.claude/plans/i-have-provide-3-binary-quiche.md` there too, or ask a
   fresh Claude session to reconstruct scope from this file + the code.
3. This file.

## What's built

Full Prisma schema (`prisma/schema.prisma`) mirroring all ~35 DBML tables,
plus two documented deviations (search `DEVIATION FROM DBML` in the schema
and in `src/modules/tickets/signing/README.md`): `SigningKeySecret` (local
KMS stand-in) and a few integrity-doc fields (`totpSecret`,
`syncPriorityOrdinal`, `monotonicOffsetMs`) not in the original DBML.

Real business logic (not stubs): auth (password + OTP + TOTP 2FA),
organisations/roles/KYB gating, events + publish state machine, checkout
with row-locked inventory, Paystack payments with idempotent webhooks,
Ed25519 ticket signing, email delivery + resend, the full scanner backend
(manifest sealing, online/offline scan, first-scan-wins reconciliation),
MQTT+WebSocket realtime, wallets/ledger (credit + debit + refunds),
withdrawals (2FA, risk holds, PSP transfer), sales dashboard.

Stubbed on purpose (Prisma models exist, module skeleton + README only,
explicitly M4/M5 per the plan): `src/modules/promoters/`,
`src/modules/marketing/`, `src/modules/integrations/`.

## Bugs found and fixed by actually running it

Both of these were invisible from static review and only surfaced once the
app hit a real database — worth remembering as the reason "run it for
real" mattered here:

1. **FK-ordering bug in ticket signing** (`signing_key_secrets.id` →
   `event_signing_keys.id`): the signing flow wrote the secret row before
   the parent key row existed. Fixed by splitting `KeyProvider` into
   `generateKeyPair()` (pure) / `persistPrivateKey()` (writes after the
   parent exists), see `src/modules/tickets/signing/`.
2. **`z.coerce.boolean()` on `SMTP_SECURE`**: `Boolean("false")` is `true`
   in JS, so the env var was silently inverted, breaking every email send
   against Mailhog. Fixed with a proper string-literal parser in
   `src/config/env.schema.ts` (see the `booleanString` helper — reuse it
   for any future boolean env var, don't reach for `z.coerce.boolean()`).

Also added `OnApplicationShutdown` hooks for the MQTT client and the
global Redis connection (`src/modules/realtime/mqtt-lifecycle.service.ts`,
`src/common/redis/redis.module.ts`) plus `app.enableShutdownHooks()` in
`main.ts` — these were leaking connections and causing the e2e test
process to hang after tests actually finished.

## Verification status

- `npm run test` — 14/14 unit tests pass (money math, permission bundles,
  QR encode/decode).
- `npm run test:e2e` — 3/3 pass (`test/purchase-flow.e2e-spec.ts`): free
  event publishes without KYB, guest order auto-confirms + issues a signed
  ticket + credits the wallet, replayed `confirmPayment` is a no-op.
- Manually verified live via curl against a running instance: full
  register → org → event → ticket-type → publish → order → ticket → email
  (confirmed delivered in Mailhog) chain.
- **Not yet covered by e2e tests**: scanner offline-sync/conflict
  reconciliation, withdrawal request/2FA/risk-hold flow. These follow the
  same pattern as `purchase-flow.e2e-spec.ts` — worth writing next.
- `npm run lint` has not been run (an `.eslintrc.js`/`.prettierrc` exist
  but were added late in this session and never exercised — expect some
  formatting-only diffs, not logic changes, if you run `--fix`).

## Environment notes (may differ on the new OS)

- **Node**: installed via `nvm`, using v24.18.0. On this machine `node`/
  `npm` were NOT on PATH by default in non-interactive shells — had to
  `export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"` or
  `source ~/.nvm/nvm.sh && nvm use default` per session. Check whether
  your new shell setup sources nvm automatically; if not, same workaround
  applies (or just reinstall Node normally).
- **Docker**: the shell user was not in the `docker` group and had no
  passwordless `sudo`, so `docker compose up -d` needed `sudo` explicitly.
  If the new machine has the same setup, either run compose commands with
  `sudo`, or `sudo usermod -aG docker <user>` and start a fresh shell.
- **`.env`**: exists locally, is gitignored, and holds real generated
  secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`,
  `SIGNING_KEY_MASTER_SECRET` — all 64-char hex — plus placeholder Paystack
  test keys). Copy this file over directly if you want the same secrets
  (e.g. to keep existing signed tickets/JWTs valid), or regenerate fresh
  ones from `.env.example` on the new machine (fine for a dev-only
  environment; nothing production-sensitive is signed yet). If regenerating
  `SIGNING_KEY_MASTER_SECRET`, note any previously-issued tickets' Ed25519
  signatures won't re-verify against a *different* random key — irrelevant
  for a fresh dev DB, but don't regenerate against data you want to keep.
- **Seeded dev login**: `dev@uzuticket.com` / `password123`, org slug
  `dev-organisation` (from `prisma/seed.ts`).

## Claude Code memory won't necessarily follow you

Session memory for this project lives at
`~/.claude/projects/-home-binadiegha-projects-uzu-tickets-server/memory/`
on *this* machine, keyed by the working-directory path. If the new
machine uses the same absolute path (`/home/binadiegha/projects/uzu-tickets/server`)
a fresh Claude session there may or may not pick it up automatically
depending on how the new environment is provisioned — if it doesn't, this
file plus the plan file are the fallback context. Two memory files exist
there worth knowing about even if lost: a note that the build scope is
M1–M3 (not the PRD's own M1-only default), and a preference note that
financial ledgers should include both credit and debit sides even when a
source doc phases them separately.

## Resuming on the new machine

```bash
# 1. Copy the whole server/ directory over (rsync/zip/whatever), including .env
# 2. Node + npm available (see Environment notes above)
cd server
npm install
docker compose up -d          # postgres, redis, mosquitto, mailhog
npx prisma generate
npx prisma migrate deploy     # applies the existing migration in prisma/migrations/
npx prisma db seed            # idempotent — safe to re-run
npm run start:dev
# sanity check:
curl http://localhost:3000/api/categories
```

If `prisma migrate deploy` complains the migration already ran against a
*different* fresh DB (new machine, empty Postgres), that's expected —
it'll apply cleanly from scratch there.
