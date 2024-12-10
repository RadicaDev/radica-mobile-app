import { appSettings } from "@/app-settings";
import { ChainIdType } from "@/types/ChainId";

export const address = (chainId: ChainIdType) =>
  appSettings[chainId].tagContractAddress as `0x${string}`;

export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tagAddr",
        type: "address",
      },
      {
        components: [
          {
            internalType: "string",
            name: "serialNumber",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "image",
            type: "string",
          },
          {
            internalType: "string",
            name: "manufacturer",
            type: "string",
          },
          {
            internalType: "string",
            name: "externalUrl",
            type: "string",
          },
        ],
        internalType: "struct Metadata",
        name: "metadata",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "proofHash",
        type: "bytes32",
      },
    ],
    name: "createTag",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tagAddr",
        type: "address",
      },
      {
        components: [
          {
            internalType: "string",
            name: "serialNumber",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "image",
            type: "string",
          },
          {
            internalType: "string",
            name: "manufacturer",
            type: "string",
          },
          {
            internalType: "string",
            name: "externalUrl",
            type: "string",
          },
        ],
        internalType: "struct Metadata",
        name: "metadata",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "batchId",
            type: "string",
          },
          {
            internalType: "string",
            name: "supplierChainHash",
            type: "string",
          },
        ],
        internalType: "struct TracebilityMetadata",
        name: "tracebilityMetadata",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "proofHash",
        type: "bytes32",
      },
    ],
    name: "createTag",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "radicaPropertyAddr",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_radicaPropertyAddr",
        type: "address",
      },
    ],
    name: "setRadicaPropertyAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "tagAddrToCert",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "string",
            name: "serialNumber",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "string",
            name: "image",
            type: "string",
          },
          {
            internalType: "string",
            name: "manufacturer",
            type: "string",
          },
          {
            internalType: "string",
            name: "externalUrl",
            type: "string",
          },
        ],
        internalType: "struct Metadata",
        name: "metadata",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "string",
            name: "batchId",
            type: "string",
          },
          {
            internalType: "string",
            name: "supplierChainHash",
            type: "string",
          },
        ],
        internalType: "struct TracebilityMetadata",
        name: "tracebilityMetadata",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
