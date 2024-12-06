import { Authentic } from "@/components/Verify/Authentic";
import { Error } from "@/components/Verify/Error";
import { Loading } from "@/components/Verify/Loading";
import { abi, address } from "@/constants/RadicaTagContract";
import { Certificate, Metadata, TracebilityMetadata } from "@/types/Metadata";
import { useLocalSearchParams } from "expo-router";
import { useReadContract } from "wagmi";

export default function VerifyScreen() {
  const {
    recoveredAddress,
    proof,
  }: { recoveredAddress: `0x${string}`; proof?: `0x${string}` } =
    useLocalSearchParams();

  const {
    data: cert,
    isLoading: isLoadingCert,
    isError: isErrorCert,
  } = useReadContract({
    abi,
    address,
    functionName: "tagAddrToCert",
    args: [recoveredAddress],
    query: {
      select: (data) => {
        return {
          id: data[0],
          metadata: data[1] as Metadata,
          traceabilityMetadata: data[2] as TracebilityMetadata,
        } as Certificate;
      },
    },
  });
  const certId = cert?.id;
  const metadata = cert?.metadata;
  const traceabilityMetadata = cert?.traceabilityMetadata;

  if (certId === 0n) {
    return <Error text="Product is not Authentic" />;
  }

  if (isErrorCert) {
    return <Error text="An Error Occurred" />;
  }

  if (isLoadingCert) {
    const status = "Checking Certificate...";

    return <Loading status={status} />;
  }

  if (certId && metadata && traceabilityMetadata) {
    return (
      <Authentic
        certId={certId}
        metadata={metadata}
        traceabilityMetadata={traceabilityMetadata}
        proof={proof}
        tagAddress={recoveredAddress}
      />
    );
  }
}
