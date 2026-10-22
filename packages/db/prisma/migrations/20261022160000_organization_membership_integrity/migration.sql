-- Expand in place: retain User.organizationId/User.role and all existing API
-- write shapes. Database triggers populate history and WorkEntry.membershipId.
-- Deploy this migration before the conditional join/create handlers. Older
-- writers remain supported, but cannot overwrite an existing membership.
BEGIN;
SET LOCAL lock_timeout = '5s';
LOCK TABLE "User", "Organization", "WorkEntry" IN SHARE ROW EXCLUSIVE MODE;

-- Report inconsistent legacy records before changing any table. Cross-tenant
-- rows may be corruption or unrecorded history; never guess their ownership.
DO $$
DECLARE issues JSONB;
BEGIN
  SELECT jsonb_agg(to_jsonb(problem)) INTO issues FROM (
    SELECT 'missing_manager' AS reason, o."id" AS "recordId", o."managerId" AS "userId"
    FROM "Organization" o LEFT JOIN "User" u ON u."id" = o."managerId"
    WHERE u."id" IS NULL
    UNION ALL
    SELECT 'manager_membership_or_role', o."id", o."managerId"
    FROM "Organization" o JOIN "User" u ON u."id" = o."managerId"
    WHERE u."organizationId" IS DISTINCT FROM o."id" OR u."role" <> 'MANAGER'
    UNION ALL
    SELECT 'manager_without_managed_organization', u."id", u."id"
    FROM "User" u WHERE u."role" = 'MANAGER' AND NOT EXISTS (
      SELECT 1 FROM "Organization" o WHERE o."id" = u."organizationId" AND o."managerId" = u."id"
    )
    UNION ALL
    SELECT 'work_entry_requires_history_review', w."id", w."userId"
    FROM "WorkEntry" w JOIN "User" u ON u."id" = w."userId"
    WHERE w."organizationId" IS DISTINCT FROM u."organizationId"
    UNION ALL
    SELECT 'duplicate_organization_name', o."id", o."managerId"
    FROM "Organization" o WHERE EXISTS (
      SELECT 1 FROM "Organization" other WHERE lower(other."name") = lower(o."name") AND other."id" <> o."id"
    )
    LIMIT 20
  ) problem;
  IF issues IS NOT NULL THEN
    RAISE EXCEPTION 'Organization integrity preflight failed'
      USING DETAIL = issues::text,
        HINT = 'Resolve the reported legacy records before retrying. This transaction has not changed any data.';
  END IF;
END $$;

CREATE TABLE "OrganizationMembership" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "startedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "endedAt" TIMESTAMPTZ(3),
  CONSTRAINT "OrganizationMembership_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OrganizationMembership_dates_check" CHECK ("endedAt" IS NULL OR "endedAt" >= "startedAt"),
  CONSTRAINT "OrganizationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "OrganizationMembership_id_userId_organizationId_key" ON "OrganizationMembership"("id", "userId", "organizationId");
CREATE UNIQUE INDEX "OrganizationMembership_one_active_user_key" ON "OrganizationMembership"("userId") WHERE "endedAt" IS NULL;
CREATE INDEX "OrganizationMembership_userId_startedAt_idx" ON "OrganizationMembership"("userId", "startedAt");
CREATE INDEX "OrganizationMembership_organizationId_idx" ON "OrganizationMembership"("organizationId");

-- The cutover marks the first recorded membership; do not guess an earlier join
-- date from work-entry timestamps (imports may contain backdated work).
INSERT INTO "OrganizationMembership" ("userId", "organizationId")
SELECT "id", "organizationId" FROM "User" WHERE "organizationId" IS NOT NULL;

ALTER TABLE "WorkEntry" ADD COLUMN "membershipId" TEXT;
UPDATE "WorkEntry" w SET "membershipId" = m."id"
FROM "OrganizationMembership" m
WHERE m."userId" = w."userId" AND m."organizationId" = w."organizationId" AND m."endedAt" IS NULL;
ALTER TABLE "WorkEntry" ALTER COLUMN "membershipId" SET NOT NULL;
CREATE INDEX "WorkEntry_membershipId_idx" ON "WorkEntry"("membershipId");
ALTER TABLE "WorkEntry" ADD CONSTRAINT "WorkEntry_membershipId_userId_organizationId_fkey"
  FOREIGN KEY ("membershipId", "userId", "organizationId")
  REFERENCES "OrganizationMembership"("id", "userId", "organizationId") ON DELETE RESTRICT ON UPDATE RESTRICT;
-- Check immediately, before account deletion can call the external auth provider.
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_managerId_fkey"
  FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
-- Expression uniqueness is maintained in SQL, outside Prisma's schema syntax.
CREATE UNIQUE INDEX "Organization_name_lower_key" ON "Organization"(lower("name"));

CREATE FUNCTION "guard_organization_transition"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  -- Ending a membership (setting NULL) is a separate, explicit operation.
  -- This also rejects a stale older join writer after its competitor commits.
  IF OLD."organizationId" IS NOT NULL AND NEW."organizationId" IS NOT NULL THEN
    RAISE EXCEPTION 'End the current organization membership before assigning another'
      USING ERRCODE = '23514', CONSTRAINT = 'User_organization_transition_check';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER "User_guard_organization_transition" BEFORE UPDATE OF "organizationId" ON "User"
  FOR EACH ROW EXECUTE FUNCTION "guard_organization_transition"();

