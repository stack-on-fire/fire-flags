import {
  Box,
  Flex,
  FlexProps,
  HStack,
  useMediaQuery,
  useMenuButton,
} from "@chakra-ui/react";
import * as React from "react";
import Avatar from "boring-avatars";
import { HiSelector } from "react-icons/hi";
import { User } from "@prisma/client";

export const AccountSwitcherButton = (props: FlexProps & { user: User }) => {
  const buttonProps = useMenuButton(props);
  const [isSmallerThan600px] = useMediaQuery("(max-width: 600px)");

  return (
    <Flex
      className="signed-in"
      as="button"
      {...buttonProps}
      display="flex"
      alignItems="center"
      rounded="lg"
      px="3"
      py="2"
      fontSize="sm"
      userSelect="none"
      cursor="pointer"
      outline="0"
      transition="all 0.2s"
      _focus={{ shadow: "outline" }}
    >
      <HStack flex="1" spacing={2}>
        <Avatar
          size={40}
          name={props.user.email || props.user.name}
          variant="ring"
          colors={["#B31237", "#F03813", "#FF8826", "#FFB914", "#2C9FA3"]}
        />
        {!isSmallerThan600px && (
          <Box textAlign="start">
            <Box isTruncated fontWeight="semibold">
              {props.user.email || props.user.name}
            </Box>
          </Box>
        )}
        <Box fontSize="lg" color="gray.400">
          <HiSelector />
        </Box>
      </HStack>
    </Flex>
  );
};
