import React from "react";
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
} from "@chakra-ui/react";
import { QueryClient } from "react-query";
import BoringAvatar from "boring-avatars";
import { fetchProject, useProject } from "hooks";
import { AiOutlineFire } from "react-icons/ai";
import { dehydrate } from "react-query/hydration";
import { useRouter } from "next/dist/client/router";
import { ArrowBackIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
import { truncate } from "lodash";

const Project = () => {
  const router = useRouter();
  const {
    data: project,
  }: {
    data: ProjectType & { featureFlags: ReadonlyArray<FeatureFlag> };
  } = useProject({ id: router.query.id });
  const selectedFlag = project?.featureFlags.find(
    (flag) => flag.id === router.query.flag
  );
  console.log(selectedFlag);

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
                <Button>Add flag</Button>
              </HStack>
            </VStack>
          </HStack>
        )}
        <Divider my={4} />

        {selectedFlag ? (
          <Box>
            <HStack spacing={4} mb={4}>
              <IconButton
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
                icon={<ArrowBackIcon />}
              />
              <Heading fontSize="xl">{selectedFlag.name}</Heading>
            </HStack>
            <Tabs variant="enclosed">
              <TabList mb="1em">
                <Tab>Main</Tab>
                {/* <Tab>Strategies</Tab>
                <Tab>Settings</Tab> */}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <HStack mb={2}>
                    <Heading fontSize="xl">{selectedFlag.name}</Heading>
                    <IconButton
                      onClick={() => console.log(123)}
                      size="sm"
                      aria-label="Edit"
                      icon={<EditIcon />}
                    />
                  </HStack>
                  <Text mb={4} minW={350}>
                    {selectedFlag.description}
                  </Text>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="realease toggle" mb="0">
                      Enable feature flag?
                    </FormLabel>
                    <Switch
                      colorScheme="green"
                      isChecked={
                        !selectedFlag.isArchived && selectedFlag.isActive
                      }
                      id="release-toggle"
                    />
                  </FormControl>
                </TabPanel>
                {/* <TabPanel>
                  <p>two!</p>
                </TabPanel>
                <TabPanel>
                  <p>three!</p>
                </TabPanel> */}
              </TabPanels>
            </Tabs>
          </Box>
        ) : (
          <SimpleGrid columns={3}>
            {project?.featureFlags.map((flag) => {
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
                      onClick={() =>
                        router.push(
                          {
                            pathname: router.pathname,
                            query: { flag: flag.id },
                          },
                          `${project.id}?flag=${flag.id}`,
                          { shallow: true }
                        )
                      }
                      size="xs"
                      aria-label="Settings"
                      icon={<SettingsIcon />}
                    />

                    <Tooltip
                      placement="top"
                      hasArrow
                      label={flag.name}
                      aria-label="flag name tooltip"
                    >
                      <Text px={1} color="gray.600">
                        {truncate(flag.name, { length: 25 })}
                      </Text>
                    </Tooltip>
                  </HStack>
                  <Switch
                    isChecked={!flag.isArchived && flag.isActive}
                    colorScheme="green"
                    size="md"
                  />
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
