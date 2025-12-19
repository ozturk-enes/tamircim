import Colors from "@/constants/Colors";
import { mechanics, mockMessages, mockOffers } from "@/constants/mockData";
import { Mechanic } from "@/types/schema";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
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
  const [mechanic, setMechanic] = useState<Mechanic>(mechanics[0]);
  const [editMode, setEditMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [newCarData, setNewCarData] = useState({
    brand: "",
    model: "",
    year: "",
    plate: "",
    customerName: "",
    customerPhone: "",
    problem: "",
    estimatedPrice: "",
  });

  const [formName, setFormName] = useState(mechanic.name);
  const [formEmail, setFormEmail] = useState(mechanic.email);
  const [formPhone, setFormPhone] = useState(mechanic.phone);
  const [formAddress, setFormAddress] = useState(mechanic.address);
  const [formSpecialties, setFormSpecialties] = useState(
    mechanic.specialties.join(", ")
  );
  const [formPriceRange, setFormPriceRange] = useState(mechanic.priceRange);
  const [formWorkingHours, setFormWorkingHours] = useState(
    mechanic.workingHours
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const saveProfile = () => {
    const emailValid = /.+@.+\..+/.test(formEmail.trim());
    const phoneValid = formPhone.trim().length >= 10;
    if (!formName.trim() || !emailValid || !phoneValid || !formAddress.trim()) {
      Alert.alert("Hata", "Lütfen geçerli bilgileri girin.");
      return;
    }
    const updated: Mechanic = {
      ...mechanic,
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      address: formAddress.trim(),
      location: { ...mechanic.location },
      specialties: formSpecialties
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0),
      // priceRange and workingHours are not in Mechanic schema?
      // Let's check schema again.
      // Schema has workingHours. Does it have priceRange?
      // Schema: workingHours: string;
      // Schema does NOT have priceRange.
      // I should probably ignore priceRange or add it to schema.
      // I will add it to schema to be safe, or just ignore here.
      workingHours: formWorkingHours.trim(),
    } as Mechanic;

    // For now, let's assume priceRange is handled elsewhere or remove it if not in schema.
    // Schema check:
    // export interface Mechanic extends UserBase {
    //   role: 'mechanic';
    //   address: string;
    //   rating: number;
    //   reviewCount: number;
    //   isOnline: boolean;
    //   workingHours: string;
    //   specialties: MechanicSpecialty[];
    //   location: { latitude: number; longitude: number; };
    // }

    // So no priceRange.
    // I will remove priceRange from the update object.

    setMechanic(updated);
    const idx = mechanics.findIndex((m) => m.id === mechanic.id);
    if (idx !== -1) {
      // mechanics is const, but we can try to mutate for mock
      (mechanics as any)[idx] = { ...updated, priceRange: formPriceRange };
    }
    setEditMode(false);
    Alert.alert("Başarılı", "Profil güncellendi.");
  };

  const changePassword = () => {
    // Password change logic is mocked since we don't have password in schema
    const current = "123456"; // Dummy password
    if (current !== currentPassword) {
      Alert.alert("Hata", "Mevcut şifre yanlış. (Mock: 123456)");
      return;
    }
    const strong = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(newPassword);
    if (!strong) {
      Alert.alert(
        "Hata",
        "Yeni şifre en az 6 karakter olmalı ve harf/rakam içermeli."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Hata", "Yeni şifreler eşleşmiyor.");
      return;
    }
    // Update mock
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
            router.replace("/");
          },
        },
      ]
    );
  };

  const handleAddCar = () => {
    if (
      !newCarData.brand ||
      !newCarData.model ||
      !newCarData.plate ||
      !newCarData.customerName
    ) {
      Alert.alert("Hata", "Lütfen gerekli alanları doldurun.");
      return;
    }

    Alert.alert("Başarılı", "Araç başarıyla eklendi!");
    setShowAddCarModal(false);
    setNewCarData({
      brand: "",
      model: "",
      year: "",
      plate: "",
      customerName: "",
      customerPhone: "",
      problem: "",
      estimatedPrice: "",
    });
  };

  const handleOfferAction = (offerId: string, action: "accept" | "reject") => {
    const offer = mockOffers.find((o) => o.id === offerId);
    if (action === "accept") {
      Alert.alert(
        "Teklif Kabul Edildi",
        `${offer?.customerName} müşterisinin teklifi kabul edildi. Müşteri ile iletişime geçebilirsiniz.`
      );
    } else {
      Alert.alert(
        "Teklif Reddedildi",
        `${offer?.customerName} müşterisinin teklifi reddedildi.`
      );
    }
    setShowOffersModal(false);
  };

  const handleMessagePress = (message: any) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const handleJobComplete = (jobId: string) => {
    Alert.alert("İş Tamamla", "Bu işi tamamladığınızı onaylıyor musunuz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Tamamla",
        onPress: () => Alert.alert("Başarılı", "İş tamamlandı!"),
      },
    ]);
  };

  const stars = useMemo(() => {
    const full = Math.floor(mechanic.rating);
    return Array.from({ length: 5 }, (_, i) => i < full);
  }, [mechanic.rating]);

  const renderCarCard = ({ item }: { item: any }) => (
    <View style={styles.carCard}>
      <View style={styles.carHeader}>
        <View style={styles.carMainInfo}>
          <Text style={styles.carTitle}>
            {item.brand} {item.model} ({item.year})
          </Text>
          <Text style={styles.carPlate}>{item.plate}</Text>
          <Text style={styles.customerName}>{item.customerName}</Text>
        </View>
        <View
          style={[
            styles.priorityBadge,
            {
              backgroundColor:
                item.priority === "high"
                  ? Colors.light.error
                  : item.priority === "medium"
                  ? Colors.light.warning
                  : Colors.light.success,
            },
          ]}
        >
          <Text style={styles.priorityText}>
            {item.priority === "high"
              ? "Acil"
              : item.priority === "medium"
              ? "Orta"
              : "Düşük"}
          </Text>
        </View>
      </View>
      <Text style={styles.carProblem}>{item.problem}</Text>
      <View style={styles.carFooter}>
        <Text style={styles.estimatedPrice}>{item.estimatedPrice}</Text>
        <Text style={styles.addedDate}>{item.addedDate}</Text>
      </View>
    </View>
  );

  const renderActiveJob = ({ item }: { item: any }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobCustomer}>{item.customerName}</Text>
          <Text style={styles.jobCarInfo}>{item.carInfo}</Text>
          <Text style={styles.jobProblem}>{item.problem}</Text>
        </View>
        <Text style={styles.jobPrice}>{item.price}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>

      <View style={styles.jobFooter}>
        <Text style={styles.jobDate}>Başlangıç: {item.startDate}</Text>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleJobComplete(item.id)}
        >
          <Text style={styles.completeButtonText}>Tamamla</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
              name="settings"
              size={18}
              color={Colors.light.secondary}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.serviceCard}>
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
              <Text style={styles.serviceValue}>{mechanic.name}</Text>
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
              }}
            >
              <Text style={styles.serviceValue}>********</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(true)}>
                <Text
                  style={{ color: Colors.light.primary, fontWeight: "600" }}
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
              />
            ) : (
              <Text style={styles.serviceValue}>{mechanic.priceRange}</Text>
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

      {/* Add Car Modal */}
      <Modal
        visible={showAddCarModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddCarModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Araç Ekle</Text>
              <TouchableOpacity onPress={() => setShowAddCarModal(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Marka</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.brand}
                  onChangeText={(text) =>
                    setNewCarData({ ...newCarData, brand: text })
                  }
                  placeholder="Örn: Toyota"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Model</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.model}
                  onChangeText={(text) =>
                    setNewCarData({ ...newCarData, model: text })
                  }
                  placeholder="Örn: Corolla"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Yıl</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.year}
                  onChangeText={(text) =>
                    setNewCarData({ ...newCarData, year: text })
                  }
                  placeholder="Örn: 2020"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Plaka</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.plate}
                  onChangeText={(text) =>
                    setNewCarData({ ...newCarData, plate: text })
                  }
                  placeholder="Örn: 34 ABC 123"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Müşteri Adı</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.customerName}
                  onChangeText={(text) =>
                    setNewCarData({ ...newCarData, customerName: text })
                  }
                  placeholder="Müşteri adı"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Müşteri Telefonu</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.customerPhone}
                  onChangeText={(text) =>
                    setNewCarData({ ...newCarData, customerPhone: text })
                  }
                  placeholder="+90 5XX XXX XX XX"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sorun Açıklaması</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newCarData.problem}
                  onChangeText={(text) =>
                    setNewCarData({ ...newCarData, problem: text })
                  }
                  placeholder="Aracın sorunu nedir?"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tahmini Fiyat</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.estimatedPrice}
                  onChangeText={(text) =>
                    setNewCarData({ ...newCarData, estimatedPrice: text })
                  }
                  placeholder="₺500"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddCarModal(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddCar}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Messages Modal */}
      <Modal
        visible={showMessageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Müşteri Mesajları</Text>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={mockMessages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.messageCard,
                    !item.isRead && styles.unreadMessage,
                  ]}
                  onPress={() => handleMessagePress(item)}
                >
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageSender}>
                      {item.customerName}
                    </Text>
                    <Text style={styles.messageTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.messageCarPlate}>{item.carPlate}</Text>
                  <Text style={styles.messageText} numberOfLines={2}>
                    {item.message}
                  </Text>
                  {!item.isRead && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Offers Modal */}
      <Modal
        visible={showOffersModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowOffersModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Teklifler</Text>
              <TouchableOpacity onPress={() => setShowOffersModal(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={mockOffers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.offerCard}>
                  <View style={styles.offerHeader}>
                    <Text style={styles.offerCustomer}>
                      {item.customerName}
                    </Text>
                    <Text style={styles.offerTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.offerCarInfo}>{item.carInfo}</Text>
                  <Text style={styles.offerProblem}>{item.problem}</Text>
                  <View style={styles.offerDetails}>
                    <Text style={styles.offerPrice}>{item.offeredPrice}</Text>
                    <Text style={styles.offerLocation}>
                      {item.location} ({item.distance})
                    </Text>
                  </View>
                  <View style={styles.offerActions}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleOfferAction(item.id, "reject")}
                    >
                      <Text style={styles.rejectButtonText}>Reddet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleOfferAction(item.id, "accept")}
                    >
                      <Text style={styles.acceptButtonText}>Kabul Et</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
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
    marginBottom: 2,
  },
  userAddress: {
    fontSize: 12,
    color: "white",
    opacity: 0.7,
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
  statusCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
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
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  statusDescription: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
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
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.secondary,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  serviceLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
    flex: 1,
  },
  serviceValue: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: "bold",
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: Colors.light.lightOrange,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: "500",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
  },
  actionButtonContent: {
    position: "relative",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: Colors.light.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
  carCard: {
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
  carHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  carMainInfo: {
    flex: 1,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: "600",
    marginBottom: 2,
  },
  customerName: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
  carProblem: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  carFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  estimatedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.secondary,
  },
  addedDate: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  jobCard: {
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
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobCustomer: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  jobCarInfo: {
    fontSize: 14,
    color: Colors.light.secondary,
    marginBottom: 2,
  },
  jobProblem: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  jobPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.secondary,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.light.lightOrange,
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.secondary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.light.secondary,
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  jobDate: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  completeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.light.success,
  },
  completeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
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
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    maxHeight: "80%",
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
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.lightOrange,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.light.lightOrange,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.secondary,
  },
  saveButton: {
    backgroundColor: Colors.light.secondary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  messageCard: {
    backgroundColor: Colors.light.lightOrange,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    position: "relative",
  },
  unreadMessage: {
    backgroundColor: "#E3F2FD",
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  messageCarPlate: {
    fontSize: 12,
    color: Colors.light.secondary,
    fontWeight: "600",
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  unreadDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
  },
  offerCard: {
    backgroundColor: Colors.light.lightOrange,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  offerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  offerCustomer: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  offerTime: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  offerCarInfo: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  offerProblem: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
  },
  offerDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.secondary,
  },
  offerLocation: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  offerActions: {
    flexDirection: "row",
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.error,
    alignItems: "center",
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.error,
  },
  acceptButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.secondary,
    alignItems: "center",
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});
