import Colors from "@/constants/Colors";
import type { Job } from "@/constants/mockData";
import { mockJobs, mockCars, mockCustomers } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function MechanicHistoryScreen() {
  const historyJobs: Job[] = useMemo(() => {
    return mockJobs
      .filter((j) => j.status === "completed")
      .sort(
        (a, b) =>
          new Date(b.completedAt || b.createdAt).getTime() -
          new Date(a.completedAt || a.createdAt).getTime()
      );
  }, []);

  const renderItem = ({ item }: { item: Job }) => {
    const car = mockCars.find((c) => c.id === item.carId);
    const customer = mockCustomers.find((c) => c.id === item.customerId);
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.carText}>
            {car?.brand} {car?.model} {car?.year}
          </Text>
          <Text style={styles.dateText}>
            {new Date(item.completedAt || item.createdAt).toLocaleString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color={Colors.light.text} />
          <Text style={styles.infoText}>{customer?.name}</Text>
        </View>
        <Text style={styles.descText}>{item.description}</Text>
        {!!item.paymentAmount && (
          <View style={styles.footerRow}>
            <Ionicons name="cash" size={16} color={Colors.light.success} />
            <Text style={styles.amountText}>₺{item.paymentAmount}</Text>
          </View>
        )}
        {!!item.workDetails && (
          <Text style={styles.workText}>{item.workDetails}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {historyJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="time" size={28} color={Colors.light.tabIconDefault} />
          <Text style={styles.emptyText}>Geçmiş tamir bulunamadı</Text>
        </View>
      ) : (
        <FlatList
          data={historyJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  listContent: { padding: 12 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.secondary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  carText: { fontSize: 16, fontWeight: "700", color: Colors.light.text },
  dateText: { fontSize: 12, color: Colors.light.tabIconDefault },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoText: { fontSize: 14, color: Colors.light.text },
  descText: { fontSize: 13, color: Colors.light.text, marginTop: 6 },
  footerRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  amountText: { fontSize: 14, fontWeight: "700", color: Colors.light.success },
  workText: { fontSize: 12, color: Colors.light.tabIconDefault, marginTop: 4 },
  emptyState: { alignItems: "center", paddingTop: 40 },
  emptyText: { fontSize: 14, color: Colors.light.tabIconDefault, marginTop: 8 },
});

