import prisma from "lib/prisma";

export default async function handle(req, res) {
  const { id } = req.query;
  const { name, description, toggleActive, toggleArchive } = req.body;

  const currentFeatureFlag = await prisma.featureFlag.findUnique({
    where: { id },
  });
  const toggleActiveFromArchiveOperation = toggleArchive;

  const featureFlag = await prisma.featureFlag.update({
    where: {
      id,
    },
    data: {
      name,
      description,
      isActive:
        toggleActive || toggleActiveFromArchiveOperation
          ? !currentFeatureFlag.isActive
          : currentFeatureFlag.isActive,
      isArchived: toggleArchive
        ? !currentFeatureFlag.isArchived
        : currentFeatureFlag.isArchived,
    },
  });

  res.json(featureFlag);
}
