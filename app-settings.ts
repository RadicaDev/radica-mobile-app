import { hardhat, hederaTestnet } from "viem/chains";

export const appSettings = {
  [hardhat.id]: {
    rpcUrl: "https://hardhat.radica.dev",
    tagContractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    propertyContractAddress: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  },
  [hederaTestnet.id]: {
    tagContractAddress: "0xb64E10F04260BF063F8D30857a47e02111302CF1",
    propertyContractAddress: "0x07e361E3bDc90c6BEa52D1A46aE98745fc4159f9",
  },
};
