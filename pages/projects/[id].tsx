import React, { useState } from "react";
import { Navbar } from "components";
import { Project as ProjectType, FeatureFlag } from "@prisma/client";
import {
  Box,
  HStack,
  Divider,
  Button,
  Switch,
  IconButton,
  FormControl,
  FormLabel,
  Tooltip,
  Input,
  Code,
  Spinner,
  useClipboard,
  VStack,
  Heading,
  Text,
  Skeleton,
  useMediaQuery,
} from "@chakra-ui/react";
import { QueryClient } from "react-query";
import {
  fetchProject,
  useFlagMutation,
  useProject,
  useProjectMutation,
} from "hooks";
import { dehydrate } from "react-query/hydration";
import { useRouter } from "next/dist/client/router";
import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import Fuse from "fuse.js";
import { useAppUrl } from "hooks/useAppUrl";
import FireFeature from "components/fire-feature";
import Breadcrumbs from "components/projects";
import ProjectSection from "components/projects/project-section";
import DetailsSection from "components/projects/details-section";
import { truncate } from "lodash";

const Project = () => {
  const router = useRouter();
  const flagMutation = useFlagMutation();
  const projectMutation = useProjectMutation();
  const [isSmallerThan600px] = useMediaQuery("(max-width: 600px)");

  const appUrl = useAppUrl();

  const {
    data: project,
  }: {
    data: ProjectType & { featureFlags: ReadonlyArray<FeatureFlag> };
  } = useProject({ id: router.query.id });
  const selectedFlag = project?.featureFlags.find(
    (flag) => flag.id === router.query.flag
  );

  const [isEditingFlag, setEditingFlag] = useState(false);
  const [isEditingProject, setEditingProject] = useState(false);
  const [name, setName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    if (selectedFlag) {
      setName(selectedFlag.name);
      setDescription(selectedFlag.description);
    }
  }, [project, selectedFlag]);

  useEffect(() => {
    setEditingFlag(false);
    if (selectedFlag) {
      setName(selectedFlag.name);
      setDescription(selectedFlag.description);
    }
    if (project) {
      setProjectName(project.name);
    }
  }, [router.pathname, selectedFlag, project]);

  const setSelectedFlag = (flag: FeatureFlag) =>
    router.push(
      {
        pathname: router.pathname,
        query: { flag: flag.id },
      },
      `${project.id}?flag=${flag.id}`,
      { shallow: true }
    );

  const options = {
    includeScore: true,
    keys: ["name"],
  };
  const fuse = new Fuse(project?.featureFlags, options);
  const result = project?.featureFlags ? fuse.search(searchString) : [];
  const usedFlags = searchString
    ? result.map(({ item }) => item)
    : project?.featureFlags;

  const accessUrl = `${appUrl}/api/flags/${project?.id}`;
  const { hasCopied, onCopy } = useClipboard(accessUrl);

  return (
    <>
      <Navbar />
      <Box p={4} maxW={1200} mx="auto">
        <Breadcrumbs selectedFlag={selectedFlag} project={project} />
        {project ? (
          <ProjectSection project={project} setSelectedFlag={setSelectedFlag} />
        ) : (
          <HStack alignItems="center">
            <Skeleton height={100} width={100} />
            <VStack>
              <Skeleton height={8} width={300} />
              <Skeleton height={8} width={300} />
            </VStack>
          </HStack>
        )}
        <FireFeature flagName="project link">
          <Box>
            <Code mt={4}>
              {truncate(accessUrl, { length: isSmallerThan600px ? 25 : 100 })}
            </Code>
            <Button size="xs" onClick={onCopy} ml={2}>
              {hasCopied ? "Copied" : "Copy"}
            </Button>
          </Box>
        </FireFeature>
        <Divider my={4} />
        {router.query.settings === "true" ? (
          <Box>
            <HStack mb={4}>
              <Button
                onClick={() =>
                  router.push(
                    {
                      pathname: router.pathname,
                    },
                    `${project.id}`,
                    { shallow: true }
                  )
                }
                size="md"
                aria-label="Back arrow"
                leftIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              <Heading size="md">Project settings</Heading>
            </HStack>

            <HStack mb={2}>
              {isEditingProject ? (
                <Input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  size="sm"
                />
              ) : (
                <Text fontSize="lg">{project?.name}</Text>
              )}
              {isEditingProject ? (
                <Button
                  onClick={() => {
                    projectMutation.mutate({
                      id: project.id,
                      name: projectName,
                    });
                    setEditingProject(false);
                  }}
                >
                  Save
                </Button>
              ) : (
                <IconButton
                  onClick={() => setEditingProject(!isEditingProject)}
                  size="sm"
                  aria-label="Edit"
                  icon={<EditIcon />}
                />
              )}
            </HStack>
            <Tooltip label="Archive project.">
              <FormControl maxW={300} display="flex" alignItems="center">
                <FormLabel fontSize="lg" htmlFor="realease toggle" mb="0">
                  Archive project?
                </FormLabel>
                <Switch
                  onChange={() =>
                    projectMutation.mutate({
                      id: project.id,
                      toggleArchive: true,
                    })
                  }
                  size="md"
                  colorScheme="green"
                  isChecked={project?.isArchived}
                  id="release-toggle"
                />
                {flagMutation.isLoading && (
                  <Spinner color="gray" ml={1} size="xs" />
                )}
              </FormControl>
            </Tooltip>
          </Box>
        ) : (
          <Box>
            {!selectedFlag && (
              <Box mb={4}>
                <Input
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  placeholder="Search feature flags"
                />
              </Box>
            )}
            <DetailsSection
              project={project}
              selectedFlag={selectedFlag}
              setName={setName}
              isEditingFlag={isEditingFlag}
              setEditingFlag={setEditingFlag}
              usedFlags={usedFlags}
              name={name}
              description={description}
              setDescription={setDescription}
              setSelectedFlag={setSelectedFlag}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default Project;

export const getServerSideProps = async ({ query }) => {
  const projectId = query.id;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["project", projectId], () =>
    fetchProject(projectId)
  );

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
