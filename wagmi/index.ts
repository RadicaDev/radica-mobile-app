import { Web3ModalOptions } from "@web3modal/wagmi-react-native";
import { defaultWagmiConfig } from "@reown/appkit-wagmi-react-native";
import { hederaTestnet } from "viem/chains";
import * as Clipboard from "expo-clipboard";

const projectId = "dace2ce5fa77568df22525a38edf07e8";

const metadata = {
  name: "Radica Mobile App Demo",
  description: "Radica Mobile App Demo",
  url: "https://walletconnect.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  // redirect: {
  //   native: "YOUR_APP_SCHEME://",
  //   universal: "YOUR_APP_UNIVERSAL_LINK.com",
  // },
};

export const chains = [
  hederaTestnet,
] as const;

export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

const modalOptions: Web3ModalOptions = {
  projectId,
  wagmiConfig,
  defaultChain: hederaTestnet,
  enableAnalytics: false,
  clipboardClient: {
    setString: async (value: string) => {
      await Clipboard.setStringAsync(value);
    },
  },
};

export default modalOptions;
