import React from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";

import { Logo } from "components/logo";
import { LoginForm } from "./login-form";
import { DividerWithText } from "./divider-with-text";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/client";

type Props = {
  variant: "signin";
};

export const Login = ({ variant }: Props) => {
  return (
    <>
      {" "}
      <Box
        maxW="md"
        mx="auto"
        overflowY="auto"
        flex="1"
        py={{ base: "10", md: "16" }}
        px={{ base: "6", md: "10" }}
      >
        <Stack spacing={4} maxW="sm" mx="auto">
          <Center>
            <Logo />
          </Center>
          <Box textAlign="center">
            <Stack>
              <Heading
                as="h1"
                size="xl"
                fontWeight="extrabold"
                letterSpacing="tight"
              >
                {variant === "signin" && "Sign in to your account"}
              </Heading>
              <Heading
                color={useColorModeValue("gray.500", "gray.400")}
                size="md"
              >
                We will send you a magic link
              </Heading>
            </Stack>
          </Box>
          <LoginForm variant={variant} />
        </Stack>
        <Box mt={8} mb={4} maxW={400} marginX="auto">
          <DividerWithText mt={2}>or continue with</DividerWithText>
        </Box>
        <SimpleGrid mt="6" columns={3} spacing="3">
          <Button
            className="gh-sign-in"
            onClick={() =>
              signIn("github", { callbackUrl: "https://dev.stackonfire.dev" })
            }
            variant="outline"
          >
            <VisuallyHidden> Github</VisuallyHidden>
            <FaGithub />
          </Button>
          {/* <Button color="currentColor" variant="outline">
            <VisuallyHidden> Twitter</VisuallyHidden>
            <FaTwitter />
          </Button> */}
        </SimpleGrid>
      </Box>
    </>
  );
};