CREATE FUNCTION "record_organization_membership"() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE changed_at TIMESTAMPTZ(3) := clock_timestamp();
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF OLD."organizationId" IS NOT DISTINCT FROM NEW."organizationId" THEN RETURN NEW; END IF;
    UPDATE "OrganizationMembership" SET "endedAt" = changed_at
    WHERE "userId" = NEW."id" AND "endedAt" IS NULL;
  END IF;
  IF NEW."organizationId" IS NOT NULL THEN
    INSERT INTO "OrganizationMembership" ("userId", "organizationId", "startedAt")
    VALUES (NEW."id", NEW."organizationId", changed_at);
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER "User_record_organization_membership" AFTER INSERT OR UPDATE OF "organizationId" ON "User"
  FOR EACH ROW EXECUTE FUNCTION "record_organization_membership"();

CREATE FUNCTION "assert_user_organization_integrity"(target_user TEXT) RETURNS void LANGUAGE plpgsql AS $$
DECLARE current_user_row "User"%ROWTYPE; active_organization TEXT;
BEGIN
  -- Serialize checks with membership/role changes for this account.
  SELECT * INTO current_user_row FROM "User" WHERE "id" = target_user FOR NO KEY UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  SELECT "organizationId" INTO active_organization FROM "OrganizationMembership"
  WHERE "userId" = target_user AND "endedAt" IS NULL;
  IF active_organization IS DISTINCT FROM current_user_row."organizationId" THEN
    RAISE EXCEPTION 'Current organization and active membership disagree for user %', target_user
      USING ERRCODE = '23514', CONSTRAINT = 'User_active_membership_check';
  END IF;
  IF (current_user_row."role" = 'MANAGER' AND NOT EXISTS (
    SELECT 1 FROM "Organization" WHERE "managerId" = target_user AND "id" = current_user_row."organizationId"
  )) OR (current_user_row."role" <> 'MANAGER' AND EXISTS (
    SELECT 1 FROM "Organization" WHERE "managerId" = target_user
  )) THEN
    RAISE EXCEPTION 'Manager role and organization disagree for user %', target_user
      USING ERRCODE = '23514', CONSTRAINT = 'User_manager_organization_check';
  END IF;
END $$;

CREATE FUNCTION "check_user_organization_integrity"() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_TABLE_NAME = 'User' THEN
    PERFORM "assert_user_organization_integrity"(NEW."id");
  ELSIF TG_TABLE_NAME = 'Organization' THEN
    IF TG_OP <> 'INSERT' THEN PERFORM "assert_user_organization_integrity"(OLD."managerId"); END IF;
    IF TG_OP <> 'DELETE' THEN PERFORM "assert_user_organization_integrity"(NEW."managerId"); END IF;
  ELSE
    IF TG_OP <> 'INSERT' THEN PERFORM "assert_user_organization_integrity"(OLD."userId"); END IF;
    IF TG_OP <> 'DELETE' THEN PERFORM "assert_user_organization_integrity"(NEW."userId"); END IF;
  END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER "User_organization_integrity" AFTER INSERT OR UPDATE ON "User"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "check_user_organization_integrity"();
CREATE CONSTRAINT TRIGGER "Organization_manager_integrity" AFTER INSERT OR UPDATE OR DELETE ON "Organization"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "check_user_organization_integrity"();
CREATE CONSTRAINT TRIGGER "OrganizationMembership_current_integrity" AFTER INSERT OR UPDATE OR DELETE ON "OrganizationMembership"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "check_user_organization_integrity"();

CREATE FUNCTION "assign_work_entry_membership"() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE current_organization TEXT; active_membership TEXT;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW."userId" = OLD."userId" AND NEW."organizationId" = OLD."organizationId"
      AND NEW."membershipId" = OLD."membershipId" THEN RETURN NEW; END IF;
    IF NEW."membershipId" = OLD."membershipId" THEN NEW."membershipId" := NULL; END IF;
  END IF;
  -- SHARE conflicts with membership changes while permitting concurrent work
  -- entries. A transfer cannot invalidate the membership being attached here.
  SELECT "organizationId" INTO current_organization FROM "User" WHERE "id" = NEW."userId" FOR SHARE;
  IF NOT FOUND OR current_organization IS DISTINCT FROM NEW."organizationId" THEN
    RAISE EXCEPTION 'A new work entry requires current organization membership'
      USING ERRCODE = '23514', CONSTRAINT = 'WorkEntry_current_membership_check';
  END IF;
  SELECT "id" INTO active_membership FROM "OrganizationMembership"
  WHERE "userId" = NEW."userId" AND "organizationId" = NEW."organizationId" AND "endedAt" IS NULL;
  IF active_membership IS NULL OR (NEW."membershipId" IS NOT NULL AND NEW."membershipId" <> active_membership) THEN
    RAISE EXCEPTION 'Work entry membership does not match its user and organization'
      USING ERRCODE = '23514', CONSTRAINT = 'WorkEntry_current_membership_check';
  END IF;
  NEW."membershipId" := active_membership;
  RETURN NEW;
END $$;
CREATE TRIGGER "WorkEntry_assign_membership" BEFORE INSERT OR UPDATE OF "userId", "organizationId", "membershipId" ON "WorkEntry"
  FOR EACH ROW EXECUTE FUNCTION "assign_work_entry_membership"();
COMMIT;
