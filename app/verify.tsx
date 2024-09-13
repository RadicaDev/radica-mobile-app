// import { useCameraPermissions } from "expo-camera";
// import { Loading } from "@/components/Scan/Loading";
// import { Permissions } from "@/components/Scan/Permissions";
import { useEffect, useState } from "react";
// import { Scan } from "@/components/Scan/Scan";
import { Scan } from "@/components/Scan/ScanNFC";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, ProgressBar, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import { View } from "react-native";

import { useAppTheme } from "@/theme/paperTheme";

import signerAddr from "@/constants/SignerAddress";
import { keccak256, verifyMessage } from "viem";
import { useReadContract } from "wagmi";
import { abi, address } from "@/constants/RadixContract";
import { privateKeyToAddress } from "viem/accounts";
import { LinearGradient } from "expo-linear-gradient";
import { Authentic } from "@/components/Scan/Authentic";

type Metadata = {
  id: string;
  description?: string;
  external_url?: string;
  image?: string;
  name?: string;
};

export default function VerifyScreen() {
  const [data, setData] = useState<string | null>(null);
  const [recoveredAddress, setRecoveredAddress] = useState<
    `0x${string}` | null
  >(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0.0);
  const [status, setStatus] = useState<string | null>("Tag is authentic");
  // const [permission, requestPermission] = useCameraPermissions();

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

  const { data: tokenId } = useReadContract({
    abi,
    address,
    functionName: "tokenOfOwnerByIndex",
    args: [recoveredAddress as `0x${string}`, 0n],
    query: {
      enabled: balance !== undefined && balance > 0n,
    },
  });

  const { data: tokenURI } = useReadContract({
    abi,
    address,
    functionName: "tokenURI",
    args: [tokenId as bigint],
    query: {
      enabled: tokenId !== undefined,
    },
  });

  useEffect(() => {
    (async () => {
      if (!data) return;
      setProgress(0);

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
    if (tokenURI === undefined) return;

    try {
      const decodedString = atob(tokenURI);
      const _metadata = JSON.parse(decodedString);

      setMetadata(_metadata);
    } catch (error: any) {
      console.error(error);
    }
  }, [tokenURI]);

  if (error) {
    return (
      <LinearGradient
        colors={[theme.colors.error, theme.colors.surfaceVariant]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <View style={styles.icon}>
            <Icon
              source="alert-circle-outline"
              size={100}
              color={theme.colors.onError}
            />
          </View>
          <Text
            variant="headlineLarge"
            style={[styles.text, { color: theme.colors.onError }]}
          >
            {error}
          </Text>
        </View>
      </LinearGradient>
    );
  }

  // if (!permission) {
  //   // Camera permissions are still loading.
  //   return <Loading />;
  // }
  //
  // if (!permission.granted) {
  //   // Camera permissions are not granted yet.
  //   return <Permissions requestPermission={requestPermission} />;
  // }

  if (!data) {
    return <Scan setData={setData} />;
  }

  if (status === "Tag is authentic") {
    return (
      <Authentic
        status={status}
        id={metadata?.id}
        name={metadata?.name}
        description={metadata?.description}
      />
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.surfaceVariant]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <Text
          style={[styles.statusText, { color: theme.colors.onSurface }]}
          variant="titleLarge"
        >
          {status}
        </Text>
        <View style={styles.progressBarContainer}>
          <ProgressBar
            progress={progress}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  progressBarContainer: {
    width: "80%",
    borderRadius: 10,
    padding: 10,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
  icon: {
    marginBottom: 20,
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
});
