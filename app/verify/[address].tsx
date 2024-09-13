import { Authentic } from "@/components/Scan/Authentic";
import { abi, address } from "@/constants/RadixContract";
import { useAppTheme } from "@/theme/paperTheme";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Icon, ProgressBar, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useReadContract } from "wagmi";

type Metadata = {
  id: string;
  description?: string;
  external_url?: string;
  image?: string;
  name?: string;
};

export default function VerifyScreen() {
  const { address: recoveredAddress } = useLocalSearchParams();

  const theme = useAppTheme();

  const {
    data: balance,
    isLoading: isLoadingBalance,
    isError: isErrorBalance,
  } = useReadContract({
    abi,
    address,
    functionName: "balanceOf",
    args: [recoveredAddress as `0x${string}`],
  });

  const {
    data: tokenId,
    isLoading: isLoadingTokenId,
    isError: isErrorTokenId,
  } = useReadContract({
    abi,
    address,
    functionName: "tokenOfOwnerByIndex",
    args: [recoveredAddress as `0x${string}`, 0n],
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
            Product Not Authentic
          </Text>
        </View>
      </LinearGradient>
    );
  }

  if (isErrorBalance || isErrorTokenId || isErrorMetadata) {
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
            An Error Occurred
          </Text>
        </View>
      </LinearGradient>
    );
  }

  if (isLoadingBalance || isLoadingTokenId || isLoadingMetadata) {
    const status = isLoadingBalance
      ? "Checking blockchain..."
      : "Loading metadata...";
    const progress = isLoadingBalance ? 0 : isLoadingTokenId ? 0.5 : 1;

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

  if (metadata) {
    return (
      <Authentic
        id={metadata?.id}
        name={metadata?.name}
        description={metadata?.description}
        image={metadata?.image}
      />
    );
  }
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
