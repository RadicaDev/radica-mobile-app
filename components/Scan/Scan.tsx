import { BarcodeScanningResult, CameraView } from "expo-camera";
import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const overlaySize = width * 0.7;

interface ScanProps {
  setData: (data: string) => void;
}

export function Scan({ setData }: ScanProps) {
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    if (scanningResult && !scanned) {
      setScanned(true);
      setTimeout(() => {
        setData(scanningResult.data);
      }, 500);
      setTimeout(() => {
        setScanned(false);
      }, 600);
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={handleBarCodeScanned}
        active={!scanned}
      />

      <View style={styles.overlayContainer}>
        <View style={styles.overlay} />
        <Text style={styles.instructionText}>
          Align the QR code within the square
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    width: overlaySize,
    height: overlaySize,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "transparent",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    color: "#fff",
    marginTop: 20,
    fontSize: 16,
  },
  scanAgainButton: {
    position: "absolute",
    bottom: 30,
    width: "80%",
    alignSelf: "center",
  },
});
