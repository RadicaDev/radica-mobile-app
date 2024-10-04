import { Dialog, Text } from "react-native-paper";
import StyledButton from "../Shared/StyledButton";

type AlertDialogProps = {
  isDialogVisible: boolean;
  setIsDialogVisible: (isDialogVisible: boolean) => void;
};

export function AlertDialog({
  isDialogVisible,
  setIsDialogVisible,
}: AlertDialogProps) {
  return (
    <Dialog
      visible={isDialogVisible}
      onDismiss={() => setIsDialogVisible(false)}
    >
      <Dialog.Title>Beware!</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">
          This is just a preliminary step to verify the authenticity of the
          product you are buying online.
        </Text>
      </Dialog.Content>
      <Dialog.Content>
        <Text variant="bodyMedium">
          It cannot be considered as a proof of authenticity. Always verify the
          physical product when it arrives!
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <StyledButton
          contentStyle={{ width: 150, height: 45 }}
          labelStyle={{ fontSize: 16 }}
          variant="warning"
          onPress={() => setIsDialogVisible(false)}
        >
          Done
        </StyledButton>
      </Dialog.Actions>
    </Dialog>
  );
}
