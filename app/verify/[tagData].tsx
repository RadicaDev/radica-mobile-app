import { Authentic } from "@/components/Scan/Authentic";
import { Error } from "@/components/Scan/Error";
import { Loading } from "@/components/Scan/Loading";
import { abi, address } from "@/constants/RadixContract";
import { useLocalSearchParams } from "expo-router";
import { useReadContract } from "wagmi";

type Metadata = {
  id: string;
  description?: string;
  external_url?: string;
  image?: string;
  name?: string;
};

export default function VerifyScreen() {
  const { tagData }: { tagData: string } = useLocalSearchParams();
  const [recoveredAddress, proof] = tagData.split("-") as [
    `0x${string}`,
    `0x${string}`,
  ];

  const {
    data: balance,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
  } = useReadContract({
    abi,
    address,
    functionName: "balanceOf",
    args: [recoveredAddress],
  });

  const {
    data: tokenId,
    isLoading: isLoadingTokenId,
    isError: isErrorTokenId,
  } = useReadContract({
    abi,
    address,
    functionName: "tokenOfOwnerByIndex",
    args: [recoveredAddress, 0n],
    query: {
      enabled: balance !== undefined && balance > 0n,
    },
  });

  const {
    data: metadata,
    isLoading: isLoadingMetadata,
    isError: isErrorMetadata,
  } = useReadContract({
    abi,
    address,
    functionName: "tokenURI",
    args: [tokenId as bigint],
    query: {
      enabled: tokenId !== undefined && balance !== undefined && balance > 0n,
      select: (data) => {
        try {
          const decodedString = atob(data);
          const _metadata = JSON.parse(decodedString);

          return _metadata as Metadata;
        } catch (error: any) {
          console.error(error);
        }
      },
    },
  });

  if (balance === 0n) {
    return <Error text="Product is not Authentic" />;
  }

  if (isErrorBalance || isErrorTokenId || isErrorMetadata) {
    return <Error text="An Error Occurred" />;
  }

  if (isLoadingBalance || isLoadingTokenId || isLoadingMetadata) {
    const status = isLoadingBalance
      ? "Checking blockchain..."
      : "Loading metadata...";
    const progress = isLoadingBalance ? 0 : isLoadingTokenId ? 0.5 : 1;

    return <Loading status={status} progress={progress} />;
  }

  if (metadata) {
    return (
      <Authentic
        id={metadata?.id}
        name={metadata?.name}
        description={metadata?.description}
        image={metadata?.image}
        proof={proof}
      />
    );
  }
}
