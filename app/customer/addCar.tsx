import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from "react-native";

// Car brands and models data
const carBrands = [
  {
    name: "Toyota",
    models: ["Corolla", "Camry", "RAV4", "Prius", "Yaris", "Auris", "C-HR", "Highlander"],
  },
  {
    name: "Volkswagen",
    models: ["Golf", "Passat", "Polo", "Jetta", "Tiguan", "Touran", "Arteon", "T-Roc"],
  },
  {
    name: "Ford",
    models: ["Focus", "Fiesta", "Mondeo", "Kuga", "EcoSport", "Mustang", "Transit"],
  },
  {
    name: "BMW",
    models: ["3 Serisi", "5 Serisi", "X3", "X5", "1 Serisi", "7 Serisi", "X1", "Z4"],
  },
  {
    name: "Mercedes-Benz",
    models: ["C-Class", "E-Class", "A-Class", "GLA", "GLC", "S-Class", "CLA"],
  },
  {
    name: "Audi",
    models: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "TT", "A1"],
  },
  {
    name: "Renault",
    models: ["Clio", "Megane", "Kadjar", "Captur", "Talisman", "Scenic", "Fluence"],
  },
  {
    name: "Peugeot",
    models: ["208", "308", "508", "2008", "3008", "5008", "Partner"],
  },
  {
    name: "Fiat",
    models: ["Egea", "500", "Panda", "Tipo", "500X", "Doblo", "Ducato"],
  },
  {
    name: "Hyundai",
    models: ["i20", "i30", "Elantra", "Tucson", "Santa Fe", "Kona", "Accent"],
  },
];

const fuelTypes = ["Benzin", "Dizel", "LPG", "Elektrik", "Hibrit"];
const transmissionTypes = ["Manuel", "Otomatik", "Yarı Otomatik"];
const colors = [
  "Beyaz", "Siyah", "Gri", "Gümüş", "Mavi", "Kırmızı", 
  "Yeşil", "Sarı", "Turuncu", "Mor", "Kahverengi", "Altın"
];

