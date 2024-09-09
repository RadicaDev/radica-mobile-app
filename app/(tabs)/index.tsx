import { W3mButton } from "@web3modal/wagmi-react-native";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text} variant="titleLarge">
        Radix
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          contentStyle={styles.buttonContent}
          mode="elevated"
          onPress={() => router.navigate("/verify")}
        >
          Verify
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  text: {
    margin: 20,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  buttonContent: {
    height: 50,
    width: 200,
  },
});
