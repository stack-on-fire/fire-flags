import React, { useState } from "react";
import { Navbar } from "components";
import { Project as ProjectType, FeatureFlag } from "@prisma/client";
import {
  Box,
  useColorModeValue as mode,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  Heading,
  VStack,
  Text,
  Icon,
  Divider,
  Button,
  SimpleGrid,
  Flex,
  Switch,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Tooltip,
  Input,
  Textarea,
  Alert,
  AlertIcon,
  Fade,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import BoringAvatar from "boring-avatars";
import {
  fetchProject,
  useFlagMutation,
  useProject,
  useProjectMutation,
} from "hooks";
import { FaFire } from "react-icons/fa";
import { dehydrate } from "react-query/hydration";
import { useRouter } from "next/dist/client/router";
import { ArrowBackIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
import { truncate } from "lodash";
import { useEffect } from "react";
import { HiArchive } from "react-icons/hi";
import Fuse from "fuse.js";
import { useAppUrl } from "hooks/useAppUrl";
import Link from "next/link";

const Project = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const flagMutation = useFlagMutation();
  const projectMutation = useProjectMutation();
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

  const options = {
    includeScore: true,
    keys: ["name"],
  };
  const fuse = new Fuse(project?.featureFlags, options);
  const result = project?.featureFlags ? fuse.search(searchString) : [];
  const usedFlags = searchString
    ? result.map(({ item }) => item)
    : project?.featureFlags;

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <>
      <Navbar />
      <Box p={4}>
        <Breadcrumb mb={8}>
          <BreadcrumbItem>
            <Link href="/" passHref>
              <BreadcrumbLink>Projects</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem color={selectedFlag ? undefined : "gray.400"}>
            <Link
              href={`/projects/[id]`}
              as={`/projects/${project?.id}`}
              passHref
            >
              <BreadcrumbLink>{project?.name}</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          {selectedFlag && (
            <BreadcrumbItem color="gray.500">
              <BreadcrumbLink>{selectedFlag?.name}</BreadcrumbLink>
            </BreadcrumbItem>
          )}
        </Breadcrumb>
        {project && (
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
        )}
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

            {selectedFlag ? (
              <Box>
                <HStack spacing={4} mb={4}>
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
                  <Heading fontSize="xl">{selectedFlag.name}</Heading>
                  {selectedFlag.isArchived && (
                    <Tooltip label="This flag is archived">
                      <Fade in={selectedFlag.isArchived}>
                        <Icon
                          position="relative"
                          left={-2}
                          top={-0.5}
                          as={HiArchive}
                          color="gray.500"
                        />
                      </Fade>
                    </Tooltip>
                  )}
                </HStack>
                <Tabs variant="enclosed">
                  <TabList mb="1em">
                    <Tab>Main</Tab>
                    {/* <Tab>Strategies</Tab> */}
                    <Tab>Settings</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <HStack mb={2}>
                        {isEditingFlag ? (
                          <Input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            size="sm"
                          />
                        ) : (
                          <Heading fontSize="xl">{selectedFlag.name}</Heading>
                        )}
                        {isEditingFlag ? (
                          <Button
                            onClick={() => {
                              flagMutation.mutate({
                                id: selectedFlag.id,
                                name,
                                description,
                              });
                              setEditingFlag(false);
                            }}
                          >
                            Save
                          </Button>
                        ) : (
                          <IconButton
                            onClick={() => setEditingFlag(!isEditingFlag)}
                            size="sm"
                            aria-label="Edit"
                            icon={<EditIcon />}
                          />
                        )}
                      </HStack>
                      {isEditingFlag ? (
                        <Textarea
                          onChange={(e) => setDescription(e.target.value)}
                          size="sm"
                          value={description}
                        />
                      ) : (
                        <Text mb={4} minW={350}>
                          {selectedFlag.description}
                        </Text>
                      )}
                      <Divider mb={4} />
                      <Tooltip
                        isDisabled={!selectedFlag.isArchived}
                        label="This flag is archived. Unarchive before enabling it."
                      >
                        <FormControl
                          maxW={300}
                          display="flex"
                          alignItems="center"
                        >
                          <FormLabel
                            fontSize="xl"
                            htmlFor="realease toggle"
                            mb="0"
                          >
                            Enable feature flag?
                          </FormLabel>
                          <Switch
                            onChange={() => {
                              flagMutation.mutate({
                                id: selectedFlag.id,
                                toggleActive: true,
                              });
                            }}
                            size="md"
                            colorScheme="green"
                            isChecked={
                              !selectedFlag.isArchived && selectedFlag.isActive
                            }
                            isDisabled={selectedFlag.isArchived}
                            id="release-toggle"
                          />
                          {flagMutation.isLoading && (
                            <Spinner color="gray" ml={1} size="xs" />
                          )}
                        </FormControl>
                      </Tooltip>
                    </TabPanel>
                    <TabPanel>
                      <HStack mb={2}>
                        <Heading mb={2} fontSize="lg">
                          Archive flag
                        </Heading>
                        <Switch
                          onChange={() =>
                            flagMutation.mutate({
                              id: selectedFlag.id,
                              toggleArchive: true,
                            })
                          }
                          isChecked={selectedFlag.isArchived}
                          colorScheme="green"
                          size="md"
                        />
                        {flagMutation.isLoading && (
                          <Spinner color="gray" ml={1} size="xs" />
                        )}
                      </HStack>
                      <Alert status="warning">
                        <AlertIcon />
                        Archiving the flag will automatically turn it off for
                        all the projects where it is used.
                      </Alert>
                    </TabPanel>
                    {/* <TabPanel>
                  <p>three!</p>
                </TabPanel> */}
                  </TabPanels>
                </Tabs>
              </Box>
            ) : (
              <SimpleGrid gridGap={2} columns={3}>
                {usedFlags?.map((flag) => {
                  return (
                    <Flex
                      key={flag.id}
                      alignItems="center"
                      justifyContent="space-between"
                      p={4}
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <HStack>
                        <IconButton
                          onClick={() => setSelectedFlag(flag)}
                          size="xs"
                          aria-label="Settings"
                          icon={<SettingsIcon />}
                        />

                        <Tooltip
                          isDisabled={flag.name.length < 25}
                          placement="top"
                          hasArrow
                          label={flag.name}
                          aria-label="flag name tooltip"
                        >
                          <Text
                            onClick={() => setSelectedFlag(flag)}
                            px={1}
                            color={textColor}
                            _hover={{
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            {truncate(flag.name, { length: 25 })}
                          </Text>
                        </Tooltip>
                      </HStack>
                      {flag.isArchived ? (
                        <Icon
                          position="relative"
                          left={-2}
                          top={-0.5}
                          as={HiArchive}
                          color="gray.500"
                        />
                      ) : (
                        <HStack>
                          <Switch
                            onChange={() =>
                              flagMutation.mutate({
                                id: flag.id,
                                toggleActive: true,
                              })
                            }
                            isChecked={!flag.isArchived && flag.isActive}
                            colorScheme="green"
                            size="md"
                          />
                        </HStack>
                      )}
                    </Flex>
                  );
                })}
              </SimpleGrid>
            )}
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
