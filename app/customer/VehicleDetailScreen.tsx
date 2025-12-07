import Colors from "@/constants/Colors";
import { mockCars, mockJobs } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const car = mockCars.find((c) => c.id === id);
  const recentJobs = mockJobs.filter((j) => j.carId === id);

  const [isReminderModalVisible, setReminderModalVisible] = useState(false);
  const [reminders, setReminders] = useState<
    Array<{ id: string; title: string; dueDate?: string; dueMileage?: number }>
  >([]);
  const [remTitle, setRemTitle] = useState("");
  const [remDate, setRemDate] = useState("");
  const [remMileage, setRemMileage] = useState("");

  const canSaveReminder = useMemo(
    () =>
      remTitle.trim().length > 0 &&
      (remDate.trim().length > 0 || remMileage.trim().length > 0),
    [remTitle, remDate, remMileage]
  );

  const saveReminder = () => {
    if (!canSaveReminder) return;
    setReminders((prev) => [
      {
        id: String(Date.now()),
        title: remTitle.trim(),
        dueDate: remDate.trim() || undefined,
        dueMileage: remMileage.trim() ? Number(remMileage.trim()) : undefined,
      },
      ...prev,
    ]);
    setRemTitle("");
    setRemDate("");
    setRemMileage("");
    setReminderModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Araç Detayı</Text>
        <TouchableOpacity
          onPress={() => setReminderModalVisible(true)}
          style={styles.headerButton}
        >
          <Ionicons name="alarm" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {car && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {car.brand} {car.model}
            </Text>
            <View style={styles.row}>
              <Text style={styles.label}>Yıl:</Text>
              <Text style={styles.value}>{String(car.year)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Plaka:</Text>
              <Text style={styles.value}>{car.plate}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Renk:</Text>
              <Text style={styles.value}>{car.color}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Son İşlemler</Text>
          </View>
          {recentJobs.length === 0 ? (
            <Text style={styles.emptyText}>Herhangi bir işlem bulunamadı.</Text>
          ) : (
            recentJobs.map((job) => (
              <View key={job.id} style={styles.jobItem}>
                <View style={styles.jobRow}>
                  <Ionicons
                    name="build"
                    size={16}
                    color={Colors.light.primary}
                  />
                  <Text style={styles.jobTitle}>{job.title}</Text>
                </View>
                <Text style={styles.jobDesc}>{job.description}</Text>
                <View style={styles.jobMeta}>
                  <Text style={styles.jobMetaText}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.jobMetaText}>{job.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hatırlatıcılar</Text>
          </View>
          {reminders.length === 0 ? (
            <Text style={styles.emptyText}>
              Henüz hatırlatıcı yok. Sağ üstten ekleyin.
            </Text>
          ) : (
            reminders.map((r) => (
              <View key={r.id} style={styles.reminderItem}>
                <View style={styles.jobRow}>
                  <Ionicons name="time" size={16} color={"#FF9500"} />
                  <Text style={styles.jobTitle}>{r.title}</Text>
                </View>
                {!!r.dueDate && (
                  <Text style={styles.jobDesc}>Tarih: {r.dueDate}</Text>
                )}
                {!!r.dueMileage && (
                  <Text style={styles.jobDesc}>Km: {r.dueMileage}</Text>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal visible={isReminderModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hatırlatıcı Ekle</Text>
              <TouchableOpacity onPress={() => setReminderModalVisible(false)}>
                <Ionicons name="close" size={22} color={"#999"} />
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Başlık</Text>
              <TextInput
                value={remTitle}
                onChangeText={setRemTitle}
                placeholder="Örn: Vize Tarihi"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tarih (YYYY-MM-DD)</Text>
              <TextInput
                value={remDate}
                onChangeText={setRemDate}
                placeholder="2025-12-30"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kilometre</Text>
              <TextInput
                value={remMileage}
                onChangeText={setRemMileage}
                placeholder="50000"
                style={styles.input}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={[
                styles.saveButton,
                { opacity: canSaveReminder ? 1 : 0.6 },
              ]}
              disabled={!canSaveReminder}
              onPress={saveReminder}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  headerButton: { padding: 6 },
  headerTitle: { color: "#fff", fontWeight: "700", fontSize: 16 },
  content: { padding: 16 },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
    marginBottom: 6,
  },
  row: { flexDirection: "row", alignItems: "center", marginVertical: 2 },
  label: { width: 60, fontSize: 12, color: Colors.light.tabIconDefault },
  value: { fontSize: 14, color: Colors.light.text },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: Colors.light.text },
  emptyText: { fontSize: 12, color: Colors.light.tabIconDefault },
  jobItem: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 8,
    marginTop: 8,
  },
  jobRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  jobTitle: { fontSize: 13, fontWeight: "600", color: Colors.light.text },
  jobDesc: { fontSize: 12, color: Colors.light.tabIconDefault, marginTop: 2 },
  jobMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  jobMetaText: { fontSize: 11, color: Colors.light.tabIconDefault },
  reminderItem: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 8,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: Colors.light.text },
  inputGroup: { marginVertical: 6 },
  inputLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.light.text,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
    gap: 8,
  },
  saveButtonText: { color: "white", fontWeight: "700", fontSize: 15 },
});
