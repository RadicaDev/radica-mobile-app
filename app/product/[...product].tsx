import { useLocalSearchParams } from "expo-router";
import { BackgroundGradient } from "@/components/Shared/BackgroundGradient";
import { ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { useReadContract } from "wagmi";
import {
  abi as abiRadix,
  address as addressRadix,
} from "@/constants/RadixContract";
import {
  abi as abiProperty,
  address as addressProperty,
} from "@/constants/RadixPropertyContract";
import { ProductDetailsCard } from "@/components/Product/ProductDetailsCard";
import { Snackbar } from "react-native-paper";
import { useState } from "react";

type Metadata = {
  id: string;
  description?: string;
  external_url?: string;
  image?: string;
  name?: string;
};

export default function ProductScreen() {
  const product = useLocalSearchParams();
  const { id, name, description, image, external_url } =
    product as unknown as Metadata & { id: string };
  const tokenId = BigInt(product.tokenId as string);

  const [showSnakbar, setShowSnackbar] = useState(false);

  const { data: tagAddress } = useReadContract({
    abi: abiRadix,
    address: addressRadix,
    functionName: "ownerOf",
    args: [tokenId],
  });

  const { data: ownerAddress } = useReadContract({
    abi: abiProperty,
    address: addressProperty,
    functionName: "ownerOf",
    args: [tokenId],
  });

  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <ScrollView
          bounces
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <ProductDetailsCard
            id={id}
            name={name}
            description={description}
            image={image}
            external_url={external_url}
            tagAddress={tagAddress}
            ownerAddress={ownerAddress}
            tokenId={tokenId}
            setShowSnackbar={setShowSnackbar}
          />
        </ScrollView>
        <Snackbar
          visible={showSnakbar}
          duration={2000}
          onDismiss={() => setShowSnackbar(false)}
          style={styles.snackbar}
        >
          Copied to clipboard!
        </Snackbar>
      </SafeAreaView>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  scrollView: {
    width: "100%",
    height: "100%",
  },
  scrollViewContent: {
    alignItems: "center",
  },
  snackbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 60,
    marginHorizontal: 10,
  },
});
