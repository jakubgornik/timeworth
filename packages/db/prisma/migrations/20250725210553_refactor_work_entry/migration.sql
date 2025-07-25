/*
  Warnings:

  - Added the required column `title` to the `WorkEntry` table without a default value. This is not possible if the table is not empty.
  - Made the column `endedAt` on table `WorkEntry` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hoursWorked` on table `WorkEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WorkEntry" ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "endedAt" SET NOT NULL,
ALTER COLUMN "hoursWorked" SET NOT NULL;
