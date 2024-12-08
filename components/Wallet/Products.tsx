import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import ConnectButton from "./ConnectButton";
import { Text } from "react-native-paper";
import { ProductCard } from "./ProductCard";
import { Certificate, Metadata } from "@/types/Metadata";

type ProductsProps = {
  refreshing: boolean;
  onRefresh: () => void;
  certs?: (Certificate | undefined)[];
};

export function Products({ refreshing, onRefresh, certs }: ProductsProps) {
  const productsCards = certs?.map((cert, key) => {
    if (cert === undefined) return null;
    return <ProductCard cert={cert} key={key} />;
  });

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      bounces
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView style={styles.container}>
        <View>
          <ConnectButton>Connect Wallet</ConnectButton>
        </View>
        <View style={styles.productsContainer}>
          {productsCards?.length && (
            <Text variant="headlineMedium">My Products</Text>
          )}
          {productsCards?.length ? (
            productsCards
          ) : (
            <Text variant="headlineMedium">No products owned</Text>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    width: "75%",
  },
  productsContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 32,
  },
});
