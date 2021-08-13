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
} from "@chakra-ui/react";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import BoringAvatar from "boring-avatars";
import { fetchProject, useFlagMutation, useProject } from "hooks";
import { AiOutlineFire } from "react-icons/ai";
import { dehydrate } from "react-query/hydration";
import { useRouter } from "next/dist/client/router";
import { ArrowBackIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
import { truncate } from "lodash";
import { useEffect } from "react";
import { HiArchive } from "react-icons/hi";
import Fuse from "fuse.js";

const Project = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const flagMutation = useFlagMutation();

  const {
    data: project,
  }: {
    data: ProjectType & { featureFlags: ReadonlyArray<FeatureFlag> };
  } = useProject({ id: router.query.id });
  const selectedFlag = project?.featureFlags.find(
    (flag) => flag.id === router.query.flag
  );

  const [isEditingFlag, setEditingFlag] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    if (selectedFlag) {
      setName(selectedFlag.name);
      setDescription(selectedFlag.description);
    }
  }, [project]);

  useEffect(() => {
    setEditingFlag(false);
    if (selectedFlag) {
      setName(selectedFlag.name);
      setDescription(selectedFlag.description);
    }
  }, [router.pathname, selectedFlag]);

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
        `http://localhost:3000/api/flag/create?projectId=${project.id}`
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

  return (
    <>
      <Navbar />
      <Box p={4}>
        <Breadcrumb mb={8}>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => router.push("/")} href="/">
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem color={selectedFlag ? undefined : "gray.400"}>
            <BreadcrumbLink
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              {project?.name}
            </BreadcrumbLink>
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
              <Heading>{project.name}</Heading>
              <HStack spacing={4}>
                <HStack spacing={0}>
                  <Icon as={AiOutlineFire} w={8} h={8} color="red.400" />
                  <Box>{project.featureFlags.length}</Box>
                </HStack>
                <Button
                  onClick={() => {
                    createFlagMutation.mutate();
                  }}
                >
                  Add flag
                </Button>
              </HStack>
            </VStack>
          </HStack>
        )}
        <Divider my={4} />
        <Box mb={4}>
          <Input
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            placeholder="Search feature flags"
          />
        </Box>

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
                <Fade in={selectedFlag.isArchived}>
                  <Icon
                    position="relative"
                    left={-2}
                    top={-0.5}
                    as={HiArchive}
                    color="gray.500"
                  />
                </Fade>
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
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="realease toggle" mb="0">
                      Enable feature flag?
                    </FormLabel>
                    <Switch
                      onChange={() => {
                        flagMutation.mutate({
                          id: selectedFlag.id,
                          toggleActive: true,
                        });
                      }}
                      colorScheme="green"
                      isChecked={
                        !selectedFlag.isArchived && selectedFlag.isActive
                      }
                      id="release-toggle"
                    />
                  </FormControl>
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
                  </HStack>
                  <Alert status="warning">
                    <AlertIcon />
                    Archiving the flag will automatically turn it off for all
                    the projects where it's used.
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
                  alignItems="center"
                  justifyContent="space-between"
                  p={4}
                  border="1px solid"
                  borderColor="gray.400"
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
                        color={useColorModeValue("gray.600", "gray.300")}
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
                    <Switch
                      onChange={() =>
                        flagMutation.mutate({ id: flag.id, toggleActive: true })
                      }
                      isChecked={!flag.isArchived && flag.isActive}
                      colorScheme="green"
                      size="md"
                    />
                  )}
                </Flex>
              );
            })}
          </SimpleGrid>
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
