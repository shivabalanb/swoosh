"use client";
import "../styles/global.css";

import React from "react";
import {
  ThirdwebProvider,
  embeddedWallet,
  smartWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import { usePathname } from "next/navigation";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hidden = ["/sign-in", "/"];
  const isSignIn = hidden.includes(usePathname());

  const theme = extendTheme({
    colors: {
      ssky: { 500: "#e0f2fe" },
      sblue: {
        500: "#1d4ed8",
      },
      sdarkblue: {
        500: "#1e3a8a",
      },
    },
  });

  return (
    <html lang="en">
      <body className={`${isSignIn && "gradient-background"} relative w-full`}>
        <ThirdwebProvider
          activeChain={BaseSepoliaTestnet}
          clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
          supportedWallets={[
            metamaskWallet({ recommended: true }),
            coinbaseWallet(),
            walletConnect(),
            smartWallet(
              embeddedWallet(), // any personal wallet
              {
                factoryAddress: "0xFB5dA66aE989c5B1926a70107c9c8a75D5e5cEa5", // your deployed factory address
                gasless: true, // enable or disable gasless transactions
              }
            ),
          ]}
        >
          <div className={`m-auto  md:max-w-3xl`}>
            <ChakraProvider theme={theme}>{children} </ChakraProvider>
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
