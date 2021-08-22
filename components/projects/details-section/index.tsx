import React from "react";
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
  Textarea,
  Alert,
  AlertIcon,
  Fade,
  useColorModeValue,
  Spinner,
  Heading,
  Text,
  Tabs,
  Tab,
  TabPanel,
  TabPanels,
  Icon,
  Flex,
  SimpleGrid,
  TabList,
} from "@chakra-ui/react";

import { useFlagMutation } from "hooks";

import { useRouter } from "next/dist/client/router";
import { ArrowBackIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
import { truncate } from "lodash";

import { HiArchive } from "react-icons/hi";

const DetailsSection = ({
  selectedFlag,
  project,
  setName,
  isEditingFlag,
  setEditingFlag,
  setSelectedFlag,
  usedFlags,
  name,
  description,
  setDescription,
}) => {
  const router = useRouter();
  const flagMutation = useFlagMutation();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <div>
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
                  <FormControl maxW={300} display="flex" alignItems="center">
                    <FormLabel fontSize="xl" htmlFor="realease toggle" mb="0">
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
                  Archiving the flag will automatically turn it off for all the
                  projects where it is used.
                </Alert>
              </TabPanel>
              {/* <TabPanel>
              <p>three!</p>
            </TabPanel> */}
            </TabPanels>
          </Tabs>
        </Box>
      ) : (
        <SimpleGrid gridGap={2} columns={[1, 2, 3]}>
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
    </div>
  );
};

export default DetailsSection;
