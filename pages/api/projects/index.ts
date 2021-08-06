import prisma from "lib/prisma";
import { getSession } from "next-auth/client";

export default async function handle(req, res) {
  const session = await getSession({ req });

  const projects = await prisma.project.findMany({
    where: {
      userId: String(session?.user.id),
    },
    include: {
      featureFlags: true,
    },
  });

  res.json(projects);
}
