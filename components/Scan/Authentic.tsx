import { LinearGradient } from "expo-linear-gradient";
import { View, Image, StyleSheet, Animated } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useAppTheme } from "@/theme/paperTheme";
import { useEffect, useRef, useState } from "react";

interface AuthenticProps {
  status: string;
  id?: string;
  name?: string;
  description?: string;
}

export function Authentic({ status, id, name, description }: AuthenticProps) {
  const [showProductInfo, setShowProductInfo] = useState(false);

  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  const theme = useAppTheme();

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      Animated.timing(fadeOutAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 1000);

    const fadeInTimer = setTimeout(() => {
      setShowProductInfo(true);

      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(fadeOutTimer);
    };
  }, [fadeInAnim]);

  return (
    <LinearGradient
      colors={[theme.colors.success, theme.colors.surfaceVariant]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {!showProductInfo && (
          <View style={styles.icon}>
            <Icon
              source="check-circle-outline"
              size={100}
              color={theme.colors.onSuccess}
            />
          </View>
        )}
        {!showProductInfo && (
          <Text
            variant="headlineLarge"
            style={[styles.text, { color: theme.colors.onSuccess }]}
          >
            {status}!
          </Text>
        )}

        {/* Product Information Section */}
        {showProductInfo && (
          <Animated.View
            style={[
              styles.productContainer,
              { backgroundColor: theme.colors.surface },
              { opacity: fadeInAnim },
            ]}
          >
            <Image
              src="https://picsum.photos/700"
              style={styles.productImage}
              resizeMode="contain"
            />
            <Text style={[styles.productId, { color: theme.colors.onSurface }]}>
              ID: {id}
            </Text>
            <Text style={[styles.productName, { color: theme.colors.primary }]}>
              {name}
            </Text>
            <Text
              style={[
                styles.productDescription,
                { color: theme.colors.onSurface },
              ]}
            >
              {description}
            </Text>
          </Animated.View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  productContainer: {
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 5,
  },
  productId: {
    fontSize: 14,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    textAlign: "center",
  },
});
