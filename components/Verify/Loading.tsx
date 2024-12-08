import { useAppTheme } from "@/theme/paperTheme";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ProgressBar, Text } from "react-native-paper";

interface LoadingProps {
  status: string;
}

export function Loading({ status }: LoadingProps) {
  const theme = useAppTheme();

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
          {status}
        </Text>
        <View style={styles.progressBarContainer}>
          <ProgressBar
            indeterminate
            color={theme.colors.primary}
            style={styles.progressBar}
          />
        </View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statusText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  progressBarContainer: {
    width: "80%",
    borderRadius: 10,
    padding: 10,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
  },
});
