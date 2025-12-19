import Colors from "@/constants/Colors";
import { cars, customers, serviceRecords } from "@/constants/mockData";
import { ServiceRecord } from "@/types/schema";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
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
import JobCard from "@/components/common/JobCard";

const { width } = Dimensions.get("window");

const MechanicDashboardScreen = () => {
  const [activeTab, setActiveTab] = useState("Bekleyen");
  const [jobs, setJobs] = useState<ServiceRecord[]>(serviceRecords);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ServiceRecord | null>(null);
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
                ? { ...job, status: "accepted" as ServiceRecord["status"] }
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
        ? { ...job, status: "rejected" as ServiceRecord["status"] }
        : job
    );
    setJobs(updatedJobs);
    // In a real app, we would update the backend here
    setRejectModalVisible(false);
    setRejectJobId(null);
  };

  const handleCancelReject = () => {
    setRejectModalVisible(false);
    setRejectJobId(null);
  };

  const handleCompleteJob = (job: ServiceRecord) => {
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
            status: "completed" as ServiceRecord["status"],
            cost: parseFloat(price),
            workDetails: workDetails,
            completedAt,
          }
        : job
    );
    setJobs(updatedJobs);
    
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
              job.status === "completed" 
              // Note: Only showing recently completed jobs logic can remain or be removed.
              // && job.completedAt && Date.now() - new Date(job.completedAt).getTime() <= dayMs
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

  const getCustomerName = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    if (!car) return "Bilinmeyen Müşteri";
    const customer = customers.find(c => c.id === car.ownerId);
    return customer ? customer.name : "Bilinmeyen Müşteri";
  };

  const renderJobCard = ({ item }: { item: ServiceRecord }) => {
    return (
      <JobCard 
        job={item}
        displayContactName={getCustomerName(item.carId)}
        onAcceptPress={() => handleAcceptJob(item.id)}
        onRejectPress={() => handleOpenReject(item.id)}
        onCompletePress={() => handleCompleteJob(item)}
        // For 'accepted' state, we might want to show call/message options
        onCallCustomerPress={() => Alert.alert("Arama", "Müşteri aranıyor...")}
        onMessageCustomerPress={() => Alert.alert("Mesaj", "Mesaj ekranı açılıyor...")}
        showActions={activeTab !== "Tamamlanan"}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  completeButton: { backgroundColor: "#2196F3" },
  primaryButton: { backgroundColor: Colors.light.primary },
  secondaryButton: { backgroundColor: "#9E9E9E" },
  actionRow: { flexDirection: "row", gap: 10 },
  buttonText: { color: "white", fontWeight: "bold" },
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
