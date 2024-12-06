import { Certificate, Metadata } from "@/types/Metadata";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";

type ProductCardProps = {
  cert: Certificate;
};

export function ProductCard({ cert }: ProductCardProps) {
  const handlePress = () => {
    router.push({
      pathname: "../product/[...product]",
      params: {
        ...cert.metadata,
        ...cert.traceabilityMetadata,
        certId: `0x${cert.id.toString(16)}`,
      },
    });
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={handlePress}>
      <Card>
        <Card.Content>
          <Paragraph style={styles.cardText}>
            ID: {cert.metadata.serialNumber}
          </Paragraph>
          <Title style={styles.cardText}>{cert.metadata.name}</Title>
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
