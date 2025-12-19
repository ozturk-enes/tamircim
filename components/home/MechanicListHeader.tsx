import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MechanicListHeaderProps {
  count: number;
  onSort: () => void;
}

export default function MechanicListHeader({
  count,
  onSort,
}: MechanicListHeaderProps) {
  return (
    <View style={styles.listHeader}>
      <Text style={styles.listTitle}>Tamirciler ({count})</Text>
      <TouchableOpacity style={styles.sortButton} onPress={onSort}>
        <Ionicons name="funnel" size={16} color={Colors.light.primary} />
        <Text style={styles.sortText}>Sırala</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  sortText: {
    marginLeft: 4,
    color: Colors.light.primary,
    fontWeight: "500",
  },
});
