import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/theme/paperTheme";
import { useEffect, useState } from "react";
import nfcManager, { NfcTech } from "react-native-nfc-manager";
import { keccak256, verifyMessage } from "viem";
import signerAddr from "@/constants/SignerAddress";
import { privateKeyToAddress } from "viem/accounts";

async function scanTag(
  blockNumber: number,
  length: number,
  blockSize = 4,
  packetSize = 16,
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    if (packetSize % blockSize !== 0) {
      console.error("packetSize must be a multiple of blockSize");
      reject("packetSize must be a multiple of blockSize");
    }
    let recoveredAddress: `0x${string}` | null = null;
    let res: number[] = [];
    const p = Math.ceil(length / packetSize);

    try {
      await nfcManager.requestTechnology(NfcTech.NfcA, {
        alertMessage: "Scan the product",
      });

      // read tag memory
      for (let i = 0; i < p; i++) {
        const offset = blockNumber + i * (packetSize / blockSize);
        const tmpRes =
          offset * blockSize + packetSize > blockNumber * blockSize + length
            ? (await nfcManager.nfcAHandler.transceive([0x30, offset])).slice(
                0,
                length % packetSize,
              )
            : await nfcManager.nfcAHandler.transceive([0x30, offset]);
        res = [...res, ...tmpRes];
      }

      // verify the signature
      await nfcManager.setAlertMessageIOS("Verifying signature...");
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      if (res.length < 0x1c * 4) {
        await nfcManager.invalidateSessionWithErrorIOS("Invalid tag");
        reject("Invalid tag");
      }

      const uid = res.slice(0, 8);
      const sig = res.slice(0x4 * 4, 0x4 * 4 + 65);

      const uidHex: `0x${string}` = `0x${uid.map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
      const sigHex: `0x${string}` = `0x${sig.map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;

      let isVerified = false;
      try {
        isVerified = await verifyMessage({
          address: signerAddr,
          message: { raw: uidHex },
          signature: sigHex,
        });
      } catch (e) {
        await nfcManager.invalidateSessionWithErrorIOS("Invalid Signature");
        reject("Invalid Signature");
      }

      if (isVerified) {
        await nfcManager.setAlertMessageIOS("Signature verified!");
        recoveredAddress = privateKeyToAddress(keccak256(uidHex));
        resolve(recoveredAddress);
      } else {
        await nfcManager.invalidateSessionWithErrorIOS("Invalid Signature");
        reject("Invalid Signature");
      }
    } catch (e) {
      try {
        await nfcManager.invalidateSessionIOS();
      } catch (e) {
        console.log(e);
      }
      console.log(e);
      reject(e);
    } finally {
      try {
        await nfcManager.cancelTechnologyRequest();
      } catch (e) {
        console.log(e);
      }
    }
  });
}

export default function HomeScreen() {
  const [hasNfc, setHasNfc] = useState<boolean | null>(false);

  const theme = useAppTheme();

  const handlePress = async () => {
    if (!hasNfc) {
      alert("NFC is not supported on this device");
      return;
    }

    try {
      const data = await scanTag(0, 0x1c * 4);
      router.navigate(`/verify/${data}`);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    async function checkNfcSupport() {
      const supported = await nfcManager.isSupported();
      if (supported) {
        await nfcManager.start();
      }
      setHasNfc(supported);
    }

    checkNfcSupport();
  }, []);

  return (
    <LinearGradient
      colors={[
        theme.colors.primaryContainer,
        theme.colors.secondaryContainer,
        theme.colors.tertiaryContainer,
      ]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <Button
          contentStyle={styles.buttonContent}
          mode="contained"
          onPress={handlePress}
          labelStyle={[styles.buttonLabel, { color: theme.colors.onPrimary }]}
          disabled={hasNfc === null}
        >
          Verify
        </Button>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: "100%",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  buttonContent: {
    height: 50,
    width: 200,
  },
  buttonLabel: {
    fontSize: 18,
  },
});
