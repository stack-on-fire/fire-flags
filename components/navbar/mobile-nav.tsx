import {
  Box,
  Button,
  Center,
  Flex,
  Portal,
  SimpleGrid,
  useBoolean,
  useFocusOnShow,
  VStack,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { Logo } from "components/logo";
import { HTMLMotionProps, motion, Variants } from "framer-motion";
import * as React from "react";
import FocusLock from "react-focus-lock";
import {
  HiBookOpen,
  HiCurrencyDollar,
  HiOutlineMenu,
  HiOutlineX,
} from "react-icons/hi";
import { RemoveScroll } from "react-remove-scroll";
import { NavLink } from "./nav-link";
import { signIn } from "next-auth/client";

const variants: Variants = {
  show: {
    display: "revert",
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  hide: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.1, ease: "easeIn" },
    transitionEnd: { display: "none" },
  },
};

const Backdrop = ({ show }: { show?: boolean }) => (
  <Portal>
    <motion.div
      initial={false}
      animate={show ? "show" : "hide"}
      transition={{ duration: 0.1 }}
      variants={{
        show: { opacity: 1, display: "revert" },
        hide: { opacity: 0, transitionEnd: { display: "none" } },
      }}
      style={{
        width: "100%",
        height: "100vh",
        position: "absolute",
        background: "rgba(0,0,0,0.2)",
        inset: 0,
      }}
    />
  </Portal>
);

const Transition = (props: HTMLMotionProps<"div"> & { in?: boolean }) => {
  const { in: inProp, ...rest } = props;
  return (
    <motion.div
      {...rest}
      initial={false}
      variants={variants}
      animate={inProp ? "show" : "hide"}
      style={{
        transformOrigin: "top right",
        position: "absolute",
        width: "calc(100% - 32px)",
        top: "24px",
        left: "16px",
        margin: "0 auto",
        zIndex: 1,
      }}
    />
  );
};

export const MobileNav = () => {
  const [show, { toggle, off }] = useBoolean();
  const ref = React.useRef<HTMLDivElement>(null);
  useFocusOnShow(ref, { visible: show, shouldFocus: true });

  return (
    <>
      <Box
        as="button"
        type="button"
        p="1"
        fontSize="2xl"
        color="gray.600"
        onClick={toggle}
        display={{ base: "block", lg: "none" }}
      >
        <HiOutlineMenu />
      </Box>

      <Transition in={show}>
        <RemoveScroll enabled={show}>
          <Backdrop show={show} />
        </RemoveScroll>
        <FocusLock disabled={!show} returnFocus>
          <Box
            bg={mode("white", "gray.700")}
            shadow="lg"
            rounded="lg"
            ref={ref}
            tabIndex={0}
            outline={0}
          >
            <Box pt="5" pb="6" px="5">
              <Flex justify="space-between" align="center">
                <Logo />
                <Box mr="-2" mt="-2">
                  <Center
                    as="button"
                    type="button"
                    onClick={off}
                    rounded="base"
                    p="1"
                    color={mode("gray.600", "gray.400")}
                    _hover={{ bg: mode("gray.100", "gray.600") }}
                  >
                    <Box srOnly>Close menu</Box>
                    <HiOutlineX aria-hidden fontSize="1.5rem" />
                  </Center>
                </Box>
              </Flex>
              <SimpleGrid as="nav" gap="6" mt="8" columns={{ base: 1, sm: 2 }}>
                <NavLink.Mobile icon={HiBookOpen}>Features</NavLink.Mobile>
                <NavLink.Mobile icon={HiCurrencyDollar}>Pricing</NavLink.Mobile>
              </SimpleGrid>
              <VStack mt="8" spacing="4">
                <Button w="full" colorScheme="blue">
                  Start Free Trial
                </Button>
                <Box textAlign="center" fontWeight="medium">
                  Have an account?{" "}
                  <Box
                    onClick={() => signIn()}
                    as="a"
                    color={mode("blue.600", "blue.400")}
                  >
                    Log in
                  </Box>
                </Box>
              </VStack>
            </Box>
          </Box>
        </FocusLock>
      </Transition>
    </>
  );
};
