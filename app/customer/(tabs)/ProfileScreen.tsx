import Colors from "@/constants/Colors";
import { customers } from "@/constants/mockData";
import { Customer } from "@/types/schema";
import {
  isStrongPassword,
  isValidEmail,
  isValidPhone,
  sanitizeText,
} from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CustomerProfileScreen() {
  const [customer, setCustomer] = useState<Customer>({
    ...customers[0],
  });
  const [editMode, setEditMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [formName, setFormName] = useState(customer.name);
  const [formEmail, setFormEmail] = useState(customer.email);
  const [formPhone, setFormPhone] = useState(customer.phone);
  const [formAddress, setFormAddress] = useState(customer.address || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const headerColors = useMemo(
    () => [Colors.light.lightBlue, Colors.light.background] as const,
    []
  );

  const saveProfile = useCallback(() => {
    const name = sanitizeText(formName);
    const email = sanitizeText(formEmail);
    const phone = sanitizeText(formPhone);
    const address = sanitizeText(formAddress);
    if (!name || !isValidEmail(email) || !isValidPhone(phone)) {
      Alert.alert("Hata", "Lütfen geçerli ad, e-posta ve telefon girin.");
      return;
    }
    const updated: Customer = { ...customer, name, email, phone, address };
    setCustomer(updated);
    const idx = customers.findIndex((c) => c.id === customer.id);
    if (idx !== -1) {
      (customers as any)[idx] = updated as any;
    }
    setEditMode(false);
    Alert.alert("Başarılı", "Profil güncellendi.");
  }, [customer, formName, formEmail, formPhone, formAddress]);

  const changePassword = useCallback(() => {
    // Mock password check - assume current password is "123456" for demo
    if (currentPassword !== "123456") {
      Alert.alert("Hata", "Mevcut şifre yanlış. (Demo için: 123456)");
      return;
    }
    if (!isStrongPassword(newPassword)) {
      Alert.alert(
        "Hata",
        "Yeni şifre en az 6 karakter, harf ve rakam içermeli."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Hata", "Yeni şifreler eşleşmiyor.");
      return;
    }

    setPasswordModalVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    Alert.alert("Başarılı", "Şifre değiştirildi.");
  }, [customer.id, currentPassword, newPassword, confirmPassword]);

  const handleLogout = useCallback(() => {
    Alert.alert("Çıkış Yap", "Hesabınızdan çıkış yapmak istiyor musunuz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={headerColors} style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color={Colors.light.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{customer.name}</Text>
            <Text style={styles.userEmail}>{customer.email}</Text>
            <Text style={styles.userPhone}>{customer.phone}</Text>
            {!!customer.address && (
              <Text style={styles.userAddress}>{customer.address}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode((s) => !s)}
          >
            <Ionicons name="settings" size={18} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ad Soyad</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formName}
                onChangeText={setFormName}
              />
            ) : (
              <Text style={styles.valueText}>{customer.name}</Text>
            )}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-posta</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formEmail}
                onChangeText={setFormEmail}
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.valueText}>{customer.email}</Text>
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
              <Text style={styles.valueText}>{customer.phone}</Text>
            )}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adres</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formAddress}
                onChangeText={setFormAddress}
              />
            ) : (
              <Text style={styles.valueText}>{customer.address || ""}</Text>
            )}
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Şifre</Text>
            <View style={styles.passwordRow}>
              <Text style={styles.valueText}>********</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(true)}>
                <Text style={styles.linkText}>Şifreyi Değiştir</Text>
              </TouchableOpacity>
            </View>
          </View>
          {editMode && (
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={saveProfile}
            >
              <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={Colors.light.error} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>

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
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Yeni Şifre</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Yeni Şifre (Tekrar)</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
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
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileSection: { flexDirection: "row", alignItems: "center" },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 4,
  },
  userEmail: { fontSize: 14, color: Colors.light.text, marginBottom: 2 },
  userPhone: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    marginBottom: 2,
  },
  userAddress: { fontSize: 12, color: Colors.light.tabIconDefault },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { padding: 20 },
  sectionCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 12,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.lightBlue,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  valueText: { fontSize: 14, color: Colors.light.text, fontWeight: "500" },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkText: { color: Colors.light.primary, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: 320,
    maxWidth: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: Colors.light.text },
  modalBody: { maxHeight: 300 },
  modalFooter: { flexDirection: "row", gap: 12, marginTop: 12 },
  modalButton: { flex: 1, padding: 12, borderRadius: 12, alignItems: "center" },
  cancelButton: { backgroundColor: Colors.light.lightBlue },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  saveButton: { backgroundColor: Colors.light.primary },
  saveButtonText: { fontSize: 16, fontWeight: "600", color: "white" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.error,
    gap: 12,
  },
  logoutText: { fontSize: 16, fontWeight: "600", color: Colors.light.error },
});
