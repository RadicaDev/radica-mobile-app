import { useAppTheme } from "@/theme/paperTheme";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

type BackgroundGradientProps = Omit<LinearGradientProps, "colors">;

export function BackgroundGradient({
  children,
  style,
  ...rest
}: BackgroundGradientProps) {
  const theme = useAppTheme();
  return (
    <LinearGradient
      colors={[
        theme.colors.primaryContainer,
        theme.colors.secondaryContainer,
        theme.colors.tertiaryContainer,
      ]}
      style={[styles.gradient, style]}
      {...rest}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: "100%",
  },
});
