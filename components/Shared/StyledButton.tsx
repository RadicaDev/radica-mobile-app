import { Button, ButtonProps } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/theme/paperTheme";

type StyledButtonProps = ButtonProps & {
  variant:
    | "primary"
    | "secondary"
    | "tertiary"
    | "error"
    | "success"
    | "warning"
    | "info";
};

export default function StyledButton({
  variant,
  contentStyle,
  buttonColor,
  labelStyle,
  children,
  ...rest
}: StyledButtonProps) {
  const theme = useAppTheme();
  let labelStyleColor:
    | "onPrimary"
    | "onSecondary"
    | "onTertiary"
    | "onError"
    | "onSuccess"
    | "onWarning"
    | "onInfo";
  switch (variant) {
    case "primary":
      labelStyleColor = "onPrimary";
      break;
    case "secondary":
      labelStyleColor = "onSecondary";
      break;
    case "tertiary":
      labelStyleColor = "onTertiary";
      break;
    case "error":
      labelStyleColor = "onError";
      break;
    case "success":
      labelStyleColor = "onSuccess";
      break;
    case "warning":
      labelStyleColor = "onWarning";
      break;
    case "info":
      labelStyleColor = "onInfo";
      break;
    default:
      labelStyleColor = "onPrimary";
      break;
  }

  return (
    <Button
      contentStyle={[styles.buttonContent, contentStyle]}
      mode="contained"
      labelStyle={[
        styles.buttonLabel,
        {
          color: theme.colors[labelStyleColor],
        },
        labelStyle,
      ]}
      buttonColor={buttonColor ?? theme.colors[variant]}
      {...rest}
    >
      {children}
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
