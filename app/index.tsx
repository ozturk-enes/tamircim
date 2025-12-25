import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function ActionButton({
  label,
  icon,
  onPress,
  tintColor,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress: () => void;
  tintColor: string;
}) {
  const highlight = React.useRef(new Animated.Value(0)).current;
  const handlePressIn = () =>
    Animated.timing(highlight, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start();
  const handlePressOut = () =>
    Animated.timing(highlight, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onHoverIn={handlePressIn}
      onHoverOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {({ hovered, pressed }) => {
        const active = hovered || pressed;
        const borderColor = active ? tintColor : tintColor;
        const overlayOpacity = Animated.multiply(
          highlight,
          new Animated.Value(0.22)
        );

        return (
          <View
            style={[styles.button, { backgroundColor: tintColor, borderColor }]}
          >
            <AnimatedLinearGradient
              colors={[hexToRgba("#FFFFFF", 0.18), "rgba(255,255,255,0)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[StyleSheet.absoluteFill, { opacity: overlayOpacity }]}
            />
            <Ionicons
              name={icon}
              size={24}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>{label}</Text>
          </View>
        );
      }}
    </Pressable>
  );
}

export default function WelcomeScreen() {
  const handleCustomerLogin = () => {
    router.push("/(login)/customerLogin");
  };

  const handleMechanicLogin = () => {
    router.push("/(login)/mechanicLogin");
  };

  const panelPaddingBottom = Math.max(16, Math.min(height * 0.02, 24));

  return (
    <ImageBackground
      source={require("../assets/images/tamir.jpg")}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 1 }}
    >
      <LinearGradient
        colors={["transparent", "transparent", "transparent"]}
        style={styles.container}
      >
        <View style={styles.content}>
          <BlurView
            intensity={24}
            tint="light"
            style={styles.mistBlur}
            pointerEvents="none"
          />
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.06)",
              "rgba(255,255,255,0.1)",
              "rgba(0,0,0,0.05)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.mistOverlay}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.75)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.bottomFade}
          />
          <View style={[styles.panel, { paddingBottom: panelPaddingBottom }]}>
            <View style={styles.logoContainer}>
              <Text style={styles.appTitle}>Tamircim</Text>
              <View style={styles.titleUnderline} />
            </View>
            <View style={styles.buttonContainer}>
              <ActionButton
                label="Müşteri Girişi"
                icon="person"
                onPress={handleCustomerLogin}
                tintColor="#2196F3"
              />
              <ActionButton
                label="Tamirci Girişi"
                icon="construct"
                onPress={handleMechanicLogin}
                tintColor="#FF9800"
              />
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Hızlı, güvenilir ve kaliteli hizmet
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 60,
    position: "relative",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3c3a3aff",
    marginBottom: 8,
    letterSpacing: Platform.OS === "web" ? 0.5 : 0.4,
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
  buttonContainer: {
    width: "100%",
    gap: 24,
  },
  panel: {
    width: "92%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },
  mistBlur: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  mistOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  titleUnderline: {
    width: 64,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2196F3",
    marginTop: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    borderWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: "auto",
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.6,
    textAlign: "center",
  },
});
