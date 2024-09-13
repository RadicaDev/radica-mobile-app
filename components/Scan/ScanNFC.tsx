import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import nfcManager, { NfcEvents, NfcTech } from "react-native-nfc-manager";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/theme/paperTheme";

interface ScanProps {
  setData: (data: string) => void;
}

export function Scan({ setData }: ScanProps) {
  const [res, setRes] = useState<number[]>([]);
  const [hasNfc, setHasNfc] = useState<boolean | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const theme = useAppTheme();

  useEffect(() => {
    nfcManager.setEventListener(NfcEvents.SessionClosed, async () => {
      if (res.length === 0) {
        setIsError(true);
        return;
      }

      const hexRes = res
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(hexRes);
    });
  }, [res]);

  async function scanTag(
    blockNumber: number,
    length: number,
    blockSize = 4,
    packetSize = 16,
  ) {
    if (packetSize % blockSize !== 0) {
      console.error("packetSize must be a multiple of blockSize");
      return;
    }
    const p = Math.ceil(length / packetSize);

    try {
      await nfcManager.requestTechnology(NfcTech.NfcA);

      for (let i = 0; i < p; i++) {
        const offset = blockNumber + i * (packetSize / blockSize);
        const tmpRes =
          offset * blockSize + packetSize > blockNumber * blockSize + length
            ? (await nfcManager.nfcAHandler.transceive([0x30, offset])).slice(
                0,
                length % packetSize,
              )
            : await nfcManager.nfcAHandler.transceive([0x30, offset]);
        setRes((prev) => [...prev, ...tmpRes]);
      }
    } catch (e) {
      await nfcManager.invalidateSessionIOS();
      console.error(e);
    } finally {
      await nfcManager.cancelTechnologyRequest();
    }
  }

  useEffect(() => {
    async function checkNfcSupport() {
      const supported = await nfcManager.isSupported();
      if (supported) {
        await nfcManager.start();
      }
      setHasNfc(supported);
      if (supported) {
        scanTag(0, 0x1c * 4);
      }
    }

    checkNfcSupport();
  }, []);

  if (hasNfc === null) {
    return (
      <SafeAreaView>
        <Text>Checking NFC support...</Text>
      </SafeAreaView>
    );
  } else if (!hasNfc) {
    return (
      <SafeAreaView>
        <Text>NFC is not supported on this device</Text>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.surfaceVariant]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <Text
          style={[styles.statusText, { color: theme.colors.onSurface }]}
          variant="titleLarge"
        >
          Waiting for NFC tag...
        </Text>
        {isError && (
          <Button
            mode="contained"
            onPress={() => {
              setIsError(false);
              scanTag(0, 0x1c * 4);
            }}
          >
            Retry
          </Button>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
});
