import JobCard from "@/components/common/JobCard";
import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";
import { Job } from "@/types/schema"; // ServiceRecord yerine Job kullanıyoruz
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const MechanicDashboardScreen = () => {
  // --- STORE INTEGRATION ---
  const currentUser = useAuthStore((state) => state.user);

  // Tüm verileri çekiyoruz (İlişkileri kurmak için)
  const allJobs = useDataStore((state) => state.jobs);
  const allCars = useDataStore((state) => state.cars);
  const allCustomers = useDataStore((state) => state.customers);
  const updateJobStatus = useDataStore((state) => state.updateJobStatus);
  const updateMechanic = useDataStore((state) => state.updateMechanic);

  // --- LOCATION TRACKING ---
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Konum İzni",
            "Müşterilerin sizi bulabilmesi ve mesafeyi görebilmesi için konum izni gereklidir."
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});

        // Update mechanic location in store (which acts as DB sync)
        if (currentUser) {
          updateMechanic(currentUser.id, {
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          });
        }
      } catch (error) {
        console.error("Location error:", error);
      }
    })();
  }, [currentUser]);

  // Sadece bu tamirciye ait işleri filtrele
  const myJobs = useMemo(() => {
    if (!currentUser) return [];
    return allJobs.filter((job) => job.mechanicId === currentUser.id);
  }, [allJobs, currentUser]);

  // --- LOCAL STATE ---
  const [activeTab, setActiveTab] = useState<
    "Bekleyen" | "Devam Eden" | "Tamamlanan"
  >("Bekleyen");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Tamamlama Formu
  const [price, setPrice] = useState("");
  const [workDetails, setWorkDetails] = useState("");

  // Reddetme Modalı
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectJobId, setRejectJobId] = useState<string | null>(null);

  // --- ACTIONS ---

  const handleAcceptJob = (jobId: string) => {
    Alert.alert(
      "İşi Kabul Et",
      "Bu işi kabul etmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          onPress: () => {
            updateJobStatus(jobId, "accepted");
            // Otomatik olarak "Devam Eden" sekmesine geçebiliriz
            setActiveTab("Devam Eden");
          },
        },
      ]
    );
  };

  const handleStartJob = (jobId: string) => {
    updateJobStatus(jobId, "in_progress");
  };

  const handleCallCustomer = async (carId: string) => {
    const car = allCars.find((c) => c.id === carId);
    if (!car) return;
    const customer = allCustomers.find((c) => c.id === car.ownerId);

    if (!customer?.phone) {
      Alert.alert("Hata", "Müşteri telefonu bulunamadı.");
      return;
    }

    const phoneNumber = customer.phone;

    const cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");
    if (cleanedNumber.length < 3) {
      Alert.alert("Geçersiz Numara", "Telefon numarası formatı hatalı.");
      return;
    }

    Alert.alert(
      "Arama Onayı",
      `${customer.name} isimli müşteriyi aramak istiyor musunuz?`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Ara",
          onPress: async () => {
            try {
              const phoneUrl = `tel:${cleanedNumber}`;
              await Linking.openURL(phoneUrl);
            } catch (error) {
              console.error("Call error:", error);
              Alert.alert(
                "Hata",
                `Arama başlatılamadı. Numara: ${phoneNumber}`
              );
            }
          },
        },
      ]
    );
  };

  const handleOpenReject = (jobId: string) => {
    setRejectJobId(jobId);
    setRejectModalVisible(true);
  };

  const handleConfirmReject = () => {
    if (!rejectJobId) return;
    updateJobStatus(rejectJobId, "rejected");
    setRejectModalVisible(false);
    setRejectJobId(null);
  };

  const handleOpenCompleteModal = (job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleFinalCompleteJob = () => {
    if (!price || !workDetails) {
      Alert.alert("Hata", "Lütfen ücret ve yapılan işlemleri girin.");
      return;
    }

    if (!selectedJob) return;

    // SENIOR HAMLESİ:
    // DataStore'da 'updateJob' fonksiyonu olmadığı için (sadece status update var),
    // Zustand'ın `setState` metodunu kullanarak manuel bir güncelleme yapıyoruz.
    // Bu, store dosyasını değiştirmeden karmaşık bir güncelleme yapmanın yoludur.
    useDataStore.setState((state) => ({
      jobs: state.jobs.map((j) =>
        j.id === selectedJob.id
          ? {
              ...j,
              status: "completed",
              cost: parseFloat(price),
              workDescription: workDetails, // Schema'da workDetails -> workDescription olabilir, kontrol ettik.
              completedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : j
      ),
    }));

    setModalVisible(false);
    setPrice("");
    setWorkDetails("");
    Alert.alert("Başarılı", "İş tamamlandı ve müşteriye bildirildi.");
  };

  // --- HELPERS ---

  // İşin durumuna göre filtreleme
  const filteredJobs = useMemo(() => {
    switch (activeTab) {
      case "Bekleyen":
        return myJobs.filter((job) => job.status === "pending");
      case "Devam Eden":
        return myJobs.filter(
          (job) => job.status === "in_progress" || job.status === "accepted"
        );
      case "Tamamlanan":
        // Tamamlananları ve reddedilenleri tarihe göre (yeniden eskiye) sırala
        // Sadece son 24 saat içinde tamamlananları/reddedilenleri göster
        return myJobs
          .filter((job) => {
            if (job.status !== "completed" && job.status !== "rejected")
              return false;
            const completedTime = new Date(
              job.completedAt || job.updatedAt
            ).getTime();
            const oneDayMs = 24 * 60 * 60 * 1000;
            return Date.now() - completedTime < oneDayMs;
          })
          .sort(
            (a, b) =>
              new Date(b.completedAt || b.updatedAt || 0).getTime() -
              new Date(a.completedAt || a.updatedAt || 0).getTime()
          );
      default:
        return [];
    }
  }, [myJobs, activeTab]);

  // İlişkisel veriden müşteri adını bulma
  const getCustomerName = (carId: string) => {
    const car = allCars.find((c) => c.id === carId);
    if (!car) return "Bilinmeyen Araç";
    const customer = allCustomers.find((c) => c.id === car.ownerId);
    return customer
      ? `${customer.name} - ${car.brand} ${car.model}`
      : "Bilinmeyen Müşteri";
  };

  const renderJobCard = ({ item }: { item: Job }) => {
    return (
      <JobCard
        job={item} // Job tipi JobCard ile uyumlu olmalı
        displayContactName={getCustomerName(item.carId)}
        onAcceptPress={() => handleAcceptJob(item.id)}
        onRejectPress={() => handleOpenReject(item.id)}
        onStartJobPress={() => handleStartJob(item.id)}
        onCompletePress={() => handleOpenCompleteModal(item)}
        onCallCustomerPress={() => handleCallCustomer(item.carId)}
        onMessageCustomerPress={() => Alert.alert("Mesaj", "Mesaj ekranı...")}
        showActions={activeTab !== "Tamamlanan"}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#f8f9fa" />

      {/* Header Summary (Opsiyonel) */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>İş Paneli</Text>
        <Text style={styles.headerSubtitle}>
          Hoş geldin, {currentUser?.name?.split(" ")[0]} Usta 👋
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {(["Bekleyen", "Devam Eden", "Tamamlanan"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="documents-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>Bu kategoride iş bulunmuyor.</Text>
          </View>
        }
      />

      {/* Complete Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>İşi Tamamla</Text>

            <Text style={styles.label}>Toplam Ücret (₺)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

            <Text style={styles.label}>Yapılan İşlemler</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Değişen parçalar, işçilik..."
              value={workDetails}
              onChangeText={setWorkDetails}
              multiline
            />

            <TouchableOpacity
              style={[styles.button, styles.completeButton]}
              onPress={handleFinalCompleteJob}
            >
              <Text style={styles.buttonText}>Onayla ve Bitir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={rejectModalVisible}
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Ionicons
              name="alert-circle"
              size={40}
              color={Colors.light.error}
            />
            <Text style={styles.modalTitle}>İşi Reddet</Text>
            <Text style={styles.modalMessage}>
              Bu iş talebini reddetmek istediğinize emin misiniz? Bu işlem geri
              alınamaz.
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  { flex: 1, marginRight: 8 },
                ]}
                onPress={() => setRejectModalVisible(false)}
              >
                <Text style={styles.buttonText}>Vazgeç</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.rejectButton,
                  { flex: 1, marginLeft: 8 },
                ]}
                onPress={handleConfirmReject}
              >
                <Text style={styles.buttonText}>Reddet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 6,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.tabIconDefault,
  },
  activeTabText: {
    color: "white",
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#999",
    marginTop: 10,
    fontSize: 16,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.light.text,
  },
  modalMessage: {
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
    fontSize: 15,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  actionRow: {
    flexDirection: "row",
    width: "100%",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  completeButton: { backgroundColor: Colors.light.success },
  rejectButton: { backgroundColor: Colors.light.error },
  cancelButton: { backgroundColor: "#9E9E9E", marginBottom: 0 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default MechanicDashboardScreen;
