import { useCameraPermissions } from "expo-camera";
import { Loading } from "@/components/Scan/Loading";
import { Permissions } from "@/components/Scan/Permissions";
import { useEffect, useState } from "react";
import { Scan } from "@/components/Scan/Scan";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressBar, Text, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { View } from "react-native";

import signerAddr from "@/constants/SignerAddress";
import { verifyMessage } from "viem";

export default function VerifyScreen() {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0.0);
  const [status, setStatus] = useState<string | null>("Status");
  const [permission, requestPermission] = useCameraPermissions();

  const theme = useTheme();

  useEffect(() => {
    // Read the uid
    // Read the uid signature
    // verify the signature
    // quer the blockchain to check for the nft
    (async () => {
      if (!data) return;

      // parse the data from hex string to bytes array
      setStatus("Parsing data");
      setProgress(0.25);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (data.length < 0x1c * 2 * 4) {
        setError("Invalid data");
        return;
      }

      const uid = `0x${data.slice(0, 8 * 2)}`;
      const sig = `0x${data.slice(0x4 * 2 * 4, (0x4 * 4 + 65) * 2)}`;

      setProgress(0.5);
      setStatus("Verifying signature");
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
      setStatus("Checking blockchain");

      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProgress(1.0);
      setStatus("Loading data from blockchain");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("Tag is authentic");
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
        style={[styles.container, { backgroundColor: theme.colors.primary }]}
      >
        <Text variant="headlineLarge" style={{ color: theme.colors.onPrimary }}>
          {status}
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
