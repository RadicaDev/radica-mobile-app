import { LinearGradient } from "expo-linear-gradient";
import { View, StyleSheet } from "react-native";
import { Button, Card, Icon, Text } from "react-native-paper";
import { useAppTheme } from "@/theme/paperTheme";
import { router } from "expo-router";

interface AuthenticProps {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
}

export function Authentic({ id, name, description, image }: AuthenticProps) {
  const theme = useAppTheme();

  return (
    <LinearGradient
      colors={[theme.colors.success, theme.colors.surface]}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Icon for success */}
        <View style={styles.icon}>
          <Icon
            source="check-circle-outline"
            size={64}
            color={theme.colors.onSuccess}
          />

          {/* Success Message */}
          <Text style={[styles.successText, { color: theme.colors.onSuccess }]}>
            Authentic Product
          </Text>
        </View>

        {/* Product Card */}
        <Card style={styles.productCard}>
          {image && (
            <Card.Cover source={{ uri: image }} style={styles.productImage} />
          )}
          <Card.Content>
            {name && <Text style={styles.productName}>{name}</Text>}
            {id && (
              <Text style={[styles.productId, { color: theme.colors.primary }]}>
                ID: {id}
              </Text>
            )}
            {description && (
              <Text style={styles.productDescription}>{description}</Text>
            )}
          </Card.Content>
        </Card>

        {/* Button */}
        <Button
          mode="contained"
          onPress={() => router.back()}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          buttonColor={theme.colors.secondary}
          textColor={theme.colors.onSecondary}
        >
          Go Back
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  successText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  productCard: {
    width: "90%",
    borderRadius: 15,
    elevation: 4, // Adds a shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5, // For iOS shadow
    marginBottom: 20,
  },
  productImage: {
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  productId: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
    opacity: 0.7,
  },
  productName: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
  },
  productDescription: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    opacity: 0.8,
  },
  button: {
    marginTop: 20,
    width: "90%",
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 18,
  },
});
