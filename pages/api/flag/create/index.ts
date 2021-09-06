import { getSession } from "next-auth/client";
import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";

import { generateSlug } from "random-word-slugs";
import { sessionMock } from "mocks/handlers";

export default async function handle(req, res) {
  const session =
    (await getSession({ req })) ||
    (process.env.NODE_ENV === "development" && sessionMock);

  const { projectId } = req.query;
  const name = generateSlug(3, {
    format: "kebab",
    partsOfSpeech: ["adjective", "adjective", "noun"],
    categories: {
      adjective: ["color", "personality"],
      noun: ["animals"],
    },
  });

  const featureFlag = await prisma.featureFlag.create({
    data: {
      name,
      Project: {
        connect: {
          id: projectId,
        },
      },
    },
  });

  console.log(session.user.id);

  await prisma.auditLog.create({
    data: {
      flagId: featureFlag.id,
      userId: session.user.id,
      type: "FLAG_CREATE",
      after: featureFlag as unknown as Prisma.JsonObject,
    },
  });

  res.json(featureFlag);
}
