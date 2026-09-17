ALTER TABLE "events"
  ADD COLUMN "country" TEXT,
  ADD COLUMN "state" TEXT,
  ADD COLUMN "event_slot" TEXT,
  ADD COLUMN "slots" JSONB;