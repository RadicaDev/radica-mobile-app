import { MD3LightTheme, MD3DarkTheme, useTheme } from "react-native-paper";
import { Colors } from "@/constants/Colors";

export const theme = {
  light: {
    ...MD3LightTheme,
    colors: Colors.light,
  },
  dark: {
    ...MD3DarkTheme,
    colors: Colors.dark,
  },
};

export type AppTheme = typeof theme.light;

export const useAppTheme = () => useTheme<AppTheme>();
