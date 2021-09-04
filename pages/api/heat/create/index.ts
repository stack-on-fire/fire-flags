import prisma from "lib/prisma";

export default async function handle(req, res) {
  const { flagId } = req.query;
  const { type, strategy, property, name } = req.body;

  if (!type) {
    return res.status(500);
  }

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

  res.json(heat);
}
