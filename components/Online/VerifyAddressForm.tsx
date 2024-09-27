import {
  StyleSheet,
  SafeAreaView,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { BackgroundGradient } from "../Shared/BackgroundGradient";
import { HelperText, TextInput } from "react-native-paper";
import StyledButton from "../Shared/StyledButton";
import { isAddress } from "viem";

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
  const isError = (address: string) => {
    return address !== "" && !isAddress(address);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <BackgroundGradient>
        <SafeAreaView style={styles.container}>
          <View style={styles.formContainer}>
            <TextInput
              mode="outlined"
              label="Address"
              placeholder="0x..."
              value={address}
              onChangeText={(text) => setAddress(text)}
              error={isError(address)}
              right={<TextInput.Icon icon="qrcode-scan" />}
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
});
