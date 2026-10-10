-- Add s3_key column to event_images for storing the S3 object key persistently.
-- This allows the backend to generate presigned GET URLs without relying on
-- a stored, expiring presigned URL. The column is nullable for backwards
-- compatibility — existing rows uploaded via the legacy server-side path or
-- before this migration will have s3_key = NULL and will fall back to the
-- stored url field. Newly uploaded images via the presigned PUT flow will have
-- s3_key populated automatically.

ALTER TABLE "event_images" ADD COLUMN "s3_key" TEXT;
