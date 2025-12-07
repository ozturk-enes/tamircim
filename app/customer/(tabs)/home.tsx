import MechanicCardList from "@/components/shared/MechanicCardList";
import SearchBar from "@/components/shared/SearchBar";
import Colors from "@/constants/Colors";
import type { Car, Customer } from "@/constants/mockData";
import { mockJobs, mockUsers } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Enhanced mechanic data with additional details
const mechanicsWithDetails = mockUsers.mechanics.map((mechanic, index) => ({
  ...mechanic,
  distance: (Math.random() * 10 + 0.5).toFixed(1), // Distance 0.5-10.5 km
  completedJobs: Math.floor(Math.random() * 100 + 20), // 20-120 completed jobs
  responseTime: Math.floor(Math.random() * 30 + 5), // 5-35 minutes response time
  serviceTitle: mechanic.specialties[0] + " Uzmanı", // Primary service title
  experience: Math.floor(Math.random() * 15 + 2) + " yıl", // 2-17 years experience
  averageResponseTime: Math.floor(Math.random() * 60 + 15) + " dk", // 15-75 minutes
}));

export default function CustomerHomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null);
  const [modalAnimation] = useState(new Animated.Value(0));
  const currentUser: Customer = mockUsers.customers[0];
  const [appointmentVisible, setAppointmentVisible] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(
    currentUser.cars[0]?.id ?? null
  );
  const [appointmentNote, setAppointmentNote] = useState("");

  const categories = [
    "Tümü",
    "Oto Elektrik",
    "Kaporta",
    "Motor",
    "Fren Sistemi",
    "Klima",
    "Lastik",
  ];

  const filteredMechanics = mechanicsWithDetails.filter((mechanic) => {
    const matchesSearch =
      mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mechanic.specialties.some((spec) =>
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "Tümü" ||
      mechanic.specialties.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const openModal = (mechanic: any) => {
    setSelectedMechanic(mechanic);
    setModalVisible(true);
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const closeModal = () => {
    Animated.spring(modalAnimation, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start(() => {
      setModalVisible(false);
      setSelectedMechanic(null);
    });
  };

  const handlePhoneCall = (phoneNumber: string) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert("Hata", "Telefon uygulaması açılamıyor");
        }
      })
      .catch((err) => {
        console.error("Phone call error:", err);
        Alert.alert("Hata", "Arama yapılırken bir hata oluştu");
      });
  };

  const handleAppointment = () => {
    setAppointmentVisible(true);
  };

  const submitAppointment = () => {
    if (
      !selectedMechanic ||
      !selectedCarId ||
      appointmentNote.trim().length === 0
    ) {
      Alert.alert("Eksik Bilgi", "Araç ve randevu nedeni gerekli.");
      return;
    }
    const newJob = {
      id: String(Date.now()),
      customerId: currentUser.id,
      mechanicId: selectedMechanic.id,
      carId: selectedCarId,
      title: "Randevu Talebi",
      description: appointmentNote.trim(),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      estimatedPrice: 0,
      customerName: currentUser.name,
      mechanicName: selectedMechanic.name,
      carInfo: (() => {
        const car = currentUser.cars.find((c) => c.id === selectedCarId);
        return car ? `${car.brand} ${car.model} ${car.year}` : "";
      })(),
    };
    (mockJobs as any).push(newJob);
    setAppointmentVisible(false);
    setAppointmentNote("");
    Alert.alert("Randevu Talebi", "Talebiniz oluşturuldu (Bekleniyor).", [
      { text: "Tamam" },
    ]);
  };

  const renderMechanicCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.mechanicCard}
      onPress={() => openModal(item)}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel={`${item.name} tamirci kartı`}
      accessibilityHint="Detayları görmek için dokunun"
    >
      {/* Service Title Header */}
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceTitle}>{item.serviceTitle}</Text>
        <View
          style={[
            styles.onlineIndicator,
            {
              backgroundColor: item.isOnline
                ? Colors.light.success
                : Colors.light.tabIconDefault,
            },
          ]}
        />
      </View>

      {/* Main Content */}
      <View style={styles.mechanicHeader}>
        <View style={styles.mechanicAvatar}>
          <Ionicons name="person" size={28} color="white" />
        </View>
        <View style={styles.mechanicInfo}>
          <Text style={styles.mechanicName}>{item.name}</Text>

          {/* Phone Number */}
          <TouchableOpacity
            style={styles.phoneContainer}
            onPress={() => handlePhoneCall(item.phone)}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={14} color={Colors.light.primary} />
            <Text style={styles.phoneText}>{item.phone}</Text>
          </TouchableOpacity>

          {/* Address */}
          <View style={styles.addressContainer}>
            <Ionicons
              name="location"
              size={14}
              color={Colors.light.tabIconDefault}
            />
            <Text style={styles.addressText} numberOfLines={1}>
              {item.location.address}
            </Text>
          </View>

          {/* Working Hours */}
          <View style={styles.workingHoursContainer}>
            <Ionicons
              name="time"
              size={14}
              color={Colors.light.tabIconDefault}
            />
            <Text style={styles.workingHoursText}>{item.workingHours}</Text>
          </View>
        </View>
      </View>

      {/* Rating and Price Section */}
      <View style={styles.ratingPriceSection}>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.ratingCount}>({item.reviewCount})</Text>
        </View>
        <Text style={styles.priceRange}>{item.priceRange}</Text>
      </View>

      {/* Stats Footer */}
      <View style={styles.mechanicFooter}>
        <View style={styles.mechanicStats}>
          <View style={styles.statItem}>
            <Ionicons
              name="location"
              size={12}
              color={Colors.light.tabIconDefault}
            />
            <Text style={styles.statText}>{item.distance} km</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="briefcase"
              size={12}
              color={Colors.light.tabIconDefault}
            />
            <Text style={styles.statText}>{item.experience}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="checkmark-circle"
              size={12}
              color={Colors.light.success}
            />
            <Text style={styles.statText}>{item.completedJobs} iş</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handlePhoneCall(item.phone)}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Tamirci ara..."
        onClear={() => setSearchQuery("")}
      />

      {/* Category Selector */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Mechanics List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Tamirciler ({filteredMechanics.length})
          </Text>
          <TouchableOpacity style={styles.sortButton}>
            <Ionicons name="funnel" size={16} color={Colors.light.primary} />
            <Text style={styles.sortText}>Sırala</Text>
          </TouchableOpacity>
        </View>

        {filteredMechanics.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="search"
              size={48}
              color={Colors.light.tabIconDefault}
            />
            <Text style={styles.emptyText}>Tamirci bulunamadı</Text>
            <Text style={styles.emptySubtext}>
              Arama kriterlerinizi değiştirip tekrar deneyin
            </Text>
          </View>
        ) : (
          <MechanicCardList
            data={filteredMechanics}
            renderItem={renderMechanicCard}
          />
        )}
      </View>

      {/* Enhanced Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              Platform.OS === "web"
                ? styles.modalContentWeb
                : styles.modalContentMobile,
              {
                transform: [
                  {
                    scale: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: modalAnimation,
              },
            ]}
          >
            {selectedMechanic && (
              <>
                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>
                      {selectedMechanic.serviceTitle}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={closeModal}
                      accessible={true}
                      accessibilityLabel="Kapat"
                    >
                      <Ionicons
                        name="close"
                        size={24}
                        color={Colors.light.tabIconDefault}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.modalOnlineIndicator,
                      {
                        backgroundColor: selectedMechanic.isOnline
                          ? Colors.light.success
                          : Colors.light.tabIconDefault,
                      },
                    ]}
                  >
                    <Text style={styles.onlineText}>
                      {selectedMechanic.isOnline ? "Çevrimiçi" : "Çevrimdışı"}
                    </Text>
                  </View>
                </View>

                {/* Mechanic Info */}
                <View style={styles.modalMechanicInfo}>
                  <View style={styles.modalAvatar}>
                    <Ionicons name="person" size={32} color="white" />
                  </View>
                  <View style={styles.modalInfoText}>
                    <Text style={styles.modalMechanicName}>
                      {selectedMechanic.name}
                    </Text>
                    <View style={styles.modalRating}>
                      <Ionicons name="star" size={18} color="#FFD700" />
                      <Text style={styles.modalRatingText}>
                        {selectedMechanic.rating} (
                        {selectedMechanic.reviewCount} değerlendirme)
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Details Grid */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="call"
                      size={16}
                      color={Colors.light.primary}
                    />
                    <Text style={styles.detailLabel}>Telefon</Text>
                    <Text style={styles.detailValue}>
                      {selectedMechanic.phone}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="location"
                      size={16}
                      color={Colors.light.primary}
                    />
                    <Text style={styles.detailLabel}>Adres</Text>
                    <Text style={styles.detailValue}>
                      {selectedMechanic.location.address}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="time"
                      size={16}
                      color={Colors.light.primary}
                    />
                    <Text style={styles.detailLabel}>Çalışma Saatleri</Text>
                    <Text style={styles.detailValue}>
                      {selectedMechanic.workingHours}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons
                      name="cash"
                      size={16}
                      color={Colors.light.primary}
                    />
                    <Text style={styles.detailLabel}>Fiyat Aralığı</Text>
                    <Text style={styles.detailValue}>
                      {selectedMechanic.priceRange}
                    </Text>
                  </View>
                </View>

                {/* Specialties */}
                <View style={styles.specialtiesContainer}>
                  <Text style={styles.specialtiesTitle}>Uzmanlık Alanları</Text>
                  <View style={styles.specialtiesGrid}>
                    {selectedMechanic.specialties.map(
                      (specialty: string, index: number) => (
                        <View key={index} style={styles.specialtyChip}>
                          <Text style={styles.specialtyText}>{specialty}</Text>
                        </View>
                      )
                    )}
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.appointmentButton}
                    onPress={handleAppointment}
                    activeOpacity={0.8}
                    accessible={true}
                    accessibilityLabel="Randevu al"
                  >
                    <Ionicons name="calendar" size={20} color="white" />
                    <Text style={styles.appointmentButtonText}>Randevu Al</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => {
                      closeModal();
                      router.push({
                        pathname: "/customer/(tabs)/map",
                        params: { mechanicId: String(selectedMechanic.id) },
                      });
                    }}
                    activeOpacity={0.8}
                    accessible={true}
                    accessibilityLabel="Konuma Git"
                  >
                    <Ionicons name="navigate" size={20} color="white" />
                    <Text style={styles.callButtonText}>Konuma Git</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>

      <Modal visible={appointmentVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentSmall}>
            <View style={styles.modalHeaderSmall}>
              <Text style={styles.modalTitle}>Randevu Al</Text>
              <TouchableOpacity onPress={() => setAppointmentVisible(false)}>
                <Ionicons
                  name="close"
                  size={22}
                  color={Colors.light.tabIconDefault}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.detailLabel}>Araç Seç</Text>
            <ScrollView style={{ maxHeight: 160 }}>
              {currentUser.cars.map((car: Car) => (
                <TouchableOpacity
                  key={car.id}
                  style={[
                    styles.carOption,
                    selectedCarId === car.id && styles.carOptionActive,
                  ]}
                  onPress={() => setSelectedCarId(car.id)}
                >
                  <Text style={styles.carOptionText}>
                    {car.brand} {car.model} • {car.plate}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={[styles.detailLabel, { marginTop: 10 }]}>
              Kısa Arıza Bilgisi
            </Text>
            <View style={styles.noteBox}>
              <TextInput
                value={appointmentNote}
                onChangeText={setAppointmentNote}
                placeholder="Örn: Frenlerden ses geliyor"
                placeholderTextColor={Colors.light.tabIconDefault}
                style={{ fontSize: 14, color: Colors.light.text }}
                multiline
              />
            </View>
            <TouchableOpacity
              style={styles.appointmentSubmit}
              onPress={submitAppointment}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.appointmentSubmitText}>Randevu Talep Et</Text>
            </TouchableOpacity>
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
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.background,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  categoryContainer: {
    paddingVertical: 8,
    backgroundColor: Colors.light.background,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.lightGray,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "white",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  sortText: {
    fontSize: 14,
    color: Colors.light.primary,
    marginLeft: 4,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 20,
  },
  // Enhanced Mechanic Card Styles
  mechanicCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.primary,
    flex: 1,
  },
  mechanicHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  mechanicAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 6,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    paddingVertical: 2,
  },
  phoneText: {
    fontSize: 14,
    color: Colors.light.primary,
    marginLeft: 6,
    fontWeight: "500",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    marginLeft: 6,
    flex: 1,
  },
  workingHoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  workingHoursText: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    marginLeft: 6,
  },
  ratingPriceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.text,
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
    marginLeft: 4,
  },
  priceRange: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  mechanicFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.lightGray,
  },
  mechanicStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginLeft: 4,
  },
  contactButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContentWeb: {
    maxWidth: 500,
    width: "90%",
  },
  modalContentMobile: {
    maxWidth: width - 40,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.primary,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOnlineIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  onlineText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  modalMechanicInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  modalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modalInfoText: {
    flex: 1,
  },
  modalMechanicName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  modalRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalRatingText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginLeft: 6,
  },
  detailsGrid: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
    fontWeight: "500",
  },
  specialtiesContainer: {
    marginBottom: 24,
  },
  specialtiesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 12,
  },
  specialtiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  appointmentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  appointmentButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.success,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: Colors.light.success,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  modalContentSmall: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "100%",
    padding: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  modalHeaderSmall: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  carOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: "#FAFAFA",
    marginBottom: 8,
  },
  carOptionActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.lightBlue,
  },
  carOptionText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "600",
  },
  noteBox: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FAFAFA",
    minHeight: 80,
  },
  appointmentSubmit: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
    gap: 8,
  },
  appointmentSubmitText: {
    color: "white",
    fontWeight: "700",
  },
});
