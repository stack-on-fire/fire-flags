/*
  Warnings:

  - You are about to drop the column `environments` on the `Heat` table. All the data in the column will be lost.
  - You are about to drop the column `users` on the `Heat` table. All the data in the column will be lost.
  - Added the required column `property` to the `Heat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strategy` to the `Heat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Strategy" AS ENUM ('IN', 'NOT_IN');

-- AlterEnum
ALTER TYPE "HeatType" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "Heat" DROP COLUMN "environments",
DROP COLUMN "users",
ADD COLUMN     "property" TEXT NOT NULL,
ADD COLUMN     "strategy" "Strategy" NOT NULL,
ADD COLUMN     "values" TEXT[];
