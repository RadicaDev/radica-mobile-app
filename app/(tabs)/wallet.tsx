import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/theme/paperTheme";
import { AppKitButton } from "@reown/appkit-wagmi-react-native";
import ConnectButton from "@/components/Wallet/ConnectButton";

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
        {/*<AppKitButton balance="show" label="Connect Wallet" />*/}
        <ConnectButton>Connect Wallet</ConnectButton>
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
