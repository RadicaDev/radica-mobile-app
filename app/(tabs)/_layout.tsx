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
          height: 92,
          shadowColor: theme.colors.shadow,
          shadowOpacity: 0.1,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
        headerShown: false,
        unmountOnBlur: true,
      }}
    >
      <Tabs.Screen
        name="online"
        options={{
          title: "Online",
          tabBarIcon: ({ color }) => (
            <Icon source="web" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Verify",
          tabBarIcon: ({ color }) => (
            <Icon source="nfc" size={28} color={color} />
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
