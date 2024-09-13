import { useAppTheme } from "@/theme/paperTheme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";

interface ErrorProps {
  text: string;
}

export function Error({ text }: ErrorProps) {
  const theme = useAppTheme();

  return (
    <LinearGradient
      colors={[theme.colors.error, theme.colors.surfaceVariant]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.icon}>
          <Icon
            source="alert-circle-outline"
            size={100}
            color={theme.colors.onError}
          />
        </View>
        <Text
          variant="headlineLarge"
          style={[styles.text, { color: theme.colors.onError }]}
        >
          {text}
        </Text>
      </View>
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
  icon: {
    marginBottom: 20,
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
});
