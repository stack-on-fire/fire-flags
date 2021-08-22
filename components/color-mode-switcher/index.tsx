import React from "react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Stack } from "@chakra-ui/layout";
import { Switch } from "@chakra-ui/switch";
import { useColorMode } from "@chakra-ui/color-mode";

export const ColorModeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Stack isInline>
      <SunIcon />
      <Switch
        colorScheme="orange"
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
      />
      <MoonIcon />
    </Stack>
  );
};
