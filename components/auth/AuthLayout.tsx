import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

interface AuthLayoutProps {
  children: React.ReactNode;
  colors?: readonly [string, string, ...string[]]; // Expo Linear Gradient tipleri için
}

export default function AuthLayout({ children, colors }: AuthLayoutProps) {
  // Varsayılan renkler (Customer için mavi tonları)
  const defaultColors = [
    Colors.light.lightBlue,
    Colors.light.background,
  ] as const;

  return (
    <LinearGradient colors={colors || defaultColors} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: "center",
  },
});
