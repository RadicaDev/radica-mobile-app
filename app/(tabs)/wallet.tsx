import { BackgroundGradient } from "@/components/Shared/BackgroundGradient";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
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

type Metadata = {
  id: string;
  description?: string;
  external_url?: string;
  image?: string;
  name?: string;
};

export default function WalletScreen() {
  const { address } = useAccount();

  const {
    data: balance,
    isRefetching: isRefetchingBalance,
    refetch: refetchBalance,
  } = useReadContract({
    abi: abiProperty,
    address: addressProperty,
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
        address: addressProperty,
        functionName: "tokenOfOwnerByIndex",
        args: [address as `0x${string}`, i],
      } as const);
    }

    return contractList;
  })();

  const { data: tokenIds } = useReadContracts({
    contracts,
    query: {
      enabled: address !== undefined && balance !== undefined && balance > 0n,
      select: (data) => {
        return data
          .map((data) => {
            if (data.status === "success") return data.result;
          })
          .sort((a, b) => {
            if (!a || !b) return 0;
            return Number(a - b);
          });
      },
    },
  });

  const { data: products } = useReadContracts({
    contracts: tokenIds?.map(
      (tokenId) =>
        ({
          abi: abiTag,
          address: addressTag,
          functionName: "tokenURI",
          args: [tokenId],
        }) as const,
    ),
    query: {
      enabled: tokenIds !== undefined && tokenIds.length > 0,
      select: (data) =>
        data.map((data) => {
          if (data.status === "failure") return;

          try {
            const decodedString = atob(data.result);
            const _metadata = JSON.parse(decodedString);

            return _metadata as Metadata;
          } catch (error: any) {
            console.error(error);
          }
        }),
    },
  });

  const productsWithTokenIds = (() => {
    if (!products || !tokenIds) return undefined;

    return products.map((product, index) => {
      return { ...product, tokenId: tokenIds[index] } as Metadata & {
        tokenId: bigint;
      };
    });
  })();

  return (
    <BackgroundGradient>
      {!address ? (
        <WalletConnect />
      ) : (
        <Products
          refreshing={isRefetchingBalance}
          onRefresh={refetchBalance}
          products={productsWithTokenIds}
        />
      )}
    </BackgroundGradient>
  );
}
