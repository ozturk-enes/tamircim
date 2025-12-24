import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";
import { Job } from "@/types/schema";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function MechanicHistoryScreen() {
  // --- STORE INTEGRATION ---
  const currentUser = useAuthStore((state) => state.user);
  const allJobs = useDataStore((state) => state.jobs);
  const allCars = useDataStore((state) => state.cars);
  const allCustomers = useDataStore((state) => state.customers);

  // --- DATA PROCESSING ---
  const historyJobs = useMemo(() => {
    if (!currentUser) return [];

    // 1. Sadece bu tamirciye ait
    // 2. Sadece tamamlanmış işler
    // 3. Tarihe göre yeniden eskiye sırala
    return allJobs
      .filter(
        (j) => j.mechanicId === currentUser.id && j.status === "completed"
      )
      .sort((a, b) => {
        const dateA = new Date(a.completedAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.completedAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      });
  }, [allJobs, currentUser]);

  const renderItem = ({ item }: { item: Job }) => {
    // İlişkisel verileri bul
    const car = allCars.find((c) => c.id === item.carId);
    const customer = allCustomers.find((c) => c.id === car?.ownerId);

    // Tamamlanma tarihi veya güncelleme tarihi
    const displayDate = item.completedAt
      ? new Date(item.completedAt).toLocaleString("tr-TR")
      : new Date(item.updatedAt).toLocaleString("tr-TR");

    return (
      <View style={styles.card}>
        {/* Header: Araç ve Tarih */}
        <View style={styles.headerRow}>
          <Text style={styles.carText}>
            {car
              ? `${car.brand} ${car.model} (${car.year})`
              : "Bilinmeyen Araç"}
          </Text>
          <Text style={styles.dateText}>{displayDate}</Text>
        </View>

        {/* Müşteri Bilgisi */}
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color={Colors.light.text} />
          <Text style={styles.infoText}>
            {customer?.name || "Bilinmeyen Müşteri"}
          </Text>
        </View>

        {/* İş Başlığı ve Açıklaması */}
        <Text style={styles.titleText}>{item.title}</Text>

        {/* Müşteri Notu varsa göster */}
        {item.customerNote && (
          <Text style={styles.descText}>Not: {item.customerNote}</Text>
        )}

        {/* Alt Bilgiler: Ücret ve Yapılan İş */}
        {!!item.cost && (
          <View style={styles.footerRow}>
            <Ionicons name="cash" size={16} color={Colors.light.success} />
            <Text style={styles.amountText}>₺{item.cost}</Text>
          </View>
        )}

        {!!item.workDescription && (
          <View style={styles.workDetailsContainer}>
            <Text style={styles.workLabel}>Yapılan İşlem:</Text>
            <Text style={styles.workText}>{item.workDescription}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {historyJobs.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="time-outline"
            size={64}
            color={Colors.light.tabIconDefault}
          />
          <Text style={styles.emptyText}>Geçmiş tamir kaydı bulunamadı.</Text>
          <Text style={styles.emptySubText}>
            Tamamladığınız işler burada listelenecektir.
          </Text>
        </View>
      ) : (
        <FlatList
          data={historyJobs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // Gölge Efektleri
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // Sol Kenar Çizgisi
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.secondary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  carText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  dateText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
  },
  titleText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.primary,
    marginBottom: 4,
  },
  descText: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    backgroundColor: "#F0FDF4", // Light green bg for cost
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  amountText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.success,
  },
  workDetailsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  workLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    fontWeight: "600",
    marginBottom: 2,
  },
  workText: {
    fontSize: 13,
    color: Colors.light.text,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginTop: 8,
  },
});
