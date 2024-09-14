import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Button, Card, Icon, Snackbar, Text } from "react-native-paper";
import { useAppTheme } from "@/theme/paperTheme";
import { router } from "expo-router";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import {
  abi,
  address as contractAddress,
} from "@/constants/RadixPropertyContract";
import { useState } from "react";
import * as Clipboard from "expo-clipboard";

interface AuthenticProps {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  tokenId: bigint;
  proof: `0x${string}`;
}

export function Authentic({
  id,
  name,
  description,
  image,
  tokenId,
  proof,
}: AuthenticProps) {
  const theme = useAppTheme();

  const [showConnect, setShowConnect] = useState(false);
  const [showSnakbar, setShowSnackbar] = useState(false);

  const { address: userAddress } = useAccount();

  const { data: ownerAddress } = useReadContract({
    abi,
    address: contractAddress,
    functionName: "ownerOf",
    args: [tokenId],
  });

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onError: () => {
        alert(`An Error Occurred`);
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
    writeContract({
      abi,
      address: contractAddress,
      functionName: "claimProperty",
      args: [tokenId, proof, `Property of ${tokenId.toString()}`],
    });
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
          <Card style={styles.productCard}>
            {image && (
              <Card.Cover source={{ uri: image }} style={styles.productImage} />
            )}
            <Card.Content>
              {name && <Text style={styles.productName}>{name}</Text>}
              {id && (
                <Text
                  style={[styles.productId, { color: theme.colors.primary }]}
                >
                  ID: {id}
                </Text>
              )}
              {description && (
                <Text style={styles.productDescription}>{description}</Text>
              )}
            </Card.Content>
          </Card>

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
          (showConnect ? (
            <Button
              mode="contained"
              onPress={() => router.navigate("/wallet")}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              disabled={isPending}
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleClaimProperty}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
              disabled={isPending}
            >
              Claim Product
            </Button>
          ))}
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          buttonColor={theme.colors.secondary}
          textColor={theme.colors.onSecondary}
        >
          Go Back
        </Button>
      </View>
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
  productCard: {
    width: "90%",
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
    width: "90%",
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 18,
  },
});
