import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import ConnectButton from "@/components/Wallet/ConnectButton";
import { BackgroundGradient } from "@/components/Shared/BackgroundGradient";

export default function WalletScreen() {
  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <ConnectButton>Connect Wallet</ConnectButton>
      </SafeAreaView>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
