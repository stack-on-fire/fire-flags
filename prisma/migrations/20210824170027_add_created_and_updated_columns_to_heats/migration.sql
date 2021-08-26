/*
  Warnings:

  - Added the required column `updated_at` to the `Heat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Heat" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
