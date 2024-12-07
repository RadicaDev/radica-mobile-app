import { chains } from "@/wagmi";

// chains type is composed by all the chain id supported (e.g. ChainIdType = { 31337 | 296 })
export type ChainIdType = typeof chains[number]["id"];