export default function AddCarScreen() {
  const [carData, setCarData] = useState({
    brand: "",
    model: "",
    year: "",
    plate: "",
    color: "",
    fuelType: "",
    transmission: "",
    mileage: "",
    engineSize: "",
    chassisNumber: "",
    notes: "",
  });

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const handleBack = () => {
    router.back();
  };

  const handleBrandSelect = (brand: string) => {
    const selectedBrand = carBrands.find(b => b.name === brand);
    setCarData({ ...carData, brand, model: "" });
    setAvailableModels(selectedBrand?.models || []);
    setShowBrandModal(false);
  };

  const handleModelSelect = (model: string) => {
    setCarData({ ...carData, model });
    setShowModelModal(false);
  };

  const handleColorSelect = (color: string) => {
    setCarData({ ...carData, color });
    setShowColorModal(false);
  };

  const validateForm = () => {
    const requiredFields = ['brand', 'model', 'year', 'plate'];
    const missingFields = requiredFields.filter(field => !carData[field as keyof typeof carData]);
    
    if (missingFields.length > 0) {
      Alert.alert("Hata", "Lütfen tüm zorunlu alanları doldurun.");
      return false;
    }

    const currentYear = new Date().getFullYear();
    const year = parseInt(carData.year);
    if (year < 1950 || year > currentYear + 1) {
      Alert.alert("Hata", "Geçerli bir yıl girin.");
      return false;
    }

    if (carData.mileage && parseInt(carData.mileage) < 0) {
      Alert.alert("Hata", "Kilometre değeri negatif olamaz.");
      return false;
    }

    return true;
  };

  const handleSaveCar = () => {
    if (!validateForm()) return;

    // In a real app, this would save to a database
    Alert.alert(
      "Başarılı",
      "Araç başarıyla eklendi!",
      [
        {
          text: "Tamam",
          onPress: () => router.back(),
        },
      ]
    );
  };

  const renderBrandItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleBrandSelect(item.name)}
    >
      <Text style={styles.modalItemText}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
    </TouchableOpacity>
  );

  const renderModelItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleModelSelect(item)}
    >
      <Text style={styles.modalItemText}>{item}</Text>
      <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
    </TouchableOpacity>
  );

  const renderColorItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => handleColorSelect(item)}
    >
      <Text style={styles.modalItemText}>{item}</Text>
      <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.lightBlue]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yeni Araç Ekle</Text>
          <TouchableOpacity style={styles.saveHeaderButton} onPress={handleSaveCar}>
            <Text style={styles.saveHeaderButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Marka *</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowBrandModal(true)}
            >
              <Text style={[styles.selectText, !carData.brand && styles.placeholderText]}>
                {carData.brand || "Marka seçin"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={Colors.light.tabIconDefault} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Model *</Text>
            <TouchableOpacity
              style={[styles.selectInput, !carData.brand && styles.disabledInput]}
              onPress={() => carData.brand && setShowModelModal(true)}
              disabled={!carData.brand}
            >
              <Text style={[styles.selectText, !carData.model && styles.placeholderText]}>
                {carData.model || "Önce marka seçin"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={Colors.light.tabIconDefault} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Yıl *</Text>
            <TextInput
              style={styles.input}
              value={carData.year}
              onChangeText={(text) => setCarData({ ...carData, year: text })}
              placeholder="Örn: 2020"
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Plaka *</Text>
            <TextInput
              style={styles.input}
              value={carData.plate}
              onChangeText={(text) => setCarData({ ...carData, plate: text.toUpperCase() })}
              placeholder="Örn: 34 ABC 123"
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* Vehicle Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Araç Detayları</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Renk</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowColorModal(true)}
            >
              <Text style={[styles.selectText, !carData.color && styles.placeholderText]}>
                {carData.color || "Renk seçin"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={Colors.light.tabIconDefault} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Yakıt Türü</Text>
            <View style={styles.buttonGroup}>
              {fuelTypes.map((fuel) => (
                <TouchableOpacity
                  key={fuel}
                  style={[
                    styles.optionButton,
                    carData.fuelType === fuel && styles.optionButtonActive,
                  ]}
                  onPress={() => setCarData({ ...carData, fuelType: fuel })}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      carData.fuelType === fuel && styles.optionButtonTextActive,
                    ]}
                  >
                    {fuel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Vites Türü</Text>
            <View style={styles.buttonGroup}>
              {transmissionTypes.map((transmission) => (
                <TouchableOpacity
                  key={transmission}
                  style={[
                    styles.optionButton,
                    carData.transmission === transmission && styles.optionButtonActive,
                  ]}
                  onPress={() => setCarData({ ...carData, transmission })}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      carData.transmission === transmission && styles.optionButtonTextActive,
                    ]}
                  >
                    {transmission}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kilometre</Text>
            <TextInput
              style={styles.input}
              value={carData.mileage}
              onChangeText={(text) => setCarData({ ...carData, mileage: text })}
              placeholder="Örn: 45000"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Motor Hacmi</Text>
            <TextInput
              style={styles.input}
              value={carData.engineSize}
              onChangeText={(text) => setCarData({ ...carData, engineSize: text })}
              placeholder="Örn: 1.6"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ek Bilgiler</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Şasi Numarası</Text>
            <TextInput
              style={styles.input}
              value={carData.chassisNumber}
              onChangeText={(text) => setCarData({ ...carData, chassisNumber: text.toUpperCase() })}
              placeholder="17 haneli şasi numarası"
              autoCapitalize="characters"
              maxLength={17}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notlar</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={carData.notes}
              onChangeText={(text) => setCarData({ ...carData, notes: text })}
              placeholder="Araç hakkında ek bilgiler..."
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveCar}>
          <Ionicons name="checkmark" size={24} color="white" />
          <Text style={styles.saveButtonText}>Aracı Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Brand Selection Modal */}
      <Modal
        visible={showBrandModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowBrandModal(false)}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Marka Seçin</Text>
            <View style={styles.modalSpacer} />
          </View>
          <FlatList
            data={carBrands}
            renderItem={renderBrandItem}
            keyExtractor={(item) => item.name}
            style={styles.modalList}
          />
        </View>
      </Modal>

      {/* Model Selection Modal */}
      <Modal
        visible={showModelModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModelModal(false)}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Model Seçin</Text>
            <View style={styles.modalSpacer} />
          </View>
          <FlatList
            data={availableModels}
            renderItem={renderModelItem}
            keyExtractor={(item) => item}
            style={styles.modalList}
          />
        </View>
      </Modal>

      {/* Color Selection Modal */}
      <Modal
        visible={showColorModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowColorModal(false)}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Renk Seçin</Text>
            <View style={styles.modalSpacer} />
          </View>
          <FlatList
            data={colors}
            renderItem={renderColorItem}
            keyExtractor={(item) => item}
            style={styles.modalList}
          />
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
  saveHeaderButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveHeaderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
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
    backgroundColor: "white",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    backgroundColor: "white",
  },
  disabledInput: {
    backgroundColor: Colors.light.background,
    opacity: 0.6,
  },
  selectText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  placeholderText: {
    color: Colors.light.tabIconDefault,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: "white",
  },
  optionButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  optionButtonText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
  },
  optionButtonTextActive: {
    color: "white",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
  modalSpacer: {
    width: 24,
  },
  modalList: {
    flex: 1,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: "white",
  },
  modalItemText: {
    fontSize: 16,
    color: Colors.light.text,
  },
});