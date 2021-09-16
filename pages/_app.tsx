import React from "react";
import NextNprogress from "nextjs-progressbar";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
import { Toaster } from "react-hot-toast";
import { Provider } from "next-auth/client";
import { ReactQueryDevtools } from "react-query/devtools";
import { FlagsProvider } from "context/flags-context";

if (process.env.NODE_ENV === "development") {
  require("mocks");
}

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <FlagsProvider projectId="cksm0s3kg000412l2licbbh8s">
          <Hydrate state={pageProps.dehydratedState}>
            <Provider session={pageProps.session}>
              <Component {...pageProps} />
              <NextNprogress
                color="#FF8826"
                startPosition={0.3}
                stopDelayMs={200}
                height={2}
                showOnShallow={true}
                options={{ showSpinner: false }}
              />
              <div>
                <Toaster />
              </div>
            </Provider>
            <ReactQueryDevtools initialIsOpen={false} />
          </Hydrate>
        </FlagsProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}
export default MyApp;
