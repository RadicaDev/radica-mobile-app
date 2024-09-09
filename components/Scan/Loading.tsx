import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size="large" style={styles.loader} />
      <Text variant="labelLarge">Loading, please wait...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: "#333", // Optional: change to any color you prefer
  },
});
