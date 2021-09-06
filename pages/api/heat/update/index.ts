import prisma from "lib/prisma";
import { uniq } from "lodash";

export default async function handle(req, res) {
  const { id } = req.query;
  const {
    payload: { values, deleteValues },
  } = req.body;

  const currentHeat = await prisma.heat.findUnique({
    where: {
      id,
    },
  });

  const valuesFromPayload = values ?? [];

  console.log("values from payload", valuesFromPayload);

  const valuesToAdd =
    deleteValues || ["ENVIRONMENT"].includes(currentHeat.type)
      ? values
      : uniq([...valuesFromPayload, ...currentHeat.values]);

  const featureFlag = await prisma.heat.update({
    where: {
      id,
    },
    data: {
      values: valuesToAdd,
    },
  });

  res.json(featureFlag);
}
