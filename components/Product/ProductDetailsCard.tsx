import { useAppTheme } from "@/theme/paperTheme";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Divider, List, Paragraph, Title } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { Metadata, TracebilityMetadata } from "@/types/Metadata";
import { useAccount } from "wagmi";
import StyledButton from "../Shared/StyledButton";

type ProductDetailsCardProps = Metadata &
  TracebilityMetadata & {
    certId: bigint;
    tagAddress?: `0x${string}`;
    ownerAddress?: `0x${string}`;
    setShowSnackbar: (value: boolean) => void;
    setShowDialog: (value: boolean) => void;
  };

export function ProductDetailsCard({
  serialNumber,
  name,
  description,
  image,
  manufacturer,
  externalUrl,
  batchId,
  supplierChainHash,
  tagAddress,
  ownerAddress,
  certId,
  setShowSnackbar,
  setShowDialog,
}: ProductDetailsCardProps) {
  const [expandedId, setExpandedId] = useState<string | number | undefined>(
    undefined,
  );

  const theme = useAppTheme();

  const { address: userAddress } = useAccount();

  const issuerFP =
    (certId >> 160n).toString(16).toUpperCase().match(/.{2}/g)?.join(":") || "";

  const accordionItemsContent = [
    { title: "Serial Number", description: serialNumber, icon: "tag" },
    { title: "Name", description: name, icon: "text-box" },
    { title: "Description", description: description, icon: "text-box" },
    { title: "Image URL", description: image, icon: "image" },
    { title: "Manufacturer", description: manufacturer, icon: "cogs" },
    { title: "External URL", description: externalUrl, icon: "open-in-new" },
    { title: "Tag Address", description: tagAddress, icon: "tag" },
    { title: "Batch Id", description: batchId, icon: "database-cog" },
    {
      title: "Supplier Chain Hash",
      description: supplierChainHash,
      icon: "link-lock",
    },
    {
      title: "Token ID",
      description: ownerAddress ? `0x${certId.toString(16)}` : undefined,
      icon: "currency-eth",
    },
    { title: "Owner Address", description: ownerAddress, icon: "account" },
    {
      title: "Issuer Fingerprint",
      description: issuerFP,
      icon: "fingerprint",
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
          <Title style={styles.title}>Certificate ID</Title>
          <TouchableOpacity
            onPress={async () => {
              await Clipboard.setStringAsync(`${certId.toString(16)}`);
              setShowSnackbar(true);
            }}
          >
            <Paragraph
              style={styles.id}
            >{`0x${certId.toString(16)}`}</Paragraph>
          </TouchableOpacity>
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
      {userAddress && ownerAddress && userAddress === ownerAddress && (
        <Card.Actions>
          <StyledButton variant="primary" onPress={() => setShowDialog(true)}>
            Transfer
          </StyledButton>
        </Card.Actions>
      )}
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
