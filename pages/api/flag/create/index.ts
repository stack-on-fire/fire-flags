import { Prisma } from "@prisma/client";
import prisma from "lib/prisma";

import { generateSlug } from "random-word-slugs";

export default async function handle(req, res) {
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

  await prisma.auditLog.create({
    data: {
      flagId: featureFlag.id,
      type: "FLAG_CREATE",
      after: featureFlag as unknown as Prisma.JsonObject,
    },
  });

  res.json(featureFlag);
}
