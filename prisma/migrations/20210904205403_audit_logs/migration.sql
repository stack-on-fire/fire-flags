-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "flagId" TEXT,
    "type" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuditLog" ADD FOREIGN KEY ("flagId") REFERENCES "FeatureFlag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
