import { SafeAreaView, StyleSheet } from "react-native";
import ConnectButton from "./ConnectButton";

export function WalletConnect() {
  return (
    <SafeAreaView style={styles.container}>
      <ConnectButton>Connect Wallet</ConnectButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
