import { useEffect } from "react";
import { Chain } from "viem";
import { useChainId, useSwitchChain } from "wagmi";

type SwitchChainProps = {
  chain: Chain;
};

export function SwitchChain({ chain }: SwitchChainProps) {
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();

  useEffect(() => {
    if (chainId !== chain.id) {
      switchChain({ chainId: chain.id });
    }
  }, []);

  return null;
}
