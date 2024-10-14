import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { Dialog, HelperText, TextInput } from "react-native-paper";
import { isAddress } from "viem";
import StyledButton from "../Shared/StyledButton";
import { useAccount, useWriteContract } from "wagmi";
import { abi, address } from "@/constants/RadicaPropertyContract";
import { router } from "expo-router";
import { useEffect, useState } from "react";

type TransferModalProps = {
  recipientAddress: string;
  setRecipientAddress: (value: string) => void;
  isDialogVisible: boolean;
  setIsDialogVisible: (value: boolean) => void;
  setIsScanning: (value: boolean) => void;
  tokenId: bigint;
};

export function TransferModal({
  recipientAddress,
  setRecipientAddress,
  isDialogVisible,
  setIsDialogVisible,
  setIsScanning,
  tokenId,
}: TransferModalProps) {
  const [recipientAddressCopy, setRecipientAddressCopy] = useState<string>("");
  const { address: userAddress } = useAccount();
  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onError: () => {
        alert(`An error occurred`);
      },
      onSuccess: () => {
        router.navigate("/wallet");
        alert(`Product transfered successfully!`);
      },
    },
  });

  const isError = (address: string) => {
    return address !== "" && !isAddress(address);
  };

  const handleTransfer = async () => {
    writeContract({
      abi,
      address,
      functionName: "safeTransferFrom",
      args: [
        userAddress as `0x${string}`,
        recipientAddressCopy as `0x${string}`,
        tokenId,
      ],
    });
  };

  useEffect(() => {
    setRecipientAddressCopy(recipientAddress);
  }, [recipientAddress]);

  return (
    <Dialog
      visible={isDialogVisible}
      onDismiss={() => setIsDialogVisible(false)}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Dialog.Title>Transfer Product Ownership</Dialog.Title>
          <Dialog.Content>
            <HelperText type="info">
              You are transfering the product ownership to some other account.
              Beware there is no going back, be sure the address is correct!
            </HelperText>
            <TextInput
              mode="outlined"
              label="Recipient Address"
              placeholder="0x..."
              value={recipientAddressCopy}
              onChangeText={(text) => {
                setRecipientAddressCopy(text);
                setRecipientAddress(text);
              }}
              error={isError(recipientAddressCopy)}
              right={
                <TextInput.Icon
                  icon="qrcode-scan"
                  onPress={() => {
                    Keyboard.dismiss();
                    setIsScanning(true);
                  }}
                />
              }
              multiline
            />
            <HelperText type="error" visible={isError(recipientAddressCopy)}>
              Address is invalid!
            </HelperText>
          </Dialog.Content>
          <Dialog.Actions>
            <StyledButton
              variant="primary"
              onPress={handleTransfer}
              disabled={
                recipientAddressCopy === "" ||
                isError(recipientAddressCopy) ||
                isPending
              }
            >
              Confirm
            </StyledButton>
          </Dialog.Actions>
        </View>
      </TouchableWithoutFeedback>
    </Dialog>
  );
}
