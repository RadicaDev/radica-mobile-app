import { hederaTestnet } from "viem/chains";

export const signerAddress = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

export const appSettings = {
  [hederaTestnet.id]: {
    tagContractAddress: "0x5F386056e785049B121CdF22FaeF53ca697FE34D",
    propertyContractAddress: "0xD8Fde12B2549fE06C09a7D0bf919c89cd863e2F0",
  },
};
