import { useAppTheme } from "@/theme/paperTheme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Button, Card, Paragraph, Text, Title } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import {
  abi as abiTag,
  address as addressTag,
} from "@/constants/RadixContract";
import {
  abi as abiProperty,
  address as addressProperty,
} from "@/constants/RadixPropertyContract";

type Metadata = {
  id: string;
  description?: string;
  external_url?: string;
  image?: string;
  name?: string;
};

export default function ProductsScreen() {
  const theme = useAppTheme();

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

  const productsCards = products?.map((product, key) => {
    const productMeta = product as Metadata;
    return (
      <TouchableOpacity key={key} style={styles.cardContainer}>
        <Card>
          {/*<Card.Cover source={{ uri: productMeta.image }} />*/}
          <Card.Content>
            <Paragraph>ID: {productMeta.id}</Paragraph>
            <Title>{productMeta.name}</Title>
            {/*<Paragraph>{productMeta.description}</Paragraph>*/}
          </Card.Content>
          {/*
        <Card.Actions>
          <Button
            onPress={
              () => console.log("Prod") //router.navigate(`/product/${productMeta.id}`)
            }
          >
            View
          </Button>
        </Card.Actions>
        */}
        </Card>
      </TouchableOpacity>
    );
  });

  if (!address) {
    return (
      <LinearGradient
        colors={[
          theme.colors.primaryContainer,
          theme.colors.secondaryContainer,
          theme.colors.tertiaryContainer,
        ]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <Button
            contentStyle={styles.buttonContent}
            mode="contained"
            onPress={() => router.navigate("/wallet")}
            labelStyle={[styles.buttonLabel, { color: theme.colors.onPrimary }]}
          >
            Connect Wallet
          </Button>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[
        theme.colors.primaryContainer,
        theme.colors.secondaryContainer,
        theme.colors.tertiaryContainer,
      ]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        bounces
        refreshControl={
          <RefreshControl
            refreshing={isRefetchingBalance}
            onRefresh={refetchBalance}
          />
        }
      >
        <SafeAreaView style={styles.container}>{productsCards}</SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: "100%",
  },
  scrollView: {
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  buttonContent: {
    height: 50,
    width: 200,
  },
  buttonLabel: {
    fontSize: 18,
  },
  cardContainer: {
    marginVertical: 10,
    width: "90%",
  },
});
