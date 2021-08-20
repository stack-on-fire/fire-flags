import prisma from "lib/prisma";

export default async function handle(req, res) {
  const { id } = req.query;
  const { toggleArchive } = req.body;

  const currentProject = await prisma.project.findUnique({
    where: { id },
  });

  const featureFlag = await prisma.project.update({
    where: {
      id,
    },
    data: {
      isArchived: toggleArchive
        ? !currentProject.isArchived
        : currentProject.isArchived,
    },
  });

  res.json(featureFlag);
}
