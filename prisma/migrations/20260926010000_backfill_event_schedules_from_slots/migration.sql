INSERT INTO "event_schedules" (
  "id",
  "event_id",
  "name",
  "schedule_date",
  "start_time",
  "end_time",
  "position",
  "created_at",
  "updated_at"
)
SELECT
  gen_random_uuid(),
  events."id",
  COALESCE(NULLIF(slot.value->>'name', ''), 'Schedule ' || slot.ordinality::text),
  NULLIF(LEFT(slot.value->>'dateObj', 10), '')::date,
  NULLIF(slot.value->>'startTime', ''),
  NULLIF(slot.value->>'endTime', ''),
  (slot.ordinality - 1)::integer,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "events" AS events
CROSS JOIN LATERAL jsonb_array_elements(
  CASE
    WHEN jsonb_typeof(events."slots") = 'array' THEN events."slots"
    ELSE '[]'::jsonb
  END
) WITH ORDINALITY AS slot(value, ordinality)
WHERE NOT EXISTS (
  SELECT 1
  FROM "event_schedules" AS existing
  WHERE existing."event_id" = events."id"
);