# Promoters & Commissions — STUB (M4)

Implements PRD §3.10. Not built in this pass — see the plan's milestone
scoping (M1–M3 only). The Prisma models already exist and compile
(`EventPromoter`, `PromoterLink`, `PromoterLinkClick`, `Commission`) so this
module can be filled in without a schema migration:

- Organiser invites a UzuTicket user as a promoter for an event, with a
  commission rule (percentage or fixed-per-ticket, optionally scoped to a
  ticket type).
- Each promoter gets a unique tracked link/QR (`PromoterLink`); clicks
  (`PromoterLinkClick`) attribute orders within a configurable window
  (default 7 days, last-click) via `orders.promoterLinkId` and
  `orders.channel = 'promoter'` (both already wired in the orders module).
- Commissions accrue on confirmed payment, reverse on refund, become
  payable at event completion, and pay out through the same wallet/ledger
  primitives the withdrawals module already provides
  (`WalletsService.getOrCreatePromoterWallet` exists and is unused until
  this module lands).
- Anti-fraud: self-purchase detection, click-flooding limits.
