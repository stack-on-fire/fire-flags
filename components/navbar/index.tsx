import {
  Box,
  Button,
  HStack,
  useColorModeValue as mode,
  VisuallyHidden,
  Skeleton,
} from "@chakra-ui/react";

import Link from "next/link";
import * as React from "react";

import { Logo } from "components/logo";
import { useSession } from "next-auth/client";
import { AccountSwitcher } from "components/account";
import { useRouter } from "next/dist/client/router";
export const Navbar = () => {
  const [session, loading] = useSession();
  const router = useRouter();

  const signInComponent = session ? (
    <HStack>
      <AccountSwitcher session={session} />
    </HStack>
  ) : (
    <Link href="/signin">
      <Button>Sign in</Button>
    </Link>
  );
  return (
    <Box as="header" bg={mode("white", "gray.800")} borderBottomWidth="1px">
      <Box maxW="7xl" mx="auto" py="4" px={{ base: "6", md: "8" }}>
        <HStack spacing="8" justifyContent="space-between" alignItems="center">
          <Box
            onClick={() => router.push("/", null, { shallow: true })}
            cursor="pointer"
          >
            <VisuallyHidden>Stack on fire</VisuallyHidden>
            <Logo />
          </Box>

          <Skeleton height="20px" />
          {loading ? <Skeleton height="25px" width={200} /> : signInComponent}
        </HStack>
      </Box>
    </Box>
  );
};
