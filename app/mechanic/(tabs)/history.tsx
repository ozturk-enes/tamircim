import Colors from "@/constants/Colors";
import { cars, customers, serviceRecords } from "@/constants/mockData";
import type { ServiceRecord } from "@/types/schema";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function MechanicHistoryScreen() {
  const historyJobs: ServiceRecord[] = useMemo(() => {
    return serviceRecords
      .filter((j) => j.status === "completed")
      .sort(
        (a, b) =>
          new Date(b.completedAt || b.date).getTime() -
          new Date(a.completedAt || a.date).getTime()
      );
  }, []);

  const renderItem = ({ item }: { item: ServiceRecord }) => {
    const car = cars.find((c) => c.id === item.carId);
    const customer = customers.find((c) => c.id === car?.ownerId);

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.carText}>
            {car?.brand} {car?.model} {car?.year}
          </Text>
          <Text style={styles.dateText}>
            {new Date(item.completedAt || item.date).toLocaleString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color={Colors.light.text} />
          <Text style={styles.infoText}>
            {customer?.name || "Bilinmeyen Müşteri"}
          </Text>
        </View>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.descText}>{item.description}</Text>
        {!!item.cost && (
          <View style={styles.footerRow}>
            <Ionicons name="cash" size={16} color={Colors.light.success} />
            <Text style={styles.amountText}>₺{item.cost}</Text>
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
  titleText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 8,
  },
  descText: { fontSize: 13, color: Colors.light.text, marginTop: 4 },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  amountText: { fontSize: 14, fontWeight: "700", color: Colors.light.success },
  workText: { fontSize: 12, color: Colors.light.tabIconDefault, marginTop: 4 },
  emptyState: { alignItems: "center", paddingTop: 40 },
  emptyText: { fontSize: 14, color: Colors.light.tabIconDefault, marginTop: 8 },
});
