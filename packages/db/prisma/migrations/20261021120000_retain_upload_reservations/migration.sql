ALTER TABLE "StoredFile"
ADD COLUMN "deletedAt" TIMESTAMP(3),
ADD COLUMN "uploadUrlExpiresAt" TIMESTAMP(3);

-- Existing upload links may remain valid for 15 minutes after this migration.
UPDATE "StoredFile"
SET "uploadUrlExpiresAt" = (CURRENT_TIMESTAMP AT TIME ZONE 'UTC') + INTERVAL '15 minutes';
