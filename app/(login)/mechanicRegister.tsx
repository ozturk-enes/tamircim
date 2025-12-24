import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";
import { Mechanic, SERVICE_CATEGORIES } from "@/types/schema";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function MechanicRegisterScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [otherSpecialtyText, setOtherSpecialtyText] = useState("");
  const [showSpecialtiesModal, setShowSpecialtiesModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSpecialty = (category: string) => {
    if (selectedSpecialties.includes(category)) {
      setSelectedSpecialties((prev) => prev.filter((s) => s !== category));
    } else {
      if (selectedSpecialties.length >= 3) {
        Alert.alert("Uyarı", "En fazla 3 uzmanlık alanı seçebilirsiniz.");
        return;
      }
      setSelectedSpecialties((prev) => [...prev, category]);
    }
  };

  const handleOtherToggle = () => {
    if (isOtherSelected) {
      setIsOtherSelected(false);
      setOtherSpecialtyText("");
    } else {
      if (selectedSpecialties.length >= 3) {
        Alert.alert("Uyarı", "En fazla 3 uzmanlık alanı seçebilirsiniz.");
        return;
      }
      setIsOtherSelected(true);
    }
  };

  const handleRegister = async () => {
    const { name, email, phone, address, password, confirmPassword } = formData;

    // 1. Validasyonlar
    if (!name || !email || !phone || !address || !password || !confirmPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır.");
      return;
    }

    // Uzmanlık alanı kontrolü
    const finalSpecialties = [...selectedSpecialties];
    if (isOtherSelected && otherSpecialtyText.trim()) {
      finalSpecialties.push(otherSpecialtyText.trim());
    }

    if (finalSpecialties.length === 0) {
      Alert.alert("Hata", "Lütfen en az bir uzmanlık alanı seçin.");
      return;
    }

    setLoading(true);

    try {
      // 2. E-posta Kontrolü
      const existingMechanic = useDataStore
        .getState()
        .mechanics.find(
          (m) => m.email.trim().toLowerCase() === email.trim().toLowerCase()
        );

      if (existingMechanic) {
        setLoading(false);
        Alert.alert("Hata", "Bu e-posta adresi zaten kullanımda.");
        return;
      }

      // 3. Adres Geocoding (Koordinat Bulma)
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        Alert.alert(
          "İzin Gerekli",
          "Adresinizin konumunu bulmak için konum iznine ihtiyacımız var."
        );
        return;
      }

      let coords = { latitude: 41.0082, longitude: 28.9784 }; // Fallback: İstanbul
      try {
        const geocodedLocation = await Location.geocodeAsync(address);
        if (geocodedLocation.length > 0) {
          coords = {
            latitude: geocodedLocation[0].latitude,
            longitude: geocodedLocation[0].longitude,
          };
        } else {
          // Adres bulunamadıysa uyarı ver ama kaydı durdurma (veya durdurabilirsin)
          Alert.alert(
            "Adres Bulunamadı",
            "Girdiğiniz adres haritada tam olarak bulunamadı. Varsayılan konum (İstanbul) atandı. Profilinizden güncelleyebilirsiniz."
          );
        }
      } catch (geoError) {
        console.error("Geocoding error:", geoError);
        // Hata durumunda fallback kullanılır
      }

      // 4. Veri Dönüşümü ve Hazırlama
      const newMechanic: Mechanic = {
        id: Date.now().toString(),
        role: "mechanic",
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        password: password,
        createdAt: new Date().toISOString(),
        location: coords,
        specialties: finalSpecialties,
        isOnline: true,
        rating: 5.0,
        reviewCount: 0,
        workingHours: "09:00 - 18:00",
        priceRange: "₺₺",
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&background=random`,
      };

      // 5. Veritabanına Ekle
      useDataStore.getState().addMechanic(newMechanic);

      setLoading(false);
      Alert.alert(
        "Başarılı",
        "Hesabınız başarıyla oluşturuldu! Lütfen giriş yapınız.",
        [
          {
            text: "Giriş Yap",
            onPress: () => router.replace("/(login)/mechanicLogin"),
          },
        ]
      );
    } catch (error) {
      console.error("Register error:", error);
      setLoading(false);
      Alert.alert("Hata", "Kayıt işlemi sırasında bir sorun oluştu.");
    }
  };

  const handleLoginRedirect = () => {
    router.back();
  };

  return (
    <LinearGradient
      colors={[Colors.light.lightOrange, Colors.light.background]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="construct"
                  size={60}
                  color={Colors.light.secondary}
                />
              </View>
              <Text style={styles.title}>Tamirci Kayıt</Text>
              <Text style={styles.subtitle}>Profesyonel hesap oluşturun</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person"
                  size={20}
                  color={Colors.light.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Ad Soyad / Firma Adı"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail"
                  size={20}
                  color={Colors.light.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-posta"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="call"
                  size={20}
                  color={Colors.light.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Telefon Numarası"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                  keyboardType="phone-pad"
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
              </View>

              {/* Uzmanlık Alanı Seçimi */}
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowSpecialtiesModal(true)}
              >
                <Ionicons
                  name="build"
                  size={20}
                  color={Colors.light.secondary}
                  style={styles.inputIcon}
                />
                <Text
                  style={[
                    styles.input,
                    {
                      paddingVertical: 16,
                      color:
                        selectedSpecialties.length > 0 || isOtherSelected
                          ? Colors.light.text
                          : Colors.light.tabIconDefault,
                    },
                  ]}
                >
                  {selectedSpecialties.length > 0 || isOtherSelected
                    ? `${selectedSpecialties.join(", ")}${
                        isOtherSelected
                          ? (selectedSpecialties.length > 0 ? ", " : "") +
                            (otherSpecialtyText || "Diğer")
                          : ""
                      }`
                    : "Uzmanlık Alanı Seçin"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={Colors.light.tabIconDefault}
                />
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="location"
                  size={20}
                  color={Colors.light.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="İş Yeri Adresi (Harita için detaylı girin)"
                  value={formData.address}
                  onChangeText={(value) => handleInputChange("address", value)}
                  multiline
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={Colors.light.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={Colors.light.tabIconDefault}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={Colors.light.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre Tekrar"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor={Colors.light.tabIconDefault}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color={Colors.light.tabIconDefault}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  loading && styles.registerButtonDisabled,
                ]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? "Hesap Oluşturuluyor..." : "Kayıt Ol"}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>veya</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLoginRedirect}
              >
                <Text style={styles.loginButtonText}>
                  Zaten hesabınız var mı? Giriş Yap
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Uzmanlık Seçim Modalı */}
      <Modal
        visible={showSpecialtiesModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSpecialtiesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Uzmanlık Alanları</Text>
              <Text style={styles.modalSubtitle}>
                En fazla 3 adet seçebilirsiniz
              </Text>
            </View>

            <ScrollView style={styles.specialtiesList}>
              <View style={styles.specialtiesGrid}>
                {SERVICE_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.specialtyItem,
                      selectedSpecialties.includes(category) &&
                        styles.specialtyItemSelected,
                    ]}
                    onPress={() => toggleSpecialty(category)}
                  >
                    <Text
                      style={[
                        styles.specialtyText,
                        selectedSpecialties.includes(category) &&
                          styles.specialtyTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                    {selectedSpecialties.includes(category) && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </TouchableOpacity>
                ))}

                {/* Diğer Seçeneği */}
                <TouchableOpacity
                  style={[
                    styles.specialtyItem,
                    isOtherSelected && styles.specialtyItemSelected,
                  ]}
                  onPress={handleOtherToggle}
                >
                  <Text
                    style={[
                      styles.specialtyText,
                      isOtherSelected && styles.specialtyTextSelected,
                    ]}
                  >
                    Diğer
                  </Text>
                  {isOtherSelected && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </TouchableOpacity>
              </View>

              {isOtherSelected && (
                <View style={styles.otherInputContainer}>
                  <TextInput
                    style={styles.otherInput}
                    placeholder="Diğer uzmanlık alanını yazınız"
                    value={otherSpecialtyText}
                    onChangeText={setOtherSpecialtyText}
                    placeholderTextColor="#999"
                  />
                </View>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSpecialtiesModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 30 },
  iconContainer: { marginBottom: 16 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.secondary,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: Colors.light.text, opacity: 0.7 },
  form: { width: "100%" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  eyeIcon: { padding: 4 },
  registerButton: {
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  registerButtonDisabled: { opacity: 0.7 },
  registerButtonText: { color: "white", fontSize: 18, fontWeight: "600" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.light.border },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.light.tabIconDefault,
    fontSize: 14,
  },
  loginButton: { alignItems: "center", paddingVertical: 12 },
  loginButtonText: {
    color: Colors.light.secondary,
    fontSize: 16,
    fontWeight: "500",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    marginBottom: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  specialtiesList: {
    marginBottom: 20,
  },
  specialtiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  specialtyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  specialtyItemSelected: {
    backgroundColor: Colors.light.secondary,
  },
  specialtyText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: "500",
  },
  specialtyTextSelected: {
    color: "white",
  },
  otherInputContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  otherInput: {
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.light.text,
  },
  modalCloseButton: {
    backgroundColor: Colors.light.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
