import { StyleSheet } from "react-native";
import {
  AccountButton,
  AppKitButton,
  useAppKit,
  useAppKitState,
} from "@reown/appkit-wagmi-react-native";
import { Button, ButtonProps } from "react-native-paper";
import { useAppTheme } from "@/theme/paperTheme";
import { useAccount } from "wagmi";

type ConnectButtonProps = Omit<ButtonProps, "onPress" | "disable">;

export default function ConnectButton({
  contentStyle,
  mode,
  labelStyle,
  children,
}: ConnectButtonProps) {
  const theme = useAppTheme();
  const { open } = useAppKit();
  const { open: isOpen } = useAppKitState();
  const { address } = useAccount();

  const handlePress = () => {
    open();
  };

  if (address) {
    return <AccountButton balance="show" />;
  }

  return (
    <Button
      contentStyle={[styles.buttonContent, contentStyle]}
      mode={mode ?? "contained"}
      onPress={handlePress}
      labelStyle={[
        styles.buttonLabel,
        { color: theme.colors.onPrimary },
        labelStyle,
      ]}
      disabled={isOpen}
    >
      {!isOpen ? children : "Connecting..."}
    </Button>
  );
}

const styles = StyleSheet.create({
  buttonContent: {
    height: 50,
    width: 200,
  },
  buttonLabel: {
    fontSize: 18,
  },
});
