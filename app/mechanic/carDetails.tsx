import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { mockData } from "@/constants/mockData";

interface ServiceRecord {
  id: string;
  date: string;
  service: string;
  cost: string;
  notes: string;
}

export default function MechanicCarDetailsScreen() {
  const [selectedCar, setSelectedCar] = useState(mockData.cars[0]);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [newService, setNewService] = useState({
    service: "",
    cost: "",
    notes: "",
  });
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([
    {
      id: "1",
      date: "2024-01-15",
      service: "Yağ Değişimi",
      cost: "₺350",
      notes: "Motor yağı ve filtre değiştirildi. Araç durumu iyi.",
    },
    {
      id: "2",
      date: "2024-01-10",
      service: "Fren Balata Değişimi",
      cost: "₺800",
      notes: "Ön fren balataları değiştirildi. Test sürüşü yapıldı.",
    },
  ]);

  const handleAddService = () => {
    if (!newService.service || !newService.cost) {
      Alert.alert("Hata", "Lütfen servis türü ve ücret bilgilerini giriniz.");
      return;
    }

    const service: ServiceRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      service: newService.service,
      cost: newService.cost,
      notes: newService.notes,
    };

    setServiceHistory([service, ...serviceHistory]);
    setNewService({ service: "", cost: "", notes: "" });
    setServiceModalVisible(false);
    Alert.alert("Başarılı", "Servis kaydı eklendi.");
  };

  const carSpecs = [
    { label: "Marka", value: selectedCar.brand },
    { label: "Model", value: selectedCar.model },
    { label: "Yıl", value: selectedCar.year },
    { label: "Renk", value: selectedCar.color },
    { label: "Plaka", value: selectedCar.plate },
    { label: "Motor Hacmi", value: selectedCar.engineSize || "1.6L" },
    { label: "Yakıt Türü", value: selectedCar.fuelType || "Benzin" },
    { label: "Kilometre", value: selectedCar.mileage || "85,000 km" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.light.secondary, Colors.light.lightOrange]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Araç Detayları</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setServiceModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Car Info Card */}
        <View style={styles.carCard}>
          <View style={styles.carHeader}>
            <View style={styles.carIcon}>
              <Ionicons name="car" size={32} color={Colors.light.secondary} />
            </View>
            <View style={styles.carInfo}>
              <Text style={styles.carTitle}>
                {selectedCar.brand} {selectedCar.model}
              </Text>
              <Text style={styles.carSubtitle}>
                {selectedCar.year} • {selectedCar.color}
              </Text>
              <Text style={styles.carPlate}>{selectedCar.plate}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Aktif</Text>
            </View>
          </View>
        </View>

        {/* Car Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Araç Özellikleri</Text>
          <View style={styles.specsContainer}>
            {carSpecs.map((spec, index) => (
              <View key={index} style={styles.specRow}>
                <Text style={styles.specLabel}>{spec.label}:</Text>
                <Text style={styles.specValue}>{spec.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                Alert.alert(
                  "Fotoğraf",
                  "Araç fotoğrafı çekme özelliği yakında eklenecek!"
                )
              }
            >
              <Ionicons
                name="camera"
                size={24}
                color={Colors.light.secondary}
              />
              <Text style={styles.actionText}>Fotoğraf Çek</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                Alert.alert(
                  "Rapor",
                  "Durum raporu oluşturma özelliği yakında eklenecek!"
                )
              }
            >
              <Ionicons
                name="document-text"
                size={24}
                color={Colors.light.secondary}
              />
              <Text style={styles.actionText}>Rapor Oluştur</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() =>
                Alert.alert(
                  "İletişim",
                  "Müşteri ile iletişim özelliği yakında eklenecek!"
                )
              }
            >
              <Ionicons name="call" size={24} color={Colors.light.secondary} />
              <Text style={styles.actionText}>Müşteriyi Ara</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Service History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Servis Geçmişi</Text>
            <TouchableOpacity
              style={styles.addServiceButton}
              onPress={() => setServiceModalVisible(true)}
            >
              <Ionicons
                name="add-circle"
                size={24}
                color={Colors.light.secondary}
              />
            </TouchableOpacity>
          </View>

          {serviceHistory.length > 0 ? (
            serviceHistory.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceTitle}>{service.service}</Text>
                  <Text style={styles.serviceCost}>{service.cost}</Text>
                </View>
                <Text style={styles.serviceDate}>{service.date}</Text>
                {service.notes ? (
                  <Text style={styles.serviceNotes}>{service.notes}</Text>
                ) : null}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="construct"
                size={48}
                color={Colors.light.tabIconDefault}
              />
              <Text style={styles.emptyText}>
                Henüz servis kaydı bulunmuyor
              </Text>
              <Text style={styles.emptySubtext}>
                İlk servis kaydını eklemek için + butonuna tıklayın
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Service Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={serviceModalVisible}
        onRequestClose={() => setServiceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Servis Kaydı</Text>
              <TouchableOpacity onPress={() => setServiceModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Servis Türü *</Text>
                <TextInput
                  style={styles.input}
                  value={newService.service}
                  onChangeText={(text) =>
                    setNewService({ ...newService, service: text })
                  }
                  placeholder="Örn: Yağ değişimi, Fren tamiri"
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ücret *</Text>
                <TextInput
                  style={styles.input}
                  value={newService.cost}
                  onChangeText={(text) =>
                    setNewService({ ...newService, cost: text })
                  }
                  placeholder="Örn: ₺350"
                  placeholderTextColor={Colors.light.tabIconDefault}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Notlar</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newService.notes}
                  onChangeText={(text) =>
                    setNewService({ ...newService, notes: text })
                  }
                  placeholder="Yapılan işlemler ve notlar..."
                  placeholderTextColor={Colors.light.tabIconDefault}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setServiceModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddService}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  carCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  carIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.lightOrange,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  carInfo: {
    flex: 1,
  },
  carTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  carSubtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.secondary,
  },
  statusBadge: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  addServiceButton: {
    padding: 4,
  },
  specsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  specLabel: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontWeight: "500",
  },
  specValue: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
  serviceCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
  },
  serviceCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.secondary,
  },
  serviceDate: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 8,
  },
  serviceNotes: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.background,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.light.secondary,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
