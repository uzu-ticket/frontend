-- AlterTable
ALTER TABLE "ticket_types" ADD COLUMN     "schedule_id" UUID;

-- CreateTable
CREATE TABLE "event_schedules" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "schedule_date" DATE,
    "start_time" TEXT,
    "end_time" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_schedules_event_id_position_idx" ON "event_schedules"("event_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "event_schedules_event_id_id_key" ON "event_schedules"("event_id", "id");

-- CreateIndex
CREATE INDEX "ticket_types_schedule_id_idx" ON "ticket_types"("schedule_id");

-- AddForeignKey
ALTER TABLE "event_schedules" ADD CONSTRAINT "event_schedules_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_types" ADD CONSTRAINT "ticket_types_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "event_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
