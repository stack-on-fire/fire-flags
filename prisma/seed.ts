import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.project.upsert({
    where: {},
    update: {},
    create: {
      name: "Test project one",
      userId: "1",
      featureFlags: {
        create: {
          name: "Test flag 1",
          description: "Test flag 1 description",
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
