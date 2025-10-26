import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const handleCustomerLogin = () => {
    router.push("/(login)/customerLogin");
  };

  const handleMechanicLogin = () => {
    router.push("/(login)/mechanicLogin");
  };

  return (
    <LinearGradient
      colors={[
        Colors.light.lightBlue,
        Colors.light.background,
        Colors.light.lightOrange,
      ]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="car-sport" size={60} color={Colors.light.primary} />
          </View>
          <Text style={styles.appTitle}>Tamircim</Text>
          <Text style={styles.appSubtitle}>Güvenilir Araç Tamiri</Text>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.customerButton]}
            onPress={handleCustomerLogin}
            activeOpacity={0.8}
          >
            <Ionicons
              name="person"
              size={24}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Müşteri Girişi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.mechanicButton]}
            onPress={handleMechanicLogin}
            activeOpacity={0.8}
          >
            <Ionicons
              name="construct"
              size={24}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Tamirci Girişi</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Hızlı, güvenilir ve kaliteli hizmet
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  customerButton: {
    backgroundColor: Colors.light.primary,
  },
  mechanicButton: {
    backgroundColor: Colors.light.secondary,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.6,
    textAlign: "center",
  },
});
