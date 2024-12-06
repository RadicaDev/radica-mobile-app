export type Metadata = {
  serialNumber: string;
  name: string;
  description: string;
  image: string;
  manufacturer: string;
  externalUrl: string;
};

export type TracebilityMetadata = {
  batchId: string;
  supplierChainHash: string;
};

export type Certificate = {
  id: bigint;
  metadata: Metadata;
  traceabilityMetadata: TracebilityMetadata;
};
