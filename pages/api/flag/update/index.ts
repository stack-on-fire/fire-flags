import { getSession } from "next-auth/client";
import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";
import { sessionMock } from "mocks/handlers";
import { logger } from "lib/pino";

export default async function handle(req, res) {
  const { id } = req.query;

  logger.info(`Updating flag with id ${id}`);

  const session =
    (await getSession({ req })) ||
    (process.env.NODE_ENV === "development" && sessionMock);

  const { name, description, toggleActive, toggleArchive } = req.body;

  logger.debug("starting featureFlag.find");
  const currentFeatureFlag = await prisma.featureFlag.findUnique({
    where: { id },
  });
  const toggleActiveFromArchiveOperation = toggleArchive;

  logger.debug("starting featureFlag.update");
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

  logger.debug("starting auditLog.create");
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
