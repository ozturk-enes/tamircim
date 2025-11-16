import Colors from "@/constants/Colors";
import { mockUsers, Customer } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";

export default function SettingsScreen() {
  // Mock current user - in real app this would come from auth context
  const [userInfo, setUserInfo] = useState<Customer>(mockUsers.customers[0]);
  
  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  // Modal states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  
  // Form states
  const [editedUser, setEditedUser] = useState<Customer>(userInfo);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleBack = () => {
    router.back();
  };

  const handleSaveProfile = () => {
    if (!editedUser.name || !editedUser.email || !editedUser.phone) {
      Alert.alert("Hata", "Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    setUserInfo(editedUser);
    setShowEditProfileModal(false);
    Alert.alert("Başarılı", "Profil bilgileriniz güncellendi!");
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert("Hata", "Yeni şifreler eşleşmiyor.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Alert.alert("Hata", "Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowChangePasswordModal(false);
    Alert.alert("Başarılı", "Şifreniz başarıyla değiştirildi!");
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Hesabı Sil",
      "Bu işlem geri alınamaz. Hesabınızı silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => {
            Alert.alert("Hesap Silindi", "Hesabınız başarıyla silindi.");
            router.replace("/");
          },
        },
      ]
    );
  };

  const settingSections = [
    {
      title: "Hesap",
      items: [
        {
          icon: "person",
          title: "Profil Bilgileri",
          subtitle: "Kişisel bilgilerinizi düzenleyin",
          onPress: () => setShowEditProfileModal(true),
          showArrow: true,
        },
        {
          icon: "lock-closed",
          title: "Şifre Değiştir",
          subtitle: "Hesap güvenliğinizi güncelleyin",
          onPress: () => setShowChangePasswordModal(true),
          showArrow: true,
        },
      ],
    },
    {
      title: "Bildirimler",
      items: [
        {
          icon: "notifications",
          title: "Push Bildirimleri",
          subtitle: "Uygulama bildirimleri",
          toggle: true,
          value: pushNotifications,
          onToggle: setPushNotifications,
        },
        {
          icon: "mail",
          title: "E-posta Bildirimleri",
          subtitle: "E-posta ile bildirim alın",
          toggle: true,
          value: emailNotifications,
          onToggle: setEmailNotifications,
        },
        {
          icon: "chatbubble",
          title: "SMS Bildirimleri",
          subtitle: "SMS ile bildirim alın",
          toggle: true,
          value: smsNotifications,
          onToggle: setSmsNotifications,
        },
      ],
    },
    {
      title: "Gizlilik",
      items: [
        {
          icon: "location",
          title: "Konum Servisi",
          subtitle: "Yakındaki tamircileri bulmak için",
          toggle: true,
          value: locationEnabled,
          onToggle: setLocationEnabled,
        },
        {
          icon: "shield-checkmark",
          title: "Gizlilik Politikası",
          subtitle: "Veri kullanım politikamızı görüntüleyin",
          onPress: () => Alert.alert("Gizlilik Politikası", "Bu özellik yakında eklenecek!"),
          showArrow: true,
        },
        {
          icon: "document-text",
          title: "Kullanım Şartları",
          subtitle: "Hizmet şartlarımızı görüntüleyin",
          onPress: () => Alert.alert("Kullanım Şartları", "Bu özellik yakında eklenecek!"),
          showArrow: true,
        },
      ],
    },
    {
      title: "Destek",
      items: [
        {
          icon: "help-circle",
          title: "Yardım Merkezi",
          subtitle: "SSS ve destek makaleleri",
          onPress: () => Alert.alert("Yardım", "Destek ekibimizle iletişime geçin: support@tamircim.com"),
          showArrow: true,
        },
        {
          icon: "chatbubble-ellipses",
          title: "Bize Ulaşın",
          subtitle: "Geri bildirim ve önerileriniz",
          onPress: () => Alert.alert("İletişim", "E-posta: support@tamircim.com\nTelefon: +90 212 555 0123"),
          showArrow: true,
        },
        {
          icon: "star",
          title: "Uygulamayı Değerlendir",
          subtitle: "App Store'da değerlendirin",
          onPress: () => Alert.alert("Değerlendirme", "Teşekkürler! App Store'a yönlendiriliyorsunuz..."),
          showArrow: true,
        },
      ],
    },
    {
      title: "Tehlikeli Bölge",
      items: [
        {
          icon: "trash",
          title: "Hesabı Sil",
          subtitle: "Hesabınızı kalıcı olarak silin",
          onPress: handleDeleteAccount,
          showArrow: true,
          danger: true,
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      style={[styles.settingItem, item.danger && styles.dangerItem]}
      onPress={item.onPress}
      disabled={item.toggle}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, item.danger && styles.dangerIcon]}>
          <Ionicons
            name={item.icon}
            size={20}
            color={item.danger ? Colors.light.error : Colors.light.primary}
          />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, item.danger && styles.dangerText]}>
            {item.title}
          </Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {item.toggle ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{
              false: Colors.light.border,
              true: Colors.light.lightBlue,
            }}
            thumbColor={
              item.value ? Colors.light.primary : Colors.light.tabIconDefault
            }
          />
        ) : item.showArrow ? (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.light.tabIconDefault}
          />
        ) : null}
      </View>
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
          <Text style={styles.headerTitle}>Ayarlar</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={32} color={Colors.light.primary} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userCardName}>{userInfo.name}</Text>
            <Text style={styles.userCardEmail}>{userInfo.email}</Text>
            <Text style={styles.userCardPhone}>{userInfo.phone}</Text>
          </View>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Tamircim v1.0.0</Text>
          <Text style={styles.versionSubtext}>© 2024 Tamircim. Tüm hakları saklıdır.</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditProfileModal(false)}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Profil Düzenle</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.saveButton}>Kaydet</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ad Soyad *</Text>
              <TextInput
                style={styles.input}
                value={editedUser.name}
                onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                placeholder="Adınızı ve soyadınızı girin"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-posta *</Text>
              <TextInput
                style={styles.input}
                value={editedUser.email}
                onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                placeholder="E-posta adresinizi girin"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefon *</Text>
              <TextInput
                style={styles.input}
                value={editedUser.phone}
                onChangeText={(text) => setEditedUser({ ...editedUser, phone: text })}
                placeholder="Telefon numaranızı girin"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adres</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={editedUser.address || ""}
                onChangeText={(text) => setEditedUser({ ...editedUser, address: text })}
                placeholder="Adresinizi girin"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showChangePasswordModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowChangePasswordModal(false)}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Şifre Değiştir</Text>
            <TouchableOpacity onPress={handleChangePassword}>
              <Text style={styles.saveButton}>Kaydet</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mevcut Şifre *</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.currentPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
                placeholder="Mevcut şifrenizi girin"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Yeni Şifre *</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.newPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
                placeholder="Yeni şifrenizi girin"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Yeni Şifre Tekrar *</Text>
              <TextInput
                style={styles.input}
                value={passwordForm.confirmPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
                placeholder="Yeni şifrenizi tekrar girin"
                secureTextEntry
              />
            </View>

            <View style={styles.passwordHint}>
              <Ionicons name="information-circle" size={16} color={Colors.light.tabIconDefault} />
              <Text style={styles.passwordHintText}>
                Şifreniz en az 6 karakter olmalı ve güçlü bir şifre kullanmanız önerilir.
              </Text>
            </View>
          </ScrollView>
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
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userCardName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  userCardEmail: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 2,
  },
  userCardPhone: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 16,
  },
  sectionContent: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  dangerItem: {
    borderBottomColor: Colors.light.error + "20",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dangerIcon: {
    backgroundColor: Colors.light.error + "20",
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  dangerText: {
    color: Colors.light.error,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  settingRight: {
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.tabIconDefault,
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    textAlign: "center",
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
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
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
    height: 80,
    textAlignVertical: "top",
  },
  passwordHint: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.light.lightBlue,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  passwordHintText: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    lineHeight: 20,
  },
});