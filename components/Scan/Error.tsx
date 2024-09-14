import { useAppTheme } from "@/theme/paperTheme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Icon, Text } from "react-native-paper";

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
          <Text
            variant="headlineLarge"
            style={[styles.text, { color: theme.colors.onError }]}
          >
            {text}
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          buttonColor={theme.colors.secondary}
          textColor={theme.colors.onSecondary}
        >
          Go Back
        </Button>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
  icon: {
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    marginVertical: 48,
    width: "90%",
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 18,
  },
});
