import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export default function AuthHeader({
  title,
  subtitle,
  iconName,
  iconColor = Colors.light.primary,
}: AuthHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={80} color={iconColor} />
      </View>
      <Text style={[styles.title, { color: iconColor }]}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", marginBottom: 40 },
  iconContainer: { marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text,
    opacity: 0.7,
    textAlign: "center",
  },
});
