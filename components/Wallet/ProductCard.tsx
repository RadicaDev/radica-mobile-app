import { Metadata } from "@/types/Metadata";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";

type ProductCardProps = {
  product: Metadata & { tokenId: bigint };
};

export function ProductCard({ product }: ProductCardProps) {
  const handlePress = () => {
    router.push({
      pathname: "../product/[...product]",
      params: { ...product, tokenId: product.tokenId.toString() },
    });
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
      <Card>
        <Card.Content>
          <Paragraph style={styles.cardText}>ID: {product.id}</Paragraph>
          <Title style={styles.cardText}>{product.name}</Title>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    margin: 20,
  },
  cardText: {
    textAlign: "center",
  },
});
