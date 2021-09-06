import { getSession } from "next-auth/client";
import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";
import { sessionMock } from "mocks/handlers";

export default async function handle(req, res) {
  const { flagId } = req.query;
  const { type, strategy, property, name } = req.body;
  const session =
    (await getSession({ req })) ||
    (process.env.NODE_ENV === "development" && sessionMock);

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
      userId: session.user.id,
      type: "HEAT_CREATE",
      before: flagBefore as unknown as Prisma.JsonObject,
      after: flagAfter as unknown as Prisma.JsonObject,
    },
  });

  res.json(heat);
}
