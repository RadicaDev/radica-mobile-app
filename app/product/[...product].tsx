import { useLocalSearchParams } from "expo-router";
import { BackgroundGradient } from "@/components/Shared/BackgroundGradient";
import { ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { useReadContract } from "wagmi";
import {
  abi as abiRadica,
  address as addressRadica,
} from "@/constants/RadicaTagContract";
import {
  abi as abiProperty,
  address as addressProperty,
} from "@/constants/RadicaPropertyContract";
import { ProductDetailsCard } from "@/components/Product/ProductDetailsCard";
import { Portal, Snackbar } from "react-native-paper";
import { useRef, useState } from "react";
import { Metadata } from "@/types/Metadata";
import { TransferModal } from "@/components/Product/TransferModal";
import { CameraModal } from "@/components/Shared/CameraModal";

export default function ProductScreen() {
  const product = useLocalSearchParams();
  const { id, name, description, image, external_url } =
    product as unknown as Metadata & { id: string };
  const tokenId = BigInt(product.tokenId as string);

  const [showDialog, setShowDialog] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const recipientAddress = useRef<string>("");
  const setRecipientAddress = (value: string) => {
    recipientAddress.current = value;
  };
  const [showSnakbar, setShowSnackbar] = useState(false);

  const { data: tagAddress } = useReadContract({
    abi: abiRadica,
    address: addressRadica,
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
        <Portal>
          <Portal>
            <CameraModal
              isScanning={isScanning}
              setIsScanning={setIsScanning}
              setAddress={setRecipientAddress}
            />
          </Portal>
          <TransferModal
            recipientAddress={recipientAddress.current}
            setRecipientAddress={setRecipientAddress}
            isDialogVisible={showDialog}
            setIsDialogVisible={setShowDialog}
            setIsScanning={setIsScanning}
            tokenId={tokenId}
          />
        </Portal>
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
            setShowDialog={setShowDialog}
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
