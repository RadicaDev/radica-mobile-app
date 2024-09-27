import {
  AccountButton,
  useAppKit,
  useAppKitState,
} from "@reown/appkit-wagmi-react-native";
import { ButtonProps } from "react-native-paper";
import { useAccount } from "wagmi";
import StyledButton from "../Shared/StyledButton";

type ConnectButtonProps = Omit<ButtonProps, "onPress" | "disable">;

export default function ConnectButton({
  contentStyle,
  mode,
  labelStyle,
  children,
}: ConnectButtonProps) {
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
    <StyledButton
      variant="primary"
      contentStyle={contentStyle}
      mode={mode}
      onPress={handlePress}
      labelStyle={labelStyle}
      disabled={isOpen}
    >
      {!isOpen ? children : "Connecting..."}
    </StyledButton>
  );
}