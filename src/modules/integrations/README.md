# Web Integration — API & Iframe Embed — STUB (M4)

Implements PRD §3.11. Not built in this pass. Prisma models already exist
(`ApiKey`, `EmbedAllowedDomain`, `WebhookEndpoint`) so this module can be
filled in without a migration:

- Per-organisation API keys (`ApiKey.keyHash` — hash, never store the raw
  secret) for a versioned public REST API: list events/ticket
  types/availability, create checkout sessions, webhook notifications for
  order events.
- Embed snippet (script tag + button attribute) opening the existing
  hosted checkout (orders module) inside an iframe pop-up on the
  organiser's own domain; restricted to `EmbedAllowedDomain` allow-listed
  origins; CSP/clickjacking protections on whatever route serves the
  iframe content.
- `orders.channel = 'embed'` already exists for attribution — this module
  just needs to set it from the embed checkout flow.
- Outbound webhooks (`WebhookEndpoint.signingSecret`) firing on order
  lifecycle events, HMAC-signed the same way the inbound Paystack webhook
  is verified (payments module) — mirror that pattern rather than
  reinventing it.
