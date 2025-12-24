import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";
import { Mechanic } from "@/types/schema";
import {
  isStrongPassword,
  isValidPhone,
  sanitizeText,
} from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function MechanicProfileScreen() {
  // --- STORE INTEGRATION ---
  const mechanic = useAuthStore((state) => state.user) as Mechanic;
  const logout = useAuthStore((state) => state.logout);
  const updateUserAuth = useAuthStore((state) => state.updateUser);
  const updateMechanicData = useDataStore((state) => state.updateMechanic);

  const [editMode, setEditMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  // Form States
  const [formName, setFormName] = useState(mechanic?.name || "");
  const [formEmail, setFormEmail] = useState(mechanic?.email || "");
  const [formPhone, setFormPhone] = useState(mechanic?.phone || "");
  const [formAddress, setFormAddress] = useState(mechanic?.address || "");
  const [formSpecialties, setFormSpecialties] = useState(
    mechanic?.specialties.join(", ") || ""
  );
  const [formPriceRange, setFormPriceRange] = useState(
    mechanic?.priceRange || ""
  );
  const [formWorkingHours, setFormWorkingHours] = useState(
    mechanic?.workingHours || ""
  );

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update form when user data changes
  useEffect(() => {
    if (mechanic) {
      setFormName(mechanic.name);
      setFormEmail(mechanic.email);
      setFormPhone(mechanic.phone);
      setFormAddress(mechanic.address);
      setFormSpecialties(mechanic.specialties.join(", "));
      setFormPriceRange(mechanic.priceRange || "");
      setFormWorkingHours(mechanic.workingHours);
    }
  }, [mechanic]);

  const stars = useMemo(() => {
    const full = Math.floor(mechanic?.rating || 0);
    return Array.from({ length: 5 }, (_, i) => i < full);
  }, [mechanic?.rating]);

  const saveProfile = () => {
    if (!mechanic) return;
    const name = sanitizeText(formName);
    const phone = sanitizeText(formPhone);
    const address = sanitizeText(formAddress);

    if (!name || !isValidPhone(phone) || !address) {
      Alert.alert("Hata", "Lütfen geçerli isim, telefon ve adres girin.");
      return;
    }

    const updatedSpecialties = formSpecialties
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updates: Partial<Mechanic> = {
      name,
      phone,
      address,
      specialties: updatedSpecialties as any[], // Tip güvenliği için cast edilebilir veya validasyon eklenebilir
      priceRange: formPriceRange as any,
      workingHours: formWorkingHours,
    };

    // Store Update
    updateMechanicData(mechanic.id, updates);
    updateUserAuth(updates);

    setEditMode(false);
    Alert.alert("Başarılı", "Profiliniz güncellendi.");
  };

  const changePassword = () => {
    if (!mechanic) return;
    // Mock Password Logic
    const actualCurrentPass = mechanic.password; // Store'da tutulan şifre (MVP için)

    if (actualCurrentPass && currentPassword !== actualCurrentPass) {
      Alert.alert("Hata", "Mevcut şifre yanlış.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      Alert.alert("Hata", "Yeni şifre en az 6 karakter olmalı.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Hata", "Yeni şifreler eşleşmiyor.");
      return;
    }

    // Update
    updateMechanicData(mechanic.id, { password: newPassword });
    updateUserAuth({ password: newPassword });

    setPasswordModalVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    Alert.alert("Başarılı", "Şifre değiştirildi.");
  };

  const handleLogout = () => {
    Alert.alert(
      "Çıkış Yap",
      "Hesabınızdan çıkış yapmak istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/");
          },
        },
      ]
    );
  };

  // Kullanıcı yoksa (hata durumu)
  if (!mechanic) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Kullanıcı bilgisi bulunamadı.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.secondary, Colors.light.lightOrange]}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="white" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{mechanic.name}</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              {stars.map((full, i) => (
                <Ionicons
                  key={i}
                  name={full ? "star" : "star-outline"}
                  size={18}
                  color="#FFD700"
                />
              ))}
              <Text style={{ color: "white", fontWeight: "700" }}>
                {mechanic.rating.toFixed(1)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode((s) => !s)}
          >
            <Ionicons
              name={editMode ? "close" : "settings"}
              size={20}
              color={Colors.light.secondary}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.serviceCard}>
          <Text style={styles.sectionTitle}>İşletme Bilgileri</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>İsim / Firma Adı</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formName}
                onChangeText={setFormName}
              />
            ) : (
              <Text style={styles.serviceValue}>{mechanic.name}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-posta</Text>
            {editMode ? (
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: "#f0f0f0", color: "#999" },
                ]}
                value={formEmail}
                editable={false}
              />
            ) : (
              <Text style={styles.serviceValue}>{mechanic.email}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Telefon</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formPhone}
                onChangeText={setFormPhone}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.serviceValue}>{mechanic.phone}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adres</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formAddress}
                onChangeText={setFormAddress}
                multiline
              />
            ) : (
              <Text style={styles.serviceValue}>{mechanic.address}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Şifre</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#f8f9fa",
                padding: 12,
                borderRadius: 12,
              }}
            >
              <Text style={styles.serviceValue}>********</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(true)}>
                <Text
                  style={{ color: Colors.light.secondary, fontWeight: "600" }}
                >
                  Şifreyi Değiştir
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Uzmanlıklar</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formSpecialties}
                onChangeText={setFormSpecialties}
                placeholder="Örn: Motor, Fren, Elektrik"
              />
            ) : (
              <View style={styles.specialtiesContainer}>
                {mechanic.specialties.map((s, i) => (
                  <View key={i} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fiyat Aralığı</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formPriceRange}
                onChangeText={setFormPriceRange}
                placeholder="Örn: ₺₺"
              />
            ) : (
              <Text style={styles.serviceValue}>
                {mechanic.priceRange || "-"}
              </Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Çalışma Saatleri</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formWorkingHours}
                onChangeText={setFormWorkingHours}
              />
            ) : (
              <Text style={styles.serviceValue}>{mechanic.workingHours}</Text>
            )}
          </View>

          {editMode && (
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton, { marginTop: 10 }]}
              onPress={saveProfile}
            >
              <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={Colors.light.error} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Password Change Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Şifre Değiştir</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mevcut Şifre</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Mevcut şifrenizi girin"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Yeni Şifre</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Yeni şifre (en az 6 karakter)"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Yeni Şifre (Tekrar)</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="Yeni şifreyi onaylayın"
                />
              </View>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={changePassword}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  serviceCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.light.tabIconDefault,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.lightOrange,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: "#fff",
  },
  serviceValue: {
    fontSize: 16,
    color: Colors.light.secondary,
    fontWeight: "500",
    paddingVertical: 4,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: Colors.light.lightOrange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
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
  modalBody: {
    maxHeight: 400,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  saveButton: {
    backgroundColor: Colors.light.secondary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FECACA",
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.error,
  },
});
