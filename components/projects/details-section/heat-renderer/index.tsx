import {
  Box,
  Text,
  Checkbox,
  CheckboxGroup,
  HStack,
  Input,
  Button,
  Tag,
  Flex,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
import { Heat } from "@prisma/client";
import { useHeatMutation } from "hooks";
import { useAppUrl } from "hooks/useAppUrl";

import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

const HeatRenderer = ({ heat }: { heat: Heat }) => {
  const appUrl = useAppUrl();
  const queryClient = useQueryClient();
  const [values, setValues] = useState([]);
  const [stringInput, setStringInput] = useState("");

  const heatMutation = useHeatMutation();

  const deleteHeatMutation = useMutation(
    async () => {
      const result = await fetch(`${appUrl}/api/heat/delete?id=${heat.id}`);
      const json = await result.json();
      return json;
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries(["projects"]);
      },
    }
  );

  useEffect(() => {
    setValues(heat.values);
  }, [heat]);

  if (heat.type === "ENVIRONMENT") {
    return (
      <Box mb={8}>
        <HStack mb={2} alignItems="center">
          <Text fontWeight="black" fontSize="lg">
            Environment
          </Text>{" "}
          <Button
            size="sm"
            onClick={() =>
              heatMutation.mutate(
                { id: heat.id, values },
                {
                  onSuccess: () => {
                    toast.success("Successfully modified the heat");
                  },
                  onError: () => {
                    toast.error("Error happened");
                  },
                }
              )
            }
          >
            Save
          </Button>
          <Button
            variant="ghost"
            colorScheme="red"
            size="sm"
            onClick={() =>
              deleteHeatMutation.mutate(null, {
                onSuccess: () => {
                  toast.success("Successfully deleted the heat");
                },
                onError: () => {
                  toast.error("Error happened");
                },
              })
            }
          >
            Delete
          </Button>
        </HStack>
        <CheckboxGroup
          value={values}
          onChange={(e) => setValues(e)}
          colorScheme="gray"
        >
          <HStack>
            <Checkbox value="production">Production</Checkbox>
            <Checkbox value="development">Development</Checkbox>
            <Checkbox value="staging">Staging</Checkbox>
          </HStack>
        </CheckboxGroup>
      </Box>
    );
  }

  if (heat.type === "USER_INCLUDE" || heat.type === "USER_EXCLUDE") {
    return (
      <Box mb={8}>
        <HStack mb={2} alignItems="center">
          <Text fontWeight="black" fontSize="lg">
            {(heat.type === "USER_EXCLUDE" && "Exclude users with IDs") ||
              (heat.type === "USER_INCLUDE" && "Include users with IDs")}
          </Text>
          <Button
            onClick={() => {
              const tokenizedValues = stringInput.split(",").filter((v) => v);
              heatMutation.mutate(
                { id: heat.id, values: tokenizedValues },
                {
                  onSuccess: () => {
                    toast.success("Successfully modified the heat");
                  },
                  onError: () => {
                    toast.error("Error happened");
                  },
                }
              );
              setStringInput("");
            }}
            size="sm"
          >
            Save
          </Button>
          <Button
            variant="ghost"
            colorScheme="red"
            size="sm"
            onClick={() =>
              deleteHeatMutation.mutate(null, {
                onSuccess: () => {
                  toast.success("Successfully deleted the heat");
                },
                onError: () => {
                  toast.error("Error happened");
                },
              })
            }
          >
            Delete
          </Button>
        </HStack>
        <Flex flexWrap="wrap" mb={4}>
          {heat.values.map((id) => {
            return (
              <>
                <Tag
                  variant="subtle"
                  colorScheme={
                    (heat.type === "USER_INCLUDE" && "green") ||
                    (heat.type === "USER_EXCLUDE" && "orange")
                  }
                  key={id}
                  mr={1}
                  mb={1}
                >
                  <TagLabel>{id}</TagLabel>
                  <TagCloseButton
                    onClick={() => {
                      heatMutation.mutate(
                        {
                          id: heat.id,
                          values: heat.values.filter((userId) => userId !== id),
                          deleteValues: true,
                        },
                        {
                          onSuccess: () => {
                            toast.success("Successfully modified the heat");
                          },
                          onError: () => {
                            toast.error("Error happened");
                          },
                        }
                      );
                    }}
                  />
                </Tag>
              </>
            );
          })}
        </Flex>
        <Box maxW={300}>
          <Input
            placeholder="id or list of ids: 123 or 123,467,367"
            size="sm"
            value={stringInput}
            onChange={(e) => setStringInput(e.target.value)}
          />
        </Box>
      </Box>
    );
  }
  if (heat.type === "CUSTOM") {
    return (
      <Box mb={8}>
        <HStack mb={2} alignItems="center">
          <Text fontWeight="black" fontSize="lg">
            {heat.name}
          </Text>
          <Button
            onClick={() => {
              const tokenizedValues = stringInput.split(",").filter((v) => v);
              heatMutation.mutate(
                { id: heat.id, values: tokenizedValues },
                {
                  onSuccess: () => {
                    toast.success("Successfully modified the heat");
                  },
                  onError: () => {
                    toast.error("Error happened");
                  },
                }
              );
              setStringInput("");
            }}
            size="sm"
          >
            Save
          </Button>
          <Button
            variant="ghost"
            colorScheme="red"
            size="sm"
            onClick={() =>
              deleteHeatMutation.mutate(null, {
                onSuccess: () => {
                  toast.success("Successfully deleted the heat");
                },
                onError: () => {
                  toast.error("Error happened");
                },
              })
            }
          >
            Delete
          </Button>
        </HStack>
        <Flex flexWrap="wrap" mb={4}>
          {heat.values.map((id) => {
            return (
              <>
                <Tag
                  variant="subtle"
                  colorScheme={
                    (heat.strategy === "IN" && "green") ||
                    (heat.strategy === "NOT_IN" && "orange")
                  }
                  key={id}
                  mr={1}
                  mb={1}
                >
                  <TagLabel>{id}</TagLabel>
                  <TagCloseButton
                    onClick={() => {
                      heatMutation.mutate(
                        {
                          id: heat.id,
                          values: heat.values.filter((userId) => userId !== id),
                          deleteValues: true,
                        },
                        {
                          onSuccess: () => {
                            toast.success("Successfully modified the heat");
                          },
                          onError: () => {
                            toast.error("Error happened");
                          },
                        }
                      );
                    }}
                  />
                </Tag>
              </>
            );
          })}
        </Flex>
        <Box maxW={300}>
          <Input
            placeholder={`${heat.property} or list of ${heat.property}s: 123 or 123,467,367  `}
            size="sm"
            value={stringInput}
            onChange={(e) => setStringInput(e.target.value)}
          />
        </Box>
      </Box>
    );
  }
};

export default HeatRenderer;
