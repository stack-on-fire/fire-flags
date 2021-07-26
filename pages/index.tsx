import React from "react";

import { Box } from "@chakra-ui/layout";
import { Navbar } from "components";
import { Button, Flex, SimpleGrid } from "@chakra-ui/react";
import { PlusSquareIcon } from "@chakra-ui/icons";
import ProjectCard from "components/project-card";
import { getSession } from "next-auth/client";
import { FeatureFlag, Project } from "@prisma/client";
import prisma from "lib/prisma";

const Index = ({
  projects,
}: {
  projects: ReadonlyArray<
    Project & { featureFlags: ReadonlyArray<FeatureFlag> }
  >;
}) => {
  return (
    <Box>
      <Navbar />
      <Box maxW={1200} mx="auto">
        <Flex
          align="center"
          justify={["center", "center", "left"]}
          borderBottom="1px solid"
          borderColor="gray.300"
          height="80px"
          p={[0, 0, 4]}
          transition="all 0.3s"
        >
          <Button leftIcon={<PlusSquareIcon />}>New Project</Button>
        </Flex>
        <SimpleGrid p={4} columns={[1, 2, 3, 4]} spacing={4}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Index;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const projects = await prisma.project.findMany({
    where: {
      userId: String(session.id),
    },
    include: {
      featureFlags: true,
    },
  });

  return { props: { projects: JSON.parse(JSON.stringify(projects)) } };
};
