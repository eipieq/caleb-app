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
import { CHAIN_ID, EVM_CHAIN_ID, EVM_RPC, TESTNET_EVM_RPC, TESTNET_EVM_CHAIN_ID } from "@/lib/config";

// need absolute URLs — wallet SDKs parse with new URL() which rejects relative paths
const origin = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
const PROXY_RPC = `${origin}/api/chain-rpc`;
const PROXY_REST = `${origin}/api/chain-rest`;
const PROXY_EVM = `${origin}/api/chain-evm`;

// InterwovenKit chain config (Cosmos-style)
const calebChainIwk = {
  chain_id: CHAIN_ID,
  chain_name: CHAIN_ID,
  pretty_name: "Caleb",
  logo_URIs: { png: "" },
  metadata: { minitia: { type: "minievm" } },
  fees: {
    fee_tokens: [
      { denom: "uinit", fixed_min_gas_price: 0.015, low_gas_price: 0.015, average_gas_price: 0.015, high_gas_price: 0.04 },
    ],
  },
  apis: {
    rpc: [{ address: PROXY_RPC }],
    rest: [{ address: PROXY_REST }],
    "json-rpc": [{ address: PROXY_EVM }],
    indexer: [{ address: `${origin}/api/chain-rest` }],
  },
  evm_chain_id: EVM_CHAIN_ID,
};

// viem/wagmi chain definitions (EVM-style)
export const calebChain = defineChain({
  id: EVM_CHAIN_ID,
  name: "Caleb",
  nativeCurrency: { name: "INIT", symbol: "INIT", decimals: 18 },
  rpcUrls: { default: { http: [PROXY_EVM] } },
});

export const initiaTestnetChain = defineChain({
  id: TESTNET_EVM_CHAIN_ID,
  name: "Initia Testnet",
  nativeCurrency: { name: "INIT", symbol: "INIT", decimals: 18 },
  rpcUrls: { default: { http: [TESTNET_EVM_RPC] } },
  testnet: true,
});

const wagmiConfig = createConfig({
  connectors: [initiaPrivyWalletConnector],
  chains: [mainnet, calebChain, initiaTestnetChain],
  transports: {
    [mainnet.id]: http(),
    [EVM_CHAIN_ID]: http(PROXY_EVM),
    [TESTNET_EVM_CHAIN_ID]: http(TESTNET_EVM_RPC),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

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
          customChain={calebChainIwk as never}
          theme="light"
          enableAutoSign
        >
          {mounted ? children : null}
        </InterwovenKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
