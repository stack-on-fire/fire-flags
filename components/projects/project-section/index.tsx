import React from "react";
import {
  Box,
  HStack,
  Heading,
  VStack,
  Button,
  IconButton,
  Tooltip,
  Fade,
  Icon,
} from "@chakra-ui/react";
import { HiArchive } from "react-icons/hi";
import { FaFire } from "react-icons/fa";
import BoringAvatar from "boring-avatars";
import { FeatureFlag, Project } from "@prisma/client";
import { useRouter } from "next/dist/client/router";
import { SettingsIcon } from "@chakra-ui/icons";
import { useMutation, useQueryClient } from "react-query";
import { useAppUrl } from "hooks/useAppUrl";

const ProjectSection = ({
  project,
  setSelectedFlag,
}: {
  project: Project & { featureFlags: ReadonlyArray<FeatureFlag> };
  setSelectedFlag: (data: FeatureFlag | undefined) => void;
}) => {
  const router = useRouter();
  const appUrl = useAppUrl();
  const queryClient = useQueryClient();

  const createFlagMutation = useMutation(
    async () => {
      const result = await fetch(
        `${appUrl}/api/flag/create?projectId=${project.id}`
      );
      const json = await result.json();
      return json;
    },
    {
      onSuccess: async (data: FeatureFlag | undefined) => {
        setSelectedFlag(data);
        await queryClient.refetchQueries(["projects"]);
      },
    }
  );

  return (
    <HStack spacing={3} alignItems="start">
      <BoringAvatar
        size={100}
        name={project?.id}
        variant="bauhaus"
        square
        colors={["#B31237", "#F03813", "#FF8826", "#FFB914", "#2C9FA3"]}
      />
      <VStack alignItems="start">
        <HStack>
          <Heading>{project.name}</Heading>
          <Tooltip label="This project is archived">
            <Fade in={project.isArchived}>
              <Icon fontSize="xl" as={HiArchive} color="gray.500" />
            </Fade>
          </Tooltip>
        </HStack>
        <HStack spacing={4}>
          <HStack spacing={0}>
            <Icon as={FaFire} w={8} h={8} color="red.400" />
            <Box>
              {
                project.featureFlags.filter(
                  (flag) => !flag.isArchived && flag.isActive
                ).length
              }
            </Box>
          </HStack>
          <HStack>
            <Button
              onClick={() => {
                createFlagMutation.mutate();
              }}
            >
              Add flag
            </Button>
            <IconButton
              onClick={() =>
                router.push(
                  {
                    pathname: router.pathname,
                    query: { settings: true },
                  },
                  `${project.id}?settings=true`,
                  { shallow: true }
                )
              }
              aria-label="Settings"
              icon={<SettingsIcon />}
            />
          </HStack>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default ProjectSection;
