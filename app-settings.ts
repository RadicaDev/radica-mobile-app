import { hardhat } from "viem/chains";

export const appSettings = {
  [hardhat.id]: {
    rpcUrl: "https://radica.dev:8545",
    tagContractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    propertyContractAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  },
};
