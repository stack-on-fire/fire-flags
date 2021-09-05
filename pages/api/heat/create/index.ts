import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";

export default async function handle(req, res) {
  const { flagId } = req.query;
  const { type, strategy, property, name } = req.body;

  if (!type) {
    return res.status(500);
  }

  const flagBefore = await prisma.featureFlag.findUnique({
    where: {
      id: flagId,
    },
  });

  const heat = await prisma.heat.create({
    data: {
      type,
      name,
      strategy: strategy
        ? strategy
        : ["ENVIRONMENT", "USER_INCLUDE"].includes(type)
        ? "IN"
        : "NOT_IN",
      property:
        property ??
        ((type === "ENVIRONMENT" && "environment") ||
          (["USER_EXCLUDE", "USER_INCLUDE"].includes(type) && "users")),
      FeatureFlag: {
        connect: {
          id: flagId,
        },
      },
    },
  });

  const flagAfter = await prisma.featureFlag.findUnique({
    where: {
      id: flagId,
    },
  });

  await prisma.auditLog.create({
    data: {
      flagId: flagId,
      type: "HEAT_CREATE",
      before: flagBefore as unknown as Prisma.JsonObject,
      after: flagAfter as unknown as Prisma.JsonObject,
    },
  });

  res.json(heat);
}
