import prisma from "lib/prisma";

export default async function handle(req, res) {
  const flags = await prisma.featureFlag.findMany({
    where: {
      projectId: String(req.query.projectId),
    },
  });

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
  res.status(200).json(flags);
}
