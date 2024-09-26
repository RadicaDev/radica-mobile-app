import { SafeAreaView } from "react-native";
import { StyleSheet } from "react-native";
import { BackgroundGradient } from "../Shared/BackgroundGradient";
import StyledButton from "../Shared/StyledButton";

type HomeProps = {
  handlePress: () => Promise<void>;
  hasNfc: boolean | null;
};

export function Home({ handlePress, hasNfc }: HomeProps) {
  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <StyledButton
          variant="primary"
          onPress={handlePress}
          disabled={hasNfc === null}
        >
          Verify
        </StyledButton>
      </SafeAreaView>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});
