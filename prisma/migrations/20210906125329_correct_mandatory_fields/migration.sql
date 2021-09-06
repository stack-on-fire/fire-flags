/*
  Warnings:

  - Made the column `projectId` on table `FeatureFlag` required. This step will fail if there are existing NULL values in that column.
  - Made the column `flagId` on table `Heat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FeatureFlag" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Heat" ALTER COLUMN "flagId" SET NOT NULL;
