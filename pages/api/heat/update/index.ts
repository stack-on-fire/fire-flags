import { getSession } from "next-auth/client";
import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";
import { uniq } from "lodash";
import { sessionMock } from "mocks/handlers";

export default async function handle(req, res) {
  const { id } = req.query;
  const session =
    (await getSession({ req })) ||
    (process.env.NODE_ENV === "development" && sessionMock);

  const {
    payload: { values, deleteValues },
  } = req.body;

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

  console.log(flagBefore);

  const valuesFromPayload = values ?? [];

  const valuesToAdd =
    deleteValues || ["ENVIRONMENT"].includes(currentHeat.type)
      ? values
      : uniq([...valuesFromPayload, ...currentHeat.values]);

  const updatedheat = await prisma.heat.update({
    where: {
      id,
    },
    data: {
      values: valuesToAdd,
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
      userId: session.user.id,
      type: "HEAT_UPDATE",
      before: flagBefore as unknown as Prisma.JsonObject,
      after: flagAfter as unknown as Prisma.JsonObject,
    },
  });

  res.json(updatedheat);
}
