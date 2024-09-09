import {
  Web3ModalOptions,
  defaultWagmiConfig,
} from "@web3modal/wagmi-react-native";
import { arbitrum, mainnet, polygon } from "viem/chains";

const projectId = "dace2ce5fa77568df22525a38edf07e8";

const metadata = {
  name: "Radix Mobile App Demo",
  description: "Radix Mobile App Demo",
  url: "https://walletconnect.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  // redirect: {
  //   native: "YOUR_APP_SCHEME://",
  //   universal: "YOUR_APP_UNIVERSAL_LINK.com",
  // },
};

export const chains = [mainnet, polygon, arbitrum] as const;

export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

const modalOptions: Web3ModalOptions = {
  projectId,
  wagmiConfig,
  defaultChain: mainnet,
  enableAnalytics: false,
};

export default modalOptions;
