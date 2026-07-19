# Marketing Email Campaigns — STUB (M5)

Implements PRD §3.7 (Premium feature). Not built in this pass. Prisma
models already exist (`EmailCampaign`, `CampaignRecipient`,
`EmailSuppression`) so this module can be filled in without a migration:

- Premium organisations compose/send campaigns to their accumulated
  customer list, with templates, audience segments (past event / category /
  location — `EmailCampaign.segmentEventId/segmentCategoryId/segmentCity`),
  scheduling, and per-campaign analytics.
- Compliance: mandatory unsubscribe, platform-wide suppression list
  (`EmailSuppression`, `organisationId: null` = global), sending domain
  auth (SPF/DKIM), per-org sending reputation isolation.
- Reuse `NOTIFICATION_PROVIDER` (common/notifications) for the actual send,
  but on a separate marketing sending stream/subdomain from transactional
  ticket delivery — do not reuse the `ticket-delivery` BullMQ queue.
- Non-premium organisations see the feature with an upgrade prompt — there
  is no `organisations.is_premium` gating logic yet; check that flag before
  allowing send.
