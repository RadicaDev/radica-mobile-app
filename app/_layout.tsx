import "@walletconnect/react-native-compat";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { PaperProvider } from "react-native-paper";
import { theme } from "@/theme/paperTheme";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { WagmiProvider } from "wagmi";
import { AppKit, createAppKit } from "@reown/appkit-wagmi-react-native";
import modalOptions, { wagmiConfig } from "@/wagmi";
import { SwitchChain } from "@/wagmi/SwitchChain";
import { defaultNetwork } from "@/app-settings";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

createAppKit(modalOptions);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider
            theme={colorScheme === "dark" ? theme.dark : theme.light}
          >
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="verify/[...tag]"
                options={{
                  headerShown: false,
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="product/[...product]"
                options={{
                  headerTitle: "Product Details",
                  headerTransparent: true,
                  headerBackTitle: "Go back",
                  headerBlurEffect: "regular",
                }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          </PaperProvider>
          <AppKit />
          <SwitchChain chain={defaultNetwork} />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
