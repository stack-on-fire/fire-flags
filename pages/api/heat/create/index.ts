import prisma from "lib/prisma";

export default async function handle(req, res) {
  const { flagId } = req.query;
  const { type } = req.body;

  if (!type) {
    return res.status(500);
  }

  const heat = await prisma.heat.create({
    data: {
      type,
      FeatureFlag: {
        connect: {
          id: flagId,
        },
      },
    },
  });

  res.json(heat);
}
