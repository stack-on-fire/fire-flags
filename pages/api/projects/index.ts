import prisma from "lib/prisma";
import { sessionMock } from "mocks/handlers";
import { getSession } from "next-auth/client";

export default async function handle(req, res) {
  const session =
    (await getSession({ req })) ||
    (process.env.NODE_ENV === "development" && sessionMock);

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
