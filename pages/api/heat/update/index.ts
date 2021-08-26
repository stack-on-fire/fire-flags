import prisma from "lib/prisma";
import { uniq } from "lodash";

export default async function handle(req, res) {
  const { id } = req.query;
  const {
    payload: { deleteUserIds, ...rest },
  } = req.body;

  const currentHeat = await prisma.heat.findUnique({
    where: {
      id,
    },
  });

  const usersFromPayload = rest.users ?? [];

  const userIdsToAdd = deleteUserIds
    ? rest.users
    : uniq([...usersFromPayload, ...currentHeat.users]);

  const featureFlag = await prisma.heat.update({
    where: {
      id,
    },
    data: {
      ...rest,
      users: userIdsToAdd,
    },
  });

  res.json(featureFlag);
}
