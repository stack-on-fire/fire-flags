/*
  Warnings:

  - You are about to drop the column `environments` on the `Heat` table. All the data in the column will be lost.
  - You are about to drop the column `users` on the `Heat` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Strategy" AS ENUM ('IN', 'NOT_IN');

-- AlterEnum
ALTER TYPE "HeatType" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "Heat" DROP COLUMN "environments",
DROP COLUMN "users",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "property" TEXT NOT NULL DEFAULT E'users',
ADD COLUMN     "strategy" "Strategy" NOT NULL DEFAULT E'IN',
ADD COLUMN     "values" TEXT[];
