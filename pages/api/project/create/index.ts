import prisma from "lib/prisma";
import { getSession } from "next-auth/client";

export default async function handle(req, res) {
  const session = await getSession({ req });
  const { projectName } = req.query;

  const project = await prisma.project.create({
    data: {
      name: projectName,
      userId: String(session.user.id),
    },
  });
  res.json(project);
}
