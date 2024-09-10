import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "@/theme/paperTheme";

export default function HomeScreen() {
  const theme = useAppTheme();
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
          onPress={() => router.navigate("/verify")}
          labelStyle={[styles.buttonLabel, { color: theme.colors.onPrimary }]}
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
