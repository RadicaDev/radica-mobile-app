import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import { PermissionResponse } from "expo-camera";

interface PermissionsProps {
  requestPermission: () => Promise<PermissionResponse>;
}

export function Permissions({ requestPermission }: PermissionsProps) {
  return (
    <View style={styles.container}>
      <Text variant="bodyMedium">
        We need your permission to show the camera
      </Text>
      <Button onPress={requestPermission}>grant permission</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
