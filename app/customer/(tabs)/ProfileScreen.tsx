import Colors from "@/constants/Colors";
import type { Customer } from "@/constants/mockData";
import { mockUsers } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
  const currentUser: Customer = mockUsers.customers[0];
  const [userData, setUserData] = useState<Customer>({ ...currentUser });
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    address: currentUser.address || "",
    password: currentUser.password,
  });

  const handlePhotoUpload = () => {};

  const openSettings = () => {
    setForm({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address || "",
      password: userData.password,
    });
    setSettingsVisible(true);
  };

  const saveSettings = () => {
    setUserData((prev) => ({
      ...prev,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      password: form.password,
    }));
    setSettingsVisible(false);
  };

  const confirmLogout = () => {
    Alert.alert("Çıkış", "Çıkış yapılıyor, emin misiniz?", [
      { text: "Hayır", style: "cancel" },
      {
        text: "Evet",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  return (
    <LinearGradient
      colors={[Colors.light.lightBlue, Colors.light.background]}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatarWrapper}>
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={handlePhotoUpload}
            activeOpacity={0.7}
          >
            {userData.avatar ? (
              <Image source={userData.avatar as any} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={36} color={Colors.light.primary} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoList}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userDetail}>{userData.email}</Text>
          <Text style={styles.userDetail}>{userData.phone}</Text>
          {!!userData.address && (
            <Text style={styles.userDetail}>{userData.address}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.settingsFab}
          onPress={openSettings}
          activeOpacity={0.8}
          accessibilityLabel="Ayarlar"
        >
          <Ionicons name="settings" size={20} color={"white"} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={confirmLogout}
        activeOpacity={0.8}
        accessibilityLabel="Çıkış Yap"
      >
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <Modal visible={settingsVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ayarlar</Text>
              <TouchableOpacity onPress={() => setSettingsVisible(false)}>
                <Ionicons name="close" size={22} color={"#999"} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                value={form.name}
                onChangeText={(v) => setForm({ ...form, name: v })}
                placeholderTextColor={Colors.light.tabIconDefault}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                value={form.email}
                onChangeText={(v) => setForm({ ...form, email: v })}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.light.tabIconDefault}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call" size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Telefon"
                value={form.phone}
                onChangeText={(v) => setForm({ ...form, phone: v })}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.light.tabIconDefault}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location" size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Adres"
                value={form.address}
                onChangeText={(v) => setForm({ ...form, address: v })}
                placeholderTextColor={Colors.light.tabIconDefault}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={Colors.light.primary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                value={form.password}
                onChangeText={(v) => setForm({ ...form, password: v })}
                secureTextEntry
                placeholderTextColor={Colors.light.tabIconDefault}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveSettings} activeOpacity={0.8}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
    position: "relative",
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 12,
  },
  avatarButton: {
    marginRight: 0,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.light.lightBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  infoList: {
    gap: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  userDetail: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
  settingsFab: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: Colors.light.secondary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutButton: {
    marginTop: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.error,
    backgroundColor: "white",
  },
  logoutText: {
    color: Colors.light.error,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.light.text,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
    gap: 8,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
