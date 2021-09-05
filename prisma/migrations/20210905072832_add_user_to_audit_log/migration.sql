/*
  Warnings:

  - Added the required column `userId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Made the column `flagId` on table `AuditLog` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "flagId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
