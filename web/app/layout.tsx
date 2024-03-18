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
import { ChakraProvider } from "@chakra-ui/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hidden = ["/sign-in", "/"];
  const isSignIn = hidden.includes(usePathname());

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
          <div className={`m-auto max-w-lg md:max-w-3xl`}>
            <ChakraProvider>{children} </ChakraProvider>
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
