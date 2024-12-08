import { BackgroundGradient } from "@/components/Shared/BackgroundGradient";
import {
  useAccount,
  useChainId,
  useReadContract,
  useReadContracts,
} from "wagmi";
import { WalletConnect } from "@/components/Wallet/WalletConnect";
import { Products } from "@/components/Wallet/Products";
import {
  abi as abiTag,
  address as addressTag,
} from "@/constants/RadicaTagContract";
import {
  abi as abiProperty,
  address as addressProperty,
} from "@/constants/RadicaPropertyContract";
import { Certificate } from "@/types/Metadata";
import { ChainIdType } from "@/types/ChainId";

export default function WalletScreen() {
  const { address } = useAccount();
  const chainId = useChainId() as ChainIdType;

  const {
    data: balance,
    isRefetching: isRefetchingBalance,
    refetch: refetchBalance,
  } = useReadContract({
    abi: abiProperty,
    address: addressProperty(chainId),
    chainId,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    query: {
      enabled: address !== undefined,
      refetchOnWindowFocus: "always",
    },
  });

  const contracts = (() => {
    if (!balance) return [];

    const contractList = [];
    for (let i = 0n; i < balance; i++) {
      contractList.push({
        abi: abiProperty,
        address: addressProperty(chainId),
        chainId,
        functionName: "tokenOfOwnerByIndex",
        args: [address as `0x${string}`, i],
      } as const);
    }

    return contractList;
  })();

  const { data: tagAddrs } = useReadContracts({
    contracts,
    query: {
      enabled: address !== undefined && balance !== undefined && balance > 0n,
      select: (data) => {
        return data.map((data) => {
          if (data.status === "success") {
            if (data.result)
              return `0x${(data.result % 2n ** 160n).toString(16)}`;
          }
        });
      },
    },
  });

  const { data: certs } = useReadContracts({
    contracts: tagAddrs?.map(
      (tagAddr) =>
        ({
          abi: abiTag,
          address: addressTag(chainId),
          chainId,
          functionName: "tagAddrToCert",
          args: [tagAddr],
        }) as const,
    ),
    query: {
      enabled: tagAddrs !== undefined && tagAddrs.length > 0,
      select: (data) =>
        data.map((data) => {
          if (data.status === "failure") return;
          return {
            id: data.result[0],
            metadata: data.result[1],
            traceabilityMetadata: data.result[2],
          } as Certificate;
        }),
    },
  });

  return (
    <BackgroundGradient>
      {!address ? (
        <WalletConnect />
      ) : (
        <Products
          refreshing={isRefetchingBalance}
          onRefresh={refetchBalance}
          certs={certs}
        />
      )}
    </BackgroundGradient>
  );
}
