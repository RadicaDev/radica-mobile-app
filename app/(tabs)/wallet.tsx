import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { W3mButton } from "@web3modal/wagmi-react-native";

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <W3mButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
