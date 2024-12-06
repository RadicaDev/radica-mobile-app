import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Card, Icon, Snackbar, Text } from "react-native-paper";
import { useAppTheme } from "@/theme/paperTheme";
import { router } from "expo-router";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import {
  abi,
  address as contractAddress,
} from "@/constants/RadicaPropertyContract";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";
import StyledButton from "../Shared/StyledButton";
import ConnectButton from "../Wallet/ConnectButton";
import { AppKit } from "@reown/appkit-wagmi-react-native";
import { Metadata, TracebilityMetadata } from "@/types/Metadata";

interface AuthenticProps {
  certId: bigint;
  metadata: Metadata;
  traceabilityMetadata: TracebilityMetadata;
  proof?: `0x${string}`;
  tagAddress: `0x${string}`;
}

export function Authentic({
  certId,
  metadata,
  traceabilityMetadata,
  proof,
  tagAddress,
}: AuthenticProps) {
  const { serialNumber, name, description, image } = metadata;

  const theme = useAppTheme();

  const [showConnect, setShowConnect] = useState(false);
  const [showSnakbar, setShowSnackbar] = useState(false);

  const { address: userAddress } = useAccount();

  const { data: ownerAddress } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "ownerOf",
    args: [certId],
  });

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onError: () => {
        alert(`An error occurred`);
      },
      onSuccess: () => {
        alert(`Property claimed successfully!`);
      },
    },
  });

  const handleClaimProperty = async () => {
    if (!userAddress) {
      alert("Please connect your wallet first.");
      setShowConnect(true);
      return;
    }
    if (proof) {
      writeContract({
        abi,
        address: contractAddress,
        functionName: "claimProperty",
        args: [certId, proof],
      });
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.success, theme.colors.surface]}
      style={styles.background}
    >
      <ScrollView bounces>
        <View style={styles.container}>
          {/* Icon for success */}
          <View style={styles.icon}>
            <Icon
              source="check-circle-outline"
              size={64}
              color={theme.colors.onSuccess}
            />

            {/* Success Message */}
            <Text
              style={[styles.successText, { color: theme.colors.onSuccess }]}
            >
              Authentic Product
            </Text>
          </View>

          {/* Product Card */}
          <TouchableOpacity
            style={styles.productCardContainer}
            onPress={() => {
              router.replace({
                pathname: "../product/[...product].tsx",
                params: {
                  certId: `0x${certId.toString(16)}`,
                  ...metadata,
                  ...traceabilityMetadata,
                  tagAddress,
                },
              });
            }}
          >
            <Card style={styles.productCard}>
              {image && (
                <Card.Cover
                  source={{ uri: metadata.image }}
                  style={styles.productImage}
                />
              )}
              <Card.Content>
                {name && <Text style={styles.productName}>{name}</Text>}
                {serialNumber && (
                  <Text
                    style={[styles.productId, { color: theme.colors.primary }]}
                  >
                    {serialNumber}
                  </Text>
                )}
                {description && (
                  <Text style={styles.productDescription}>{description}</Text>
                )}
              </Card.Content>
            </Card>
          </TouchableOpacity>

          {/* Owner */}
          {ownerAddress && (
            <View>
              {ownerAddress !== userAddress && (
                <Text
                  style={[styles.ownerText, { color: theme.colors.onSurface }]}
                >
                  Current product owner:
                </Text>
              )}
              {ownerAddress !== userAddress ? (
                <TouchableOpacity
                  onPress={async () => {
                    await Clipboard.setStringAsync(ownerAddress);
                    setShowSnackbar(true);
                  }}
                >
                  <Text
                    style={[
                      styles.ownerText,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {ownerAddress}
                  </Text>
                  <Snackbar
                    visible={showSnakbar}
                    duration={1000}
                    onDismiss={() => setShowSnackbar(false)}
                  >
                    Owner address copied to clipboard!
                  </Snackbar>
                </TouchableOpacity>
              ) : (
                <Text
                  style={[styles.ownerText, { color: theme.colors.onSurface }]}
                >
                  You own this product!
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {!ownerAddress &&
          (showConnect && !userAddress ? (
            <ConnectButton
              variant="primary"
              contentStyle={styles.buttonContent}
              style={styles.button}
            >
              Connect Wallet
            </ConnectButton>
          ) : (
            proof && (
              <StyledButton
                variant="primary"
                onPress={handleClaimProperty}
                contentStyle={styles.buttonContent}
                style={styles.button}
                disabled={isPending}
              >
                Claim Product
              </StyledButton>
            )
          ))}
        <StyledButton
          variant="inverseSurface"
          onPress={() => router.back()}
          contentStyle={styles.buttonContent}
          style={styles.button}
        >
          Go Back
        </StyledButton>
      </View>
      <AppKit />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 28,
    padding: 20,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  successText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  productCardContainer: {
    width: "90%",
  },
  productCard: {
    borderRadius: 15,
    elevation: 4, // Adds a shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5, // For iOS shadow
    marginBottom: 20,
  },
  productImage: {
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  productId: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
    opacity: 0.7,
  },
  productName: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
  },
  productDescription: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    opacity: 0.8,
  },
  ownerText: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 48,
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
  },
  buttonContent: {
    width: Dimensions.get("window").width - 60,
    height: 60,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    fontSize: 18,
  },
});
