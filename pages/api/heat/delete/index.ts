import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";

export default async function handle(req, res) {
  const { id } = req.query;

  const currentHeat = await prisma.heat.findUnique({
    where: {
      id,
    },
  });

  const flagBefore = await prisma.featureFlag.findUnique({
    where: {
      id: currentHeat.flagId,
    },
  });

  const deletedHeat = await prisma.heat.delete({
    where: {
      id,
    },
  });

  const flagAfter = await prisma.featureFlag.findUnique({
    where: {
      id: currentHeat.flagId,
    },
  });

  await prisma.auditLog.create({
    data: {
      flagId: currentHeat.flagId,
      type: "HEAT_DELETE",
      before: flagBefore as unknown as Prisma.JsonObject,
      after: flagAfter as unknown as Prisma.JsonObject,
    },
  });

  res.json(deletedHeat);
}
