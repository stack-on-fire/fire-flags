import {
  Stack,
  Flex,
  Circle,
  Text,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import { AuditLog, FeatureFlag } from "@prisma/client";
import React from "react";
import { format } from "date-fns";

const typeToTitle = {
  FLAG_CREATE: "Created feature flag",
  FLAG_UPDATE: "Updated feature flag",
  HEAT_CREATE: "Created heat for flag",
  HEAT_UPDATE: "Updated heat for flag",
  HEAT_DELETE: "Deleted heat for flag",
};

const LogRenderer = ({ log }: { log: AuditLog & { after: FeatureFlag } }) => {
  return (
    <Stack as="li" direction="row" spacing="4">
      <Flex direction="column" alignItems="center" aria-hidden="true">
        <Circle
          bg={useColorModeValue(
            `${
              log.after.isActive && !log.after.isArchived ? "green" : "orange"
            }.500`,
            `${
              log.after.isActive && !log.after.isArchived ? "green" : "orange"
            }.300`
          )}
          size="6"
          borderWidth="4px"
          borderColor={useColorModeValue("white", "gray.800")}
          color={useColorModeValue("white", "black")}
        />
      </Flex>
      <Stack spacing="4" pt="1" flex="1">
        <Flex direction="column">
          <Heading fontSize="md" fontWeight="semibold">
            {typeToTitle[log.type]}
          </Heading>
          <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
            {format(new Date(log.createdAt), "PP p")}
          </Text>
        </Flex>
      </Stack>
    </Stack>
  );
};

export default LogRenderer;
