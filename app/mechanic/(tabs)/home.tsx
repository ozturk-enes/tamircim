import Colors from "@/constants/Colors";
import { Job, mockCars, mockCustomers, mockJobs } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar"; // ✅ EKLENDİ
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
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
  const [activeTab, setActiveTab] = useState("Bekleyen");
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [price, setPrice] = useState("");
  const [workDetails, setWorkDetails] = useState("");
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectJobId, setRejectJobId] = useState<string | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const handleAcceptJob = (jobId: string) => {
    Alert.alert(
      "İşi Kabul Et",
      "Bu işi kabul etmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          onPress: () => {
            const updatedJobs = jobs.map((job) =>
              job.id === jobId
                ? { ...job, status: "accepted" as Job["status"] }
                : job
            );
            setJobs(updatedJobs);
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
    const updatedJobs = jobs.map((job) =>
      job.id === rejectJobId
        ? { ...job, status: "rejected" as Job["status"] }
        : job
    );
    setJobs(updatedJobs);
    const idx = mockJobs.findIndex((j) => j.id === rejectJobId);
    if (idx !== -1) {
      mockJobs[idx].status = "rejected";
    }
    setRejectModalVisible(false);
    setRejectJobId(null);
  };

  const handleCancelReject = () => {
    setRejectModalVisible(false);
    setRejectJobId(null);
  };

  const handleCompleteJob = (job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  };

  const handleFinalCompleteJob = () => {
    if (!price || !workDetails) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    if (!selectedJob) {
      Alert.alert("Hata", "Seçili iş bulunamadı.");
      return;
    }
    const completedAt = new Date().toISOString();
    const updatedJobs = jobs.map((job) =>
      job.id === selectedJob.id
        ? {
            ...job,
            status: "completed" as Job["status"],
            paymentAmount: parseFloat(price),
            workDetails: workDetails,
            completedAt,
          }
        : job
    );
    setJobs(updatedJobs);
    const idx = mockJobs.findIndex((j) => j.id === selectedJob.id);
    if (idx !== -1) {
      mockJobs[idx] = {
        ...mockJobs[idx],
        status: "completed",
        paymentAmount: parseFloat(price),
        workDetails: workDetails,
        completedAt,
      } as any;
    }
    setModalVisible(false);
    setPrice("");
    setWorkDetails("");
  };

  const getJobsByStatus = (status: string) => {
    switch (status) {
      case "Bekleyen":
        return jobs.filter((job) => job.status === "pending");
      case "Devam Eden":
        return jobs.filter(
          (job) => job.status === "in_progress" || job.status === "accepted"
        );
      case "Tamamlanan": {
        const dayMs = 24 * 60 * 60 * 1000;
        return jobs
          .filter(
            (job) =>
              job.status === "completed" &&
              job.completedAt &&
              Date.now() - new Date(job.completedAt).getTime() <= dayMs
          )
          .sort(
            (a, b) =>
              new Date(b.completedAt || 0).getTime() -
              new Date(a.completedAt || 0).getTime()
          );
      }
      default:
        return [];
    }
  };

  const renderJobCard = ({ item }: { item: Job }) => {
    const customer = mockCustomers.find((c) => c.id === item.customerId);
    const car = mockCars.find((c) => c.id === item.carId);

    const getStatusStyle = (status: string) => {
      switch (status) {
        case "pending":
          return styles.pendingCard;
        case "in_progress":
        case "accepted":
          return styles.inProgressCard;
        case "completed":
          return styles.completedCard;
        default:
          return {};
      }
    };

    return (
      <View style={[styles.card, getStatusStyle(item.status)]}>
        <View style={styles.cardHeader}>
          <Text style={styles.carModel}>
            {car?.brand} {car?.model}
          </Text>
          <Text style={styles.carYear}>{car?.year}</Text>
        </View>
        <Text style={styles.faultDescription}>{item.description}</Text>
        <View style={styles.customerInfo}>
          <Ionicons name="person-outline" size={16} color="#555" />
          <Text style={styles.customerName}>{customer?.name}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Ionicons name="call-outline" size={16} color="#555" />
          <Text style={styles.customerContact}>{customer?.phone}</Text>
        </View>
        {activeTab === "Bekleyen" && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => handleAcceptJob(item.id)}
            >
              <Text style={styles.buttonText}>Kabul Et</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleOpenReject(item.id)}
            >
              <Text style={styles.buttonText}>Reddet</Text>
            </TouchableOpacity>
          </View>
        )}
        {activeTab === "Devam Eden" && (
          <TouchableOpacity
            style={[styles.button, styles.completeButton]}
            onPress={() => handleCompleteJob(item)}
          >
            <Text style={styles.buttonText}>Tamamla</Text>
          </TouchableOpacity>
        )}
        {activeTab === "Tamamlanan" && item.paymentAmount && (
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentText}>
              Ödenen Tutar: ₺{item.paymentAmount}
            </Text>
            <Text style={styles.workDetails}>{item.workDetails}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ StatusBar alanını düzenle */}
      <StatusBar style="dark" backgroundColor="#f5f5f5" />

      <View style={styles.tabContainer}>
        {["Bekleyen", "Devam Eden", "Tamamlanan"].map((tab) => (
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

      <FlatList
        data={getJobsByStatus(activeTab)}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>İşi Tamamla</Text>
            <TextInput
              style={styles.input}
              placeholder="Ödenecek Tutar"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
            <TextInput
              style={styles.input}
              placeholder="Yapılan İşler"
              value={workDetails}
              onChangeText={setWorkDetails}
            />
            <TouchableOpacity
              style={[styles.button, styles.completeButton]}
              onPress={handleFinalCompleteJob}
            >
              <Text style={styles.buttonText}>Onayla</Text>
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

      <Modal
        animationType="fade"
        transparent
        visible={rejectModalVisible}
        onRequestClose={handleCancelReject}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Onay</Text>
            <Text
              style={{ fontSize: 16, textAlign: "center", marginBottom: 20 }}
            >
              Reddetmek istediğinize emin misiniz?
            </Text>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleConfirmReject}
              >
                <Text style={styles.buttonText}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={handleCancelReject}
              >
                <Text style={styles.buttonText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: Colors.light.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  activeTabText: { color: "white" },
  listContainer: { padding: 10 },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5,
  },
  pendingCard: { borderColor: "#FFC107" },
  inProgressCard: { borderColor: "#2196F3" },
  completedCard: { borderColor: "#4CAF50" },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  carModel: { fontSize: 18, fontWeight: "bold" },
  carYear: { fontSize: 16, color: "#666" },
  faultDescription: { fontSize: 16, marginBottom: 10 },
  customerInfo: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  customerName: { marginLeft: 10, fontSize: 16 },
  customerContact: { marginLeft: 10, fontSize: 16 },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  acceptButton: { backgroundColor: Colors.light.success },
  completeButton: { backgroundColor: "#2196F3" },
  rejectButton: { backgroundColor: Colors.light.error },
  primaryButton: { backgroundColor: Colors.light.primary },
  secondaryButton: { backgroundColor: "#9E9E9E" },
  actionRow: { flexDirection: "row", gap: 10 },
  buttonText: { color: "white", fontWeight: "bold" },
  paymentInfo: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  paymentText: { fontSize: 16, fontWeight: "bold", color: "#4CAF50" },
  workDetails: { fontSize: 14, color: "#555", marginTop: 5 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  cancelButton: { backgroundColor: "#f44336" },
});

export default MechanicDashboardScreen;
