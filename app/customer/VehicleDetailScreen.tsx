import Colors from "@/constants/Colors";
import { useDataStore } from "@/store/dataStore"; // Veri kaynağı
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
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

  // --- STORE INTEGRATION ---
  // Store'dan tüm verileri çekip ID'ye göre filtreliyoruz
  const car = useDataStore((state) => state.cars.find((c) => c.id === id));
  const mechanics = useDataStore((state) => state.mechanics);
  const history = useDataStore((state) =>
    state.jobs
      .filter((j) => j.carId === id)
      .sort(
        (a, b) =>
          new Date(b.completedAt || b.createdAt).getTime() -
          new Date(a.completedAt || a.createdAt).getTime()
      )
  );
  // Reminder store'da varsa çek, yoksa boş array (DataStore yapına göre)
  const allReminders = useDataStore((state) => state.reminders) || [];
  const carReminders = allReminders.filter((r) => r.carId === id);

  const [isReminderModalVisible, setReminderModalVisible] = useState(false);
  const [remTitle, setRemTitle] = useState("");
  const [remDate, setRemDate] = useState("");
  const [remMileage, setRemMileage] = useState("");

  // Araç bulunamazsa (örn: silinmişse) geri dön
  if (!car) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Araç bulunamadı.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ alignSelf: "center", marginTop: 20 }}
        >
          <Text style={{ color: Colors.light.primary }}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSaveReminder = () => {
    if (!remTitle) {
      Alert.alert("Hata", "Lütfen bir başlık girin.");
      return;
    }

    // Not: Store'a ekleme fonksiyonu (addReminder) varsa burada çağrılmalı.
    // Şimdilik sadece UI aksiyonu gösteriyoruz.
    Alert.alert(
      "Başarılı",
      "Hatırlatıcı eklendi (Store entegrasyonu bekleniyor)."
    );

    setRemTitle("");
    setRemDate("");
    setRemMileage("");
    setReminderModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.light.lightBlue, Colors.light.background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={Colors.light.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Araç Detayı</Text>
          <TouchableOpacity
            onPress={() => setReminderModalVisible(true)}
            style={styles.headerButton}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.light.primary}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Car Card */}
        <View style={styles.carCard}>
          <Image
            source={{
              uri:
                car.photoUrl ||
                car.image ||
                "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop",
            }}
            style={styles.carImage}
            resizeMode="cover"
          />
          <View style={styles.carInfo}>
            <Text style={styles.carTitle}>
              {car.brand} {car.model}
            </Text>
            <Text style={styles.carPlate}>{car.plate}</Text>

            <View style={styles.carDetailsRow}>
              <View style={styles.carDetailItem}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={Colors.light.tabIconDefault}
                />
                <Text style={styles.carDetailText}>{car.year}</Text>
              </View>
              <View style={styles.carDetailItem}>
                <Ionicons
                  name="water-outline"
                  size={16}
                  color={Colors.light.tabIconDefault}
                />
                <Text style={styles.carDetailText}>{car.fuelType}</Text>
              </View>
              <View style={styles.carDetailItem}>
                <Ionicons
                  name="color-palette-outline"
                  size={16}
                  color={Colors.light.tabIconDefault}
                />
                <Text style={styles.carDetailText}>{car.color}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Son İşlemler</Text>
            <Ionicons
              name="time-outline"
              size={20}
              color={Colors.light.primary}
            />
          </View>

          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Henüz işlem geçmişi yok.</Text>
            </View>
          ) : (
            history.map((job) => (
              <View key={job.id} style={styles.jobItem}>
                <View style={styles.jobIconContainer}>
                  <Ionicons
                    name="construct"
                    size={20}
                    color={Colors.light.primary}
                  />
                </View>
                <View style={styles.jobContent}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  {job.customerNote && (
                    <Text style={styles.jobDesc} numberOfLines={2}>
                      {job.customerNote}
                    </Text>
                  )}
                  <View style={styles.jobFooter}>
                    <Text style={styles.jobDate}>
                      {new Date(job.createdAt).toLocaleDateString("tr-TR")}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            job.status === "completed" ? "#DCFCE7" : "#FEF3C7",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              job.status === "completed"
                                ? "#166534"
                                : "#92400E",
                          },
                        ]}
                      >
                        {job.status === "completed" ? "Tamamlandı" : "İşlemde"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Reminders Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hatırlatıcılar</Text>
            <TouchableOpacity onPress={() => setReminderModalVisible(true)}>
              <Text style={styles.addLink}>+ Ekle</Text>
            </TouchableOpacity>
          </View>

          {carReminders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Hatırlatıcı bulunamadı.</Text>
            </View>
          ) : (
            carReminders.map((r) => (
              <View key={r.id} style={styles.reminderItem}>
                <Ionicons
                  name={r.isCompleted ? "checkmark-circle" : "alarm"}
                  size={24}
                  color={
                    r.isCompleted ? Colors.light.success : Colors.light.warning
                  }
                />
                <View style={styles.reminderContent}>
                  <Text style={styles.reminderTitle}>{r.title}</Text>
                  <Text style={styles.reminderDetail}>
                    {r.dueDate ? `Tarih: ${r.dueDate}` : `Km: ${r.dueMileage}`}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Reminder Modal */}
      <Modal visible={isReminderModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hatırlatıcı Ekle</Text>
              <TouchableOpacity onPress={() => setReminderModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Başlık</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: Muayene, Sigorta"
                value={remTitle}
                onChangeText={setRemTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tarih (İsteğe Bağlı)</Text>
              <TextInput
                style={styles.input}
                placeholder="GG.AA.YYYY"
                value={remDate}
                onChangeText={setRemDate}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kilometre (İsteğe Bağlı)</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: 60000"
                keyboardType="number-pad"
                value={remMileage}
                onChangeText={setRemMileage}
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveReminder}
            >
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  // Car Card
  carCard: {
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  carImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#F0F0F0",
  },
  carInfo: {
    padding: 20,
  },
  carTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "600",
    backgroundColor: "#F3F4F6",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  carDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
  },
  carDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  carDetailText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
  },
  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  addLink: {
    color: Colors.light.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    padding: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.light.tabIconDefault,
    fontSize: 14,
  },
  // Jobs
  jobItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  latestJobItem: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    backgroundColor: "#F0F9FF",
  },
  jobIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  jobContent: {
    flex: 1,
  },
  jobHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
  },
  latestBadge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  latestBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  mechanicName: {
    fontSize: 13,
    color: Colors.light.text,
    marginBottom: 6,
    fontWeight: "500",
  },
  jobDesc: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    marginBottom: 8,
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobDate: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  // Reminders
  reminderItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reminderContent: {
    flex: 1,
    marginLeft: 12,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  reminderDetail: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    marginTop: 2,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
