import Colors from "@/constants/Colors";
import type { Car } from "@/constants/mockData";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface VehicleCardProps {
  car: Car;
  onPress: () => void;
}

export default function VehicleCard({ car, onPress }: VehicleCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardInner}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            {car.brand} {car.model}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>{String(car.year)}</Text>
          <Text style={styles.detailSeparator}>•</Text>
          <Text style={styles.detailText}>{car.plate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    width: "100%",
    aspectRatio: 10 / 4,
    justifyContent: "center",
  },
  cardInner: {
    paddingHorizontal: 14,
  },
  headerRow: {
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
  detailSeparator: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
});
