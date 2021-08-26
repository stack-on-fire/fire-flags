-- CreateEnum
CREATE TYPE "HeatType" AS ENUM ('ENVIRONMENT', 'USER_INCLUDE', 'USER_EXCLUDE');

-- CreateTable
CREATE TABLE "Heat" (
    "id" TEXT NOT NULL,
    "flagId" TEXT,
    "type" "HeatType" NOT NULL DEFAULT E'ENVIRONMENT',
    "environments" TEXT[],
    "users" TEXT[],

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Heat" ADD FOREIGN KEY ("flagId") REFERENCES "FeatureFlag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
