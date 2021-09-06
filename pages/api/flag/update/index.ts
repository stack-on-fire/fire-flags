import { getSession } from "next-auth/client";
import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";
import { sessionMock } from "mocks/handlers";

export default async function handle(req, res) {
  const { id } = req.query;
  const session =
    (await getSession({ req })) ||
    (process.env.NODE_ENV === "development" && sessionMock);

  const { name, description, toggleActive, toggleArchive } = req.body;

  const currentFeatureFlag = await prisma.featureFlag.findUnique({
    where: { id },
  });
  const toggleActiveFromArchiveOperation = toggleArchive;

  const featureFlag = await prisma.featureFlag.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      isActive:
        toggleActive || toggleActiveFromArchiveOperation
          ? !currentFeatureFlag.isActive
          : currentFeatureFlag.isActive,
      isArchived: toggleArchive
        ? !currentFeatureFlag.isArchived
        : currentFeatureFlag.isArchived,
    },
  });

  await prisma.auditLog.create({
    data: {
      flagId: featureFlag.id,
      userId: session.user.id,
      type: "FLAG_UPDATE",
      before: currentFeatureFlag as unknown as Prisma.JsonObject,
      after: featureFlag as unknown as Prisma.JsonObject,
    },
  });

  res.json(featureFlag);
}
