import { useAppTheme } from "@/theme/paperTheme";
import { StyleSheet, View } from "react-native";
import { Modal, Text } from "react-native-paper";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import StyledButton from "../Shared/StyledButton";
import { useState } from "react";
import { isAddress } from "viem";

type CameraModalProps = {
  isScanning: boolean;
  setIsScanning: (isScanning: boolean) => void;
  setAddress: (address: string) => void;
};

export function CameraModal({
  isScanning,
  setIsScanning,
  setAddress,
}: CameraModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanningResult && !scanned) {
      if (!isAddress(scanningResult.data)) {
        return;
      }
      setScanned(true);
      setAddress(scanningResult.data);
      setTimeout(() => {
        setScanned(false);
        setIsScanning(false);
      }, 500);
    }
  };

  const theme = useAppTheme();

  const ModalWrapper = ({ children }: { children: React.JSX.Element }) => {
    return (
      <Modal
        visible={isScanning}
        onDismiss={() => setIsScanning(false)}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        {children}
      </Modal>
    );
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <ModalWrapper>
        <View style={styles.requestPermissionContainer}>
          <Text variant="labelLarge" style={styles.requestPermissionText}>
            Camera permissions are needed
          </Text>
          <StyledButton
            variant="warning"
            labelStyle={styles.requestPermissionButton}
            onPress={requestPermission}
          >
            Grant Permissions
          </StyledButton>
        </View>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper>
      <CameraView
        facing="back"
        style={styles.camera}
        onBarcodeScanned={handleBarCodeScanned}
        active={!scanned}
      >
        <View style={styles.overlay}>
          <View style={styles.targetArea}></View>
          <Text style={styles.scanText}>Scan QR code</Text>
        </View>
      </CameraView>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    height: "70%",
    width: "80%",
    margin: "auto",
  },
  requestPermissionContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  requestPermissionText: {
    marginBottom: 20,
  },
  requestPermissionButton: {
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  targetArea: {
    width: 250,
    height: 250,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
  },
  scanText: {
    marginTop: 20,
    fontSize: 18,
    color: "white",
  },
});
