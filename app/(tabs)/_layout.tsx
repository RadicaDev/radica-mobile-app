import { Tabs } from "expo-router";
import React from "react";

import { Icon } from "react-native-paper";
import { useAppTheme } from "@/theme/paperTheme";

export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="my-products"
        options={{
          title: "My Products",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              source={focused ? "basket" : "basket-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              source={focused ? "home" : "home-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              source={focused ? "wallet" : "wallet-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
