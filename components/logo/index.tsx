import {
  Box,
  Heading,
  HTMLChakraProps,
  Stack,
  useMediaQuery,
} from "@chakra-ui/react";
import Image from "next/image";
import * as React from "react";

type ExtendedProps = { preserveText?: boolean };
type Props = HTMLChakraProps<"svg"> & ExtendedProps;

export const Logo = (props: Props) => {
  const [isSmallerThan600px] = useMediaQuery("(max-width: 600px)");

  return (
    <Stack isInline alignItems="center">
      {props.preserveText ? (
        <Heading
          position="relative"
          right="5px"
          fontFamily="Rubik, mono"
          size="lg"
        >
          🔥 Fire Flags 🔥
        </Heading>
      ) : (
        !isSmallerThan600px && (
          <Heading
            position="relative"
            right="5px"
            fontFamily="Rubik, mono"
            size="lg"
          >
            🔥 Fire Flags 🔥
          </Heading>
        )
      )}
    </Stack>
  );
};
