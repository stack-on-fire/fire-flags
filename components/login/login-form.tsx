import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  LightMode,
  Stack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { useAppUrl } from "hooks/useAppUrl";
import { signIn } from "next-auth/client";
import Link from "next/link";
import * as React from "react";
import { UnderlineLink } from "./underline-link";

type Props = {
  variant: "signin" | "signup" | "forgot-password";
};

export const LoginForm = ({ variant }: Props) => {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const appUrl = useAppUrl();

  return (
    <form
      onSubmit={(e) => {
        setIsLoading(true);
        e.preventDefault();
        signIn("email", { email, callbackUrl: appUrl });
      }}
    >
      <Stack spacing="-px">
        <FormControl id="email-address">
          <FormLabel srOnly>Email address</FormLabel>
          <Input
            size="lg"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            bg={mode("white", "gray.700")}
            fontSize="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        {/* {variant !== "forgot-password" && (
          <FormControl id="password">
            <FormLabel srOnly>Password</FormLabel>
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              size="lg"
              bg={mode("white", "gray.700")}
              fontSize="md"
              roundedTop="0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </FormControl>
        )} */}
      </Stack>
      {/* {variant === "signin" && (
        <Flex align="center" justify="space-between" mt="8">
          <Box />
          <Link href="/forgot-password">
            <UnderlineLink fontSize="sm">Forgot Password</UnderlineLink>
          </Link>
        </Flex>
      )} */}
      {["forgot-password", "signup"].includes(variant) && (
        <Flex align="center" justify="space-between" mt="8">
          <Box />
          <Link href="/signin">
            <UnderlineLink fontSize="sm">Back to sign in</UnderlineLink>
          </Link>
        </Flex>
      )}
      <LightMode>
        <Button
          isLoading={isLoading}
          size="lg"
          type="submit"
          mt="8"
          w="full"
          colorScheme="orange"
          fontSize="md"
          fontWeight="bold"
        >
          {variant === "signin" && "Sign in"}
          {variant === "signup" && "Sign up"}
          {variant === "forgot-password" && "Submit"}
        </Button>
      </LightMode>
    </form>
  );
};
