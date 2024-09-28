import {
  StyleSheet,
  SafeAreaView,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { BackgroundGradient } from "../Shared/BackgroundGradient";
import { HelperText, Portal, TextInput } from "react-native-paper";
import StyledButton from "../Shared/StyledButton";
import { isAddress } from "viem";
import { useState } from "react";
import { CameraModal } from "./CameraModal";

type VerifyAddressFormProps = {
  address: string;
  setAddress: (address: string) => void;
  handlePress: () => void;
};

export function VerifyAddressForm({
  address,
  setAddress,
  handlePress,
}: VerifyAddressFormProps) {
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const isError = (address: string) => {
    return address !== "" && !isAddress(address);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BackgroundGradient>
        <SafeAreaView style={styles.container}>
          <Portal>
            <CameraModal
              isScanning={isScanning}
              setIsScanning={setIsScanning}
              setAddress={setAddress}
            />
          </Portal>
          <View style={styles.formContainer}>
            <TextInput
              mode="outlined"
              label="Address"
              placeholder="0x..."
              value={address}
              onChangeText={(text) => setAddress(text)}
              error={isError(address)}
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
            <HelperText type="error" visible={isError(address)}>
              Address is invalid!
            </HelperText>
          </View>
          <StyledButton
            variant="primary"
            onPress={handlePress}
            disabled={address === "" || isError(address)}
          >
            Verify
          </StyledButton>
        </SafeAreaView>
      </BackgroundGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  formContainer: {
    width: "90%",
  },
  modalContainer: {
    padding: 20,
    height: "70%",
    width: "80%",
    margin: "auto",
  },
});
