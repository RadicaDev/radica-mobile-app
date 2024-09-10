import { useCameraPermissions } from "expo-camera";
import { Loading } from "@/components/Scan/Loading";
import { Permissions } from "@/components/Scan/Permissions";
import { useEffect, useState } from "react";
import { Scan } from "@/components/Scan/Scan";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import { View } from "react-native";

import { useAppTheme } from "@/theme/paperTheme";

import signerAddr from "@/constants/SignerAddress";
import { keccak256, verifyMessage } from "viem";
import { useReadContract } from "wagmi";
import { abi, address } from "@/constants/RadixContract";
import { privateKeyToAddress } from "viem/accounts";

export default function VerifyScreen() {
  const [data, setData] = useState<string | null>(null);
  const [recoveredAddress, setRecoveredAddress] = useState<
    `0x${string}` | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0.0);
  const [status, setStatus] = useState<string | null>("Status");
  const [permission, requestPermission] = useCameraPermissions();

  const theme = useAppTheme();

  const { data: balance, isError: isErrorBalance } = useReadContract({
    abi,
    address,
    functionName: "balanceOf",
    args: [recoveredAddress as `0x${string}`],
    query: {
      enabled: recoveredAddress !== null,
    },
  });

  useEffect(() => {
    if (isErrorBalance) {
      setError("Error fetching balance");
      return;
    }

    if (balance === undefined) return;

    if (balance === 0n) {
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setError("Product not Authentic");
      })();
      return;
    }

    if (balance > 0n) {
      (async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setProgress(1.0);
        setStatus("Loading data from blockchain...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setStatus("Tag is authentic");
      })();
    }
  }, [balance]);

  useEffect(() => {
    (async () => {
      if (!data) return;

      // parse the data from hex string to bytes array
      setStatus("Parsing data...");
      setProgress(0.25);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (data.length < 0x1c * 2 * 4) {
        setError("Invalid data");
        return;
      }

      const uid: `0x${string}` = `0x${data.slice(0, 8 * 2)}`;
      const sig: `0x${string}` = `0x${data.slice(0x4 * 2 * 4, (0x4 * 4 + 65) * 2)}`;

      setProgress(0.5);
      setStatus("Verifying signature...");
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // verify the signature
      let isVerified = false;
      try {
        isVerified = await verifyMessage({
          address: signerAddr,
          message: { raw: uid as `0x${string}` },
          signature: sig as `0x${string}`,
        });
      } catch (e) {
        setError("Invalid signature");
        return;
      }

      if (!isVerified) {
        setError("Tag is not authentic");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProgress(0.75);
      setStatus("Checking blockchain...");

      setRecoveredAddress(privateKeyToAddress(keccak256(uid)));
    })();
  }, [data]);

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.error }]}>
        <Text variant="headlineLarge" style={{ color: theme.colors.onError }}>
          {error}
        </Text>
      </View>
    );
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <Loading />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return <Permissions requestPermission={requestPermission} />;
  }

  if (!data) {
    return <Scan setData={setData} />;
  }

  if (status === "Tag is authentic") {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.success }]}
      >
        <Text variant="headlineLarge" style={{ color: theme.colors.onSuccess }}>
          {status}!
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="labelLarge">{status}</Text>
      <View style={styles.progressBarContainer}>
        <ProgressBar progress={progress} color={theme.colors.primary} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarContainer: {
    width: "90%",
    marginTop: 20,
  },
});
