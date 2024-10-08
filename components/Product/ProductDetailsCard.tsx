import { useAppTheme } from "@/theme/paperTheme";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Divider, List, Paragraph, Title } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { Metadata } from "@/types/Metadata";

type ProductDetailsCardProps = Metadata & {
  tokenId: bigint;
  tagAddress?: `0x${string}`;
  ownerAddress?: `0x${string}`;
  setShowSnackbar: (value: boolean) => void;
};

export function ProductDetailsCard({
  id,
  name,
  description,
  image,
  external_url,
  tagAddress,
  ownerAddress,
  tokenId,
  setShowSnackbar,
}: ProductDetailsCardProps) {
  const [expandedId, setExpandedId] = useState<string | number | undefined>(
    undefined,
  );

  const theme = useAppTheme();

  const accordionItemsContent = [
    { title: "Description", description: description, icon: "text-box" },
    { title: "Image URL", description: image, icon: "image" },
    { title: "External URL", description: external_url, icon: "open-in-new" },
    { title: "Tag Address", description: tagAddress, icon: "tag" },
    { title: "Owner Address", description: ownerAddress, icon: "account" },
    {
      title: "Token ID",
      description: tokenId.toString(),
      icon: "currency-eth",
    },
  ];

  const accordionItems = accordionItemsContent.map((item, index) => {
    return (
      item.description && (
        <View key={index}>
          <List.Accordion
            style={{
              backgroundColor: theme.colors.elevation.level1,
            }}
            title={item.title}
            left={(props) => <List.Icon {...props} icon={item.icon} />}
            id={index + 1}
          >
            <List.Item
              style={[
                styles.accordionItem,
                { backgroundColor: theme.colors.surfaceDisabled },
              ]}
              title={item.description}
              titleNumberOfLines={0}
              left={(props) =>
                item.title !== "Description" && (
                  <TouchableOpacity
                    onPress={async () => {
                      await Clipboard.setStringAsync(
                        item.description as string,
                      );
                      setShowSnackbar(true);
                    }}
                  >
                    <List.Icon {...props} icon="content-copy" />
                  </TouchableOpacity>
                )
              }
            />
          </List.Accordion>
          {index !== accordionItemsContent.length - 1 &&
            expandedId !== index + 1 && <Divider />}
        </View>
      )
    );
  });

  return (
    <Card mode="elevated" style={styles.card}>
      {image && <Card.Cover source={{ uri: image }} style={styles.image} />}
      <Card.Content style={styles.cardContent}>
        <View>
          <Title style={styles.title}>{name ?? "Unknown Product"}</Title>
          <Paragraph style={styles.id}>Product ID: {id}</Paragraph>
        </View>
        <View style={{ width: "100%" }}>
          <List.AccordionGroup
            onAccordionPress={(expandedId) =>
              setExpandedId((prev) => {
                return prev === expandedId ? undefined : expandedId;
              })
            }
            expandedId={expandedId}
          >
            {accordionItems}
          </List.AccordionGroup>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    margin: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  cardContent: {
    alignItems: "center",
  },
  image: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  id: {
    textAlign: "center",
    color: "gray",
    marginBottom: 10,
  },
  accordionItem: { borderRadius: 10 },
});
