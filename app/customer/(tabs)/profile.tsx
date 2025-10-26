import Colors from "@/constants/Colors";
import { mockUsers } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Mock car data for the user
const mockUserCars = [
  {
    id: 1,
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    plate: "34 ABC 123",
    color: "Beyaz",
    fuelType: "Benzin",
    mileage: 45000,
    lastService: "2024-01-15",
    nextService: "2024-07-15",
    image: "🚗",
  },
  {
    id: 2,
    brand: "Volkswagen",
    model: "Golf",
    year: 2019,
    plate: "06 XYZ 789",
    color: "Siyah",
    fuelType: "Dizel",
    mileage: 62000,
    lastService: "2023-12-20",
    nextService: "2024-06-20",
    image: "🚙",
  },
];

export default function CustomerProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [cars, setCars] = useState(mockUserCars);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    year: "",
    plate: "",
    color: "",
    fuelType: "Benzin",
    mileage: "",
  });

  // Mock current user - in real app this would come from auth context
  const currentUser = mockUsers.customers[0];

  const stats = [
    { icon: "car", label: "Araçlar", value: cars.length },
    { icon: "time", label: "Geçmiş İşlemler", value: 12 },
    { icon: "heart", label: "Favoriler", value: 3 },
  ];

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
            router.replace("/");
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert("Profil Düzenle", "Bu özellik yakında eklenecek!");
  };

  const handleAddCar = () => {
    if (!newCar.brand || !newCar.model || !newCar.year || !newCar.plate) {
      Alert.alert("Hata", "Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    const carToAdd = {
      id: cars.length + 1,
      ...newCar,
      year: parseInt(newCar.year),
      mileage: parseInt(newCar.mileage) || 0,
      lastService: new Date().toISOString().split("T")[0],
      nextService: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      image: "🚗",
    };

    setCars([...cars, carToAdd]);
    setNewCar({
      brand: "",
      model: "",
      year: "",
      plate: "",
      color: "",
      fuelType: "Benzin",
      mileage: "",
    });
    setShowAddCarModal(false);
    Alert.alert("Başarılı", "Araç başarıyla eklendi!");
  };

  const handleCarPress = (car: any) => {
    router.push({
      pathname: "/customer/carDetails",
      params: { carId: car.id },
    });
  };

  const menuItems = [
    {
      id: 1,
      title: "Geçmiş Tamir İşlemleri",
      subtitle: "Önceki tamir kayıtlarını görüntüle",
      icon: "time",
      onPress: () =>
        Alert.alert("Geçmiş İşlemler", "Bu özellik yakında eklenecek!"),
      showArrow: true,
    },
    {
      id: 2,
      title: "Favoriler",
      subtitle: "Favori tamircilerinizi görüntüle",
      icon: "heart",
      onPress: () => Alert.alert("Favoriler", "Bu özellik yakında eklenecek!"),
      showArrow: true,
    },
    {
      id: 3,
      title: "Yardım ve Destek",
      subtitle: "SSS ve iletişim bilgileri",
      icon: "help-circle",
      onPress: () =>
        Alert.alert(
          "Yardım",
          "Destek ekibimizle iletişime geçin: support@tamircim.com"
        ),
      showArrow: true,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.lightBlue]}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="white" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUser.name}</Text>
            <Text style={styles.userEmail}>{currentUser.email}</Text>
            <Text style={styles.userPhone}>{currentUser.phone}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="pencil" size={20} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons
                  name={stat.icon as any}
                  size={24}
                  color={Colors.light.primary}
                />
              </View>
              <Text style={styles.statNumber}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Cars Section */}
        <View style={styles.menuSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Araçlarım</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddCarModal(true)}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.addButtonText}>Araç Ekle</Text>
            </TouchableOpacity>
          </View>

          {cars.length > 0 ? (
            <FlatList
              data={cars}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.carCard}
                  onPress={() => handleCarPress(item)}
                >
                  <View style={styles.carHeader}>
                    <Text style={styles.carEmoji}>{item.image}</Text>
                    <View style={styles.carInfo}>
                      <Text style={styles.carTitle}>
                        {item.brand} {item.model}
                      </Text>
                      <Text style={styles.carSubtitle}>
                        {item.year} • {item.plate}
                      </Text>
                      <Text style={styles.carDetails}>
                        {item.color} • {item.fuelType}
                      </Text>
                    </View>
                    <View style={styles.carActions}>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={Colors.light.tabIconDefault}
                      />
                    </View>
                  </View>

                  <View style={styles.carFooter}>
                    <View style={styles.carStat}>
                      <Ionicons
                        name="speedometer"
                        size={14}
                        color={Colors.light.tabIconDefault}
                      />
                      <Text style={styles.carStatText}>
                        {item.mileage?.toLocaleString()} km
                      </Text>
                    </View>
                    <View style={styles.carStat}>
                      <Ionicons
                        name="calendar"
                        size={14}
                        color={Colors.light.tabIconDefault}
                      />
                      <Text style={styles.carStatText}>
                        Sonraki Servis: {item.nextService}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="car"
                size={48}
                color={Colors.light.tabIconDefault}
              />
              <Text style={styles.emptyText}>Henüz araç eklenmemiş</Text>
              <Text style={styles.emptySubtext}>
                İlk aracınızı eklemek için "Araç Ekle" butonunu kullanın
              </Text>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={Colors.light.primary}
                />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              {item.showArrow && (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.light.tabIconDefault}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Ayarlar</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="notifications"
                size={24}
                color={Colors.light.primary}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Bildirimler</Text>
                <Text style={styles.settingSubtitle}>
                  Tamir durumu bildirimleri
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: Colors.light.border,
                true: Colors.light.lightBlue,
              }}
              thumbColor={
                notificationsEnabled
                  ? Colors.light.primary
                  : Colors.light.tabIconDefault
              }
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="location"
                size={24}
                color={Colors.light.primary}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Konum Servisi</Text>
                <Text style={styles.settingSubtitle}>
                  Yakındaki tamircileri bul
                </Text>
              </View>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{
                false: Colors.light.border,
                true: Colors.light.lightBlue,
              }}
              thumbColor={
                locationEnabled
                  ? Colors.light.primary
                  : Colors.light.tabIconDefault
              }
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color={Colors.light.error} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      {/* Add Car Modal */}
      <Modal
        visible={showAddCarModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddCarModal(false)}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Yeni Araç Ekle</Text>
            <TouchableOpacity onPress={handleAddCar}>
              <Text style={styles.saveButton}>Kaydet</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Marka *</Text>
              <TextInput
                style={styles.input}
                value={newCar.brand}
                onChangeText={(text) => setNewCar({ ...newCar, brand: text })}
                placeholder="Örn: Toyota"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Model *</Text>
              <TextInput
                style={styles.input}
                value={newCar.model}
                onChangeText={(text) => setNewCar({ ...newCar, model: text })}
                placeholder="Örn: Corolla"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Yıl *</Text>
              <TextInput
                style={styles.input}
                value={newCar.year}
                onChangeText={(text) => setNewCar({ ...newCar, year: text })}
                placeholder="Örn: 2020"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Plaka *</Text>
              <TextInput
                style={styles.input}
                value={newCar.plate}
                onChangeText={(text) => setNewCar({ ...newCar, plate: text })}
                placeholder="Örn: 34 ABC 123"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Renk</Text>
              <TextInput
                style={styles.input}
                value={newCar.color}
                onChangeText={(text) => setNewCar({ ...newCar, color: text })}
                placeholder="Örn: Beyaz"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Yakıt Türü</Text>
              <View style={styles.fuelTypeContainer}>
                {["Benzin", "Dizel", "LPG", "Elektrik", "Hibrit"].map(
                  (fuel) => (
                    <TouchableOpacity
                      key={fuel}
                      style={[
                        styles.fuelTypeButton,
                        newCar.fuelType === fuel && styles.fuelTypeButtonActive,
                      ]}
                      onPress={() => setNewCar({ ...newCar, fuelType: fuel })}
                    >
                      <Text
                        style={[
                          styles.fuelTypeText,
                          newCar.fuelType === fuel && styles.fuelTypeTextActive,
                        ]}
                      >
                        {fuel}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Kilometre</Text>
              <TextInput
                style={styles.input}
                value={newCar.mileage}
                onChangeText={(text) => setNewCar({ ...newCar, mileage: text })}
                placeholder="Örn: 45000"
                keyboardType="numeric"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  userEmail: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: "white",
    opacity: 0.8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  menuSection: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
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
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  settingsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
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
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
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
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.error,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  carCard: {
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
  carHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  carEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  carInfo: {
    flex: 1,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  carSubtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 2,
  },
  carDetails: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  carActions: {
    justifyContent: "center",
  },
  carFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  carStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  carStatText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  emptyState: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
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
  fuelTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  fuelTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: "white",
  },
  fuelTypeButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  fuelTypeText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  fuelTypeTextActive: {
    color: "white",
  },
});
