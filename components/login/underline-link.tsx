import { Box, BoxProps } from "@chakra-ui/react";
import * as React from "react";

export const UnderlineLink = (props: BoxProps) => {
  return (
    <Box
      as="a"
      href="#"
      pos="relative"
      display="inline-block"
      transition="opacity 0.2s"
      _hover={{ opacity: 0.8 }}
      _after={{
        content: `""`,
        display: "block",
        w: "full",
        h: "2px",
        bottom: 0,
        bg: "orange.500",
        insetX: 0,
        insetY: 0,
      }}
      {...props}
    />
  );
};
