-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "date_of_birth" TIMESTAMP(3),
ADD COLUMN     "state" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "preferred_currency" TEXT DEFAULT 'NGN',
ADD COLUMN     "marketing_opt_in" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_active_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "sales_close_type" TEXT,
ADD COLUMN     "email_reminders" JSONB;

-- AlterTable
ALTER TABLE "event_images" ADD COLUMN     "aspect_ratio" TEXT DEFAULT '16:9',
ADD COLUMN     "alt_text" TEXT;

-- AlterTable
ALTER TABLE "ticket_types" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "order_number" TEXT,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "discount_minor" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "promo_code" TEXT;

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "ticket_number" TEXT;

-- AlterTable
ALTER TABLE "event_signing_keys" ADD COLUMN     "activated_at" TIMESTAMP(3),
ADD COLUMN     "revoked_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ticket_scans" ADD COLUMN     "resolution_status" TEXT DEFAULT 'none',
ADD COLUMN     "resolved_by" UUID,
ADD COLUMN     "resolved_at" TIMESTAMP(3),
ADD COLUMN     "resolution_notes" TEXT;

-- AlterTable
ALTER TABLE "withdrawals" ADD COLUMN     "bank_name" TEXT,
ADD COLUMN     "fee_minor" BIGINT NOT NULL DEFAULT 50000,
ADD COLUMN     "net_amount_minor" BIGINT,
ADD COLUMN     "verified_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "email_campaigns" ADD COLUMN     "name" TEXT,
ADD COLUMN     "type" TEXT DEFAULT 'email',
ADD COLUMN     "goal" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "audience_source" TEXT DEFAULT 'all',
ADD COLUMN     "preheader" TEXT;

-- AlterTable
ALTER TABLE "api_keys" ADD COLUMN     "environment" TEXT DEFAULT 'live',
ADD COLUMN     "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "org_integrations" (
    "id" UUID NOT NULL,
    "organisation_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_connected" BOOLEAN NOT NULL DEFAULT true,
    "public_key" TEXT,
    "secret_key" TEXT,
    "webhook_url" TEXT,
    "audience_id" TEXT,
    "pixel_id" TEXT,
    "measurement_id" TEXT,
    "settings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_number_key" ON "orders"("order_number");

-- CreateIndex
CREATE UNIQUE INDEX "orders_reference_key" ON "orders"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_ticket_number_key" ON "tickets"("ticket_number");

-- CreateIndex
CREATE UNIQUE INDEX "org_integrations_organisation_id_provider_key" ON "org_integrations"("organisation_id", "provider");

-- CreateIndex
CREATE INDEX "org_integrations_organisation_id_idx" ON "org_integrations"("organisation_id");

-- AddForeignKey
ALTER TABLE "ticket_scans" ADD CONSTRAINT "ticket_scans_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_integrations" ADD CONSTRAINT "org_integrations_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
