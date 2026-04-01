"use client";

import { useEffect, useState } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { defineChain } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  initiaPrivyWalletConnector,
  injectStyles,
  InterwovenKitProvider,
  TESTNET,
} from "@initia/interwovenkit-react";
import InterwovenKitStyles from "@initia/interwovenkit-react/styles.js";
import { CHAIN_ID, EVM_CHAIN_ID, EVM_RPC } from "@/lib/config";

const calebChain = {
  chain_id: CHAIN_ID,
  chain_name: CHAIN_ID,
  pretty_name: "Caleb",
  logo_URIs: { png: "" },
  metadata: { minitia: { type: "minievm" } },
  apis: {
    rpc: [{ address: "http://64.227.139.172:26657" }],
    rest: [{ address: "http://64.227.139.172:1317" }],
    "json-rpc": [{ address: EVM_RPC }],
    indexer: [{ address: "http://64.227.139.172:6767" }],
  },
  evm_chain_id: EVM_CHAIN_ID,
};

export const calebChainViem = defineChain({
  id: EVM_CHAIN_ID,
  name: "Caleb",
  nativeCurrency: { name: "INIT", symbol: "INIT", decimals: 18 },
  rpcUrls: { default: { http: [EVM_RPC] } },
});

const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [mainnet, calebChainViem],
  transports: {
    [mainnet.id]: http(),
    [EVM_CHAIN_ID]: http(EVM_RPC),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    injectStyles(InterwovenKitStyles);
    injectStyles(`:root,:host{--font-family:var(--font-geist-sans),sans-serif;--monospace:var(--font-geist-mono),monospace}`);
    setMounted(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <InterwovenKitProvider
          {...TESTNET}
          defaultChainId={CHAIN_ID}
          customChain={calebChain as never}
          theme="light"
          enableAutoSign
        >
          {mounted ? children : null}
        </InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
