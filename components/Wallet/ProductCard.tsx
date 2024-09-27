import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";

type Metadata = {
  id: string;
  description?: string;
  external_url?: string;
  image?: string;
  name?: string;
};

type ProductCardProps = {
  product: Metadata;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.cardContainer}>
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
