import { hardhat } from "viem/chains";

export const appSettings = {
  [hardhat.id]: {
    rpcUrl: "http://192.168.1.129:8545",
    tagContractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    propertyContractAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  },
};
