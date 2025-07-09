/*
  Warnings:

  - You are about to drop the column `projectId` on the `WorkEntry` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'AVAILABLE', 'ASSIGNED', 'ON_LEAVE', 'SUSPENDED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "WorkEntry" DROP COLUMN "projectId";
