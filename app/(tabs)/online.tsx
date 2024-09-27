import { VerifyAddressForm } from "@/components/Online/VerifyAddressForm";
import { router } from "expo-router";
import { useState } from "react";

export default function OnlineScreen() {
  const [address, setAddress] = useState<string>("");

  const handlePress = () => {
    router.navigate({
      pathname: "../verify/[...tag]",
      params: { recoveredAddress: address },
    });
  };

  return (
    <VerifyAddressForm
      address={address}
      setAddress={setAddress}
      handlePress={handlePress}
    />
  );
}
