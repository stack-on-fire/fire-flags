import { Heading, Stack } from "@chakra-ui/react";
import * as React from "react";
import Image from "next/image";

export const Logo = () => {
  return (
    <Stack isInline alignItems="center">
      <>
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <Heading size="lg">Fire Flags</Heading>
      </>
    </Stack>
  );
};
