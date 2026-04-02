export const AGENT_API = process.env.NEXT_PUBLIC_AGENT_API ?? "http://64.227.139.172:4000";
export const INDEXER_API = process.env.NEXT_PUBLIC_INDEXER_API ?? "http://64.227.139.172:6767";
export const EVM_RPC = process.env.NEXT_PUBLIC_EVM_RPC ?? "http://64.227.139.172:8545";
export const CHAIN_ID = "caleb-chain";
export const EVM_CHAIN_ID = 1043515499963059;

// Initia testnet EVM (evm-1) — used for wallet balance display
export const TESTNET_EVM_RPC = "https://jsonrpc-evm-1.anvil.asia-southeast.initia.xyz";
export const TESTNET_EVM_CHAIN_ID = 2124225178762456;
export const CONTRACT_ADDRESS = "0x22679adc7475B922901137F22D120404c074044f";
export const EXPLORER_TX = (hash: string) =>
  `https://scan.testnet.initia.xyz/caleb-chain/txs/${hash}`;

export const DECISION_LOG_ABI = [
  {
    name: "attest",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "sessionId", type: "bytes32" }],
    outputs: [],
  },
  {
    name: "getAttestationCount",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "sessionId", type: "bytes32" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "getAttestation",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "sessionId", type: "bytes32" }, { name: "index", type: "uint256" }],
    outputs: [{ name: "attester", type: "address" }, { name: "timestamp", type: "uint256" }],
  },
  {
    name: "hasAttested",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "sessionId", type: "bytes32" }, { name: "attester", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "Attested",
    type: "event",
    inputs: [
      { name: "sessionId", type: "bytes32", indexed: true },
      { name: "attester", type: "address", indexed: true },
      { name: "timestamp", type: "uint256", indexed: false },
    ],
  },
] as const;
