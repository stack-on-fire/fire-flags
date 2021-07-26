import {
  Menu,
  MenuItem,
  MenuList,
  useColorModeValue,
  Switch,
  Stack,
  Flex,
  Box,
  useColorMode,
  MenuDivider,
} from "@chakra-ui/react";
import * as React from "react";
import { AccountSwitcherButton } from "./account-switcher-button";
import { signOut } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const AccountSwitcher = ({ session }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const router = useRouter();
  return (
    <Menu>
      <AccountSwitcherButton user={session?.user} />
      <MenuList
        shadow="lg"
        py="4"
        color={useColorModeValue("gray.600", "gray.200")}
        px="3"
      >
        <Flex justifyContent="space-between">
          <Box />
          <Stack ml={3} isInline>
            <SunIcon />
            <Switch
              isChecked={colorMode === "dark"}
              onChange={toggleColorMode}
            />
            <MoonIcon />
          </Stack>
        </Flex>
        <MenuDivider />
        <MenuItem
          onClick={() => {
            router.push("/");
            setTimeout(() => {
              signOut();
            }, 600);
          }}
          rounded="md"
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
