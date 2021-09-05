import prisma from "lib/prisma";

export default async function handle(req, res) {
  const { id } = req.query;

  const logs = await prisma.auditLog.findMany({
    where: {
      flagId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(logs);
}
