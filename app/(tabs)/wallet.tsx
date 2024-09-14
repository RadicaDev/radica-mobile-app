import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { W3mButton } from "@web3modal/wagmi-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/theme/paperTheme";

export default function WalletScreen() {
  const theme = useAppTheme();
  return (
    <LinearGradient
      colors={[
        theme.colors.primaryContainer,
        theme.colors.secondaryContainer,
        theme.colors.tertiaryContainer,
      ]}
    >
      <SafeAreaView style={styles.container}>
        <W3mButton balance="show" />
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
});
