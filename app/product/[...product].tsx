import { useLocalSearchParams } from "expo-router";
import { BackgroundGradient } from "@/components/Shared/BackgroundGradient";
import { ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { useReadContract } from "wagmi";
import {
  abi as abiProperty,
  address as addressProperty,
} from "@/constants/RadicaPropertyContract";
import { ProductDetailsCard } from "@/components/Product/ProductDetailsCard";
import { Portal, Snackbar } from "react-native-paper";
import { useRef, useState } from "react";
import { Metadata, TracebilityMetadata } from "@/types/Metadata";
import { TransferModal } from "@/components/Product/TransferModal";
import { CameraModal } from "@/components/Shared/CameraModal";

export default function ProductScreen() {
  const product = useLocalSearchParams();
  const {
    serialNumber,
    name,
    description,
    image,
    manufacturer,
    externalUrl,
    batchId,
    supplierChainHash,
    tagAddress,
  } = product as unknown as Metadata &
    TracebilityMetadata & { tagAddress: `0x${string}` };
  const certId = BigInt(product.certId as `0x${string}`);

  const [showDialog, setShowDialog] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const recipientAddress = useRef<string>("");
  const setRecipientAddress = (value: string) => {
    recipientAddress.current = value;
  };
  const [showSnakbar, setShowSnackbar] = useState(false);

  const { data: ownerAddress } = useReadContract({
    abi: abiProperty,
    address: addressProperty,
    functionName: "ownerOf",
    args: [certId],
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
            tokenId={certId}
          />
        </Portal>
        <ScrollView
          bounces
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <ProductDetailsCard
            serialNumber={serialNumber}
            name={name}
            description={description}
            image={image}
            manufacturer={manufacturer}
            externalUrl={externalUrl}
            batchId={batchId}
            supplierChainHash={supplierChainHash}
            tagAddress={tagAddress}
            ownerAddress={ownerAddress}
            certId={certId}
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
