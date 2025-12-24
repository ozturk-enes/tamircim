import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore"; // Oturum yönetimi
import { useDataStore } from "@/store/dataStore"; // Veritabanı işlemleri
import { Customer } from "@/types/schema";
import {
  isStrongPassword,
  isValidPhone,
  sanitizeText,
} from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  // 1. AuthStore'dan giriş yapmış kullanıcıyı al
  const user = useAuthStore((state) => state.user) as Customer;
  const logout = useAuthStore((state) => state.logout);
  const updateUserAuth = useAuthStore((state) => state.updateUser);
  const updateCustomerData = useDataStore((state) => state.updateCustomer);

  const [editMode, setEditMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  // Form state'lerini kullanıcının mevcut bilgileriyle başlat
  const [formName, setFormName] = useState(user?.name || "");
  const [formEmail, setFormEmail] = useState(user?.email || "");
  const [formPhone, setFormPhone] = useState(user?.phone || "");
  const [formAddress, setFormAddress] = useState(user?.address || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Kullanıcı bilgileri dışarıdan değişirse (örn: store update) formu güncelle
  useEffect(() => {
    if (user) {
      setFormName(user.name);
      setFormEmail(user.email);
      setFormPhone(user.phone);
      setFormAddress(user.address || "");
    }
  }, [user]);

  const headerColors = useMemo(
    () => [Colors.light.lightBlue, Colors.light.background] as const,
    []
  );

  const saveProfile = useCallback(() => {
    if (!user) return;
    const name = sanitizeText(formName);
    // const email = sanitizeText(formEmail); // Email değişimi genelde backend tarafında karmaşıktır, MVP'de kapalı tutuyoruz.
    const phone = sanitizeText(formPhone);
    const address = sanitizeText(formAddress);

    if (!name || !isValidPhone(phone)) {
      Alert.alert("Hata", "Lütfen geçerli ad ve telefon girin.");
      return;
    }

    // 2. Hem Veritabanını (DataStore) hem Oturumu (AuthStore) güncelle
    // Böylece hem kalıcı hafıza güncellenir hem de UI anında yenilenir.
    const updates = { name, phone, address };

    // Veritabanı güncelleme
    updateCustomerData(user.id, updates);
    // Oturum güncelleme
    updateUserAuth(updates);

    setEditMode(false);
    Alert.alert("Başarılı", "Profiliniz güncellendi.");
  }, [
    formName,
    formPhone,
    formAddress,
    user?.id,
    updateCustomerData,
    updateUserAuth,
  ]);

  const changePassword = useCallback(() => {
    if (!user) return;
    // Mock şifre kontrolü (Gerçek backend olmadığı için)
    // Eğer kullanıcının şifresi varsa onu kontrol et, yoksa varsayılanı kabul etme
    const actualCurrentPass = user.password;

    // Not: Gerçek app'te şifreler client tarafında saklanmaz veya hashlenir.
    // MVP olduğu için basit eşitlik kontrolü yapıyoruz.
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

    // Şifreyi güncelle
    updateCustomerData(user.id, { password: newPassword });
    updateUserAuth({ password: newPassword });

    setPasswordModalVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    Alert.alert("Başarılı", "Şifreniz başarıyla değiştirildi.");
  }, [
    user?.id,
    user?.password,
    currentPassword,
    newPassword,
    confirmPassword,
    updateCustomerData,
    updateUserAuth,
  ]);

  const handleLogout = useCallback(() => {
    Alert.alert("Çıkış Yap", "Hesabınızdan çıkış yapmak istiyor musunuz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: () => {
          // 3. Store'dan çıkış yap ve yönlendir
          logout();
          router.replace("/");
        },
      },
    ]);
  }, [logout]);

  // Kullanıcı yüklü değilse (hata durumu veya çıkış yapılmışsa)
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.
        </Text>
        <TouchableOpacity
          style={[styles.modalButton, styles.saveButton, { margin: 20 }]}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.saveButtonText}>Giriş Ekranına Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={headerColors} style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {/* Profil resmi varsa göster, yoksa ikon */}
            <Ionicons name="person" size={40} color={Colors.light.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
            {!!user.address && (
              <Text style={styles.userAddress} numberOfLines={1}>
                {user.address}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode((s) => !s)}
          >
            <Ionicons
              name={editMode ? "close" : "settings"}
              size={20}
              color={Colors.light.primary}
            />
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
                placeholder="Ad Soyad"
              />
            ) : (
              <Text style={styles.valueText}>{user.name}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>E-posta</Text>
            {editMode ? (
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: "#f0f0f0", color: "#999" },
                ]} // Email genelde değişmez
                value={formEmail}
                // onChangeText={setFormEmail}
                autoCapitalize="none"
                editable={false} // E-posta değişimini kapattım (Login ID olduğu için)
              />
            ) : (
              <Text style={styles.valueText}>{user.email}</Text>
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
                placeholder="05XX XXX XX XX"
              />
            ) : (
              <Text style={styles.valueText}>{user.phone}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adres</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formAddress}
                onChangeText={setFormAddress}
                placeholder="Adres giriniz"
                multiline
              />
            ) : (
              <Text style={styles.valueText}>{user.address || "-"}</Text>
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

        {/* Alt boşluk */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Şifre Değiştirme Modalı */}
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
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60, // StatusBar için pay
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileSection: { flexDirection: "row", alignItems: "center" },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: { flex: 1, justifyContent: "center" },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 13,
    color: Colors.light.text,
    opacity: 0.8,
    marginBottom: 2,
  },
  userAddress: { fontSize: 12, color: Colors.light.text, opacity: 0.7 },
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
  content: { padding: 20, marginTop: -20 },
  sectionCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  inputGroup: { marginBottom: 16 },
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
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: "#fafafa",
  },
  valueText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "500",
    paddingVertical: 4,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 12,
  },
  linkText: { color: Colors.light.primary, fontWeight: "600", fontSize: 14 },
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
    width: 340,
    maxWidth: "90%",
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
  modalTitle: { fontSize: 20, fontWeight: "bold", color: Colors.light.text },
  modalBody: { maxHeight: 300 },
  modalFooter: { flexDirection: "row", gap: 12, marginTop: 20 },
  modalButton: { flex: 1, padding: 14, borderRadius: 12, alignItems: "center" },
  cancelButton: { backgroundColor: "#f0f0f0" },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  saveButton: { backgroundColor: Colors.light.primary },
  saveButtonText: { fontSize: 16, fontWeight: "600", color: "white" },
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
  logoutText: { fontSize: 16, fontWeight: "700", color: Colors.light.error },
});
