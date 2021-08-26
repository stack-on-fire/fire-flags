import prisma from "lib/prisma";

export default async function handle(req, res) {
  const { id } = req.query;

  const heat = await prisma.heat.delete({
    where: {
      id,
    },
  });

  res.json(heat);
}
