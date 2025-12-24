import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";
import { Car, Job, Reminder } from "@/types/schema";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function GarageScreen() {
  // --- STORE INTEGRATION ---
  const currentUser = useAuthStore((state) => state.user);
  const allCars = useDataStore((state) => state.cars);
  const allJobs = useDataStore((state) => state.jobs);
  const mechanics = useDataStore((state) => state.mechanics);
  // Reminderlar store'da tanımlı değilse boş array varsayalım (DataStore güncellemesine bağlı)
  const allReminders = useDataStore((state) => state.reminders) || [];

  const addCar = useDataStore((state) => state.addCar);
  const removeCar = useDataStore((state) => state.removeCar);
  const addReminder = useDataStore((state) => state.addReminder);
  const toggleReminder = useDataStore((state) => state.toggleReminder);
  const rateJob = useDataStore((state) => state.rateJob);

  // Kullanıcının araçları
  const myCars = useMemo(
    () => allCars.filter((c) => c.ownerId === currentUser?.id),
    [allCars, currentUser?.id]
  );

  // --- STATE MANAGEMENT ---
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Modals
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isDetailModalVisible, setDetailModalVisible] = useState(false);
  const [isReminderModalVisible, setReminderModalVisible] = useState(false);

  // Form States (Araç Ekleme)
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Image Picker
  const pickImage = async () => {
    try {
      // 1. İzin Kontrolü
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "İzin Gerekli",
          "Galeriye erişim izni vermeniz gerekmektedir. Lütfen ayarlardan izin verin.",
          [{ text: "Tamam" }]
        );
        return;
      }

      setIsImageLoading(true);

      // 2. Galeri Açma
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Optimize size
      });

      if (!result.canceled) {
        const asset = result.assets[0];

        // 3. Dosya Boyutu Kontrolü (5MB = 5 * 1024 * 1024 bytes)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (asset.fileSize && asset.fileSize > MAX_SIZE) {
          Alert.alert("Boyut Hatası", "Dosya boyutu 5MB'dan büyük olamaz.");
          return;
        }

        // 4. Format Kontrolü
        if (asset.type !== "image") {
          Alert.alert(
            "Format Hatası",
            "Lütfen geçerli bir fotoğraf dosyası seçin (JPEG/PNG)."
          );
          return;
        }

        setImageUri(asset.uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Fotoğraf seçilirken bir hata oluştu.");
    } finally {
      setIsImageLoading(false);
    }
  };

  // Form States (Hatırlatıcı)
  const [remTitle, setRemTitle] = useState("");
  const [remDate, setRemDate] = useState("");
  const [remMileage, setRemMileage] = useState("");

  // Rating States
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingJobId, setRatingJobId] = useState<string | null>(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState("");

  // Tab State (Detay Sayfası)
  const [detailTab, setDetailTab] = useState<"history" | "reminders">(
    "history"
  );

  // --- ACTIONS ---

  const handleRateJob = () => {
    if (ratingJobId && ratingScore > 0) {
      rateJob(ratingJobId, ratingScore, ratingComment);
      setRatingModalVisible(false);
      setRatingJobId(null);
      setRatingScore(5);
      setRatingComment("");
      Alert.alert("Teşekkürler", "Değerlendirmeniz alındı.");
    } else {
      Alert.alert("Hata", "Lütfen bir puan verin.");
    }
  };

  const handleSaveCar = () => {
    if (!brand || !model || !plate || !year) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    if (!currentUser) return;

    const newCar: Car = {
      id: Date.now().toString(),
      ownerId: currentUser.id,
      brand: brand.trim(),
      model: model.trim(),
      year: parseInt(year),
      plate: plate.trim().toUpperCase(),
      color: "Bilinmiyor",
      fuelType: "Gasoline", // Varsayılan
      // Rastgele bir araba görseli (Unsplash source) veya seçilen görsel
      image:
        imageUri ||
        `https://source.unsplash.com/800x600/?car,${brand},${model}`,
      photoUrl: imageUri || undefined,
      photoMetadata: imageUri
        ? {
            size: 0, // Mock size
            type: "image/jpeg",
            lastModified: Date.now(),
          }
        : undefined,
    };

    addCar(newCar);
    setAddModalVisible(false);

    // Reset Form
    setBrand("");
    setModel("");
    setYear("");
    setPlate("");
    setImageUri(null);
  };

  const handleDeleteCar = () => {
    if (!selectedCar) return;

    Alert.alert(
      "Aracı Sil",
      "Bu araçla ilgili tüm bilgiler silinecek. Emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => {
            removeCar(selectedCar.id);
            setDetailModalVisible(false);
            setSelectedCar(null);
          },
        },
      ]
    );
  };

  const handleSaveReminder = () => {
    if (!selectedCar || !remTitle) {
      Alert.alert("Hata", "Başlık zorunludur.");
      return;
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      carId: selectedCar.id,
      userId: currentUser?.id || "unknown",
      type: "Other", // Default type
      title: remTitle,
      dueDate: remDate,
      dueMileage: remMileage ? parseInt(remMileage) : undefined,
      isCompleted: false,
    };

    addReminder(newReminder);

    setReminderModalVisible(false);
    setRemTitle("");
    setRemDate("");
    setRemMileage("");
  };

  // Seçili aracın geçmiş işlemleri
  const carJobs = useMemo(() => {
    if (!selectedCar) return [];
    return allJobs.filter((job) => job.carId === selectedCar.id);
  }, [selectedCar, allJobs]);

  // Seçili aracın hatırlatıcıları
  const carReminders = useMemo(() => {
    if (!selectedCar) return [];
    return allReminders.filter((r) => r.carId === selectedCar.id);
  }, [selectedCar, allReminders]);

  // --- RENDER ITEMS ---

  const renderCarItem = ({ item }: { item: Car }) => (
    <TouchableOpacity
      style={styles.carCard}
      activeOpacity={0.9}
      onPress={() => {
        setSelectedCar(item);
        setDetailModalVisible(true);
      }}
    >
      <Image
        source={{
          uri:
            item.image ||
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1000&auto=format&fit=crop",
        }}
        style={styles.carImage}
        resizeMode="cover"
      />
      <View style={styles.carInfo}>
        <View>
          <Text style={styles.carBrandModel}>
            {item.brand} {item.model}
          </Text>
          <Text style={styles.carPlate}>{item.plate}</Text>
        </View>
        <View style={styles.carYearBadge}>
          <Text style={styles.carYearText}>{item.year}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.light.lightBlue, Colors.light.background]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Garajım</Text>
            <Text style={styles.headerSubtitle}>
              {myCars.length} Araç Kayıtlı
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Ionicons name="add" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Car List */}
      <FlatList
        data={myCars}
        renderItem={renderCarItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="car-sport-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>Henüz bir araç eklemediniz.</Text>
            <Text style={styles.emptySubText}>
              "Araç Ekle" butonunu kullanarak başlayın.
            </Text>
          </View>
        }
      />

      {/* --- ADD CAR MODAL --- */}
      <Modal
        visible={isAddModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Araç Ekle</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {isImageLoading ? (
                  <ActivityIndicator
                    size="large"
                    color={Colors.light.primary}
                    style={{ marginTop: 50 }}
                  />
                ) : imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.pickedImage}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons
                      name="camera-outline"
                      size={32}
                      color={Colors.light.primary}
                    />
                    <Text style={styles.imagePlaceholderText}>
                      Araç Fotoğrafı Ekle
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Marka</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: Toyota"
                  value={brand}
                  onChangeText={setBrand}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Model</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: Corolla"
                  value={model}
                  onChangeText={setModel}
                />
              </View>
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.label}>Yıl</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="2023"
                    keyboardType="number-pad"
                    value={year}
                    onChangeText={setYear}
                    maxLength={4}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={styles.label}>Plaka</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="34 ABC 123"
                    autoCapitalize="characters"
                    value={plate}
                    onChangeText={setPlate}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveCar}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- CAR DETAIL MODAL --- */}
      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { height: "80%" }]}>
            {selectedCar && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>
                      {selectedCar.brand} {selectedCar.model}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                      {selectedCar.plate}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={handleDeleteCar}
                      style={{ marginRight: 16 }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={24}
                        color="#DC3545"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setDetailModalVisible(false)}
                    >
                      <Ionicons
                        name="close"
                        size={24}
                        color={Colors.light.text}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      detailTab === "history" && styles.activeTab,
                    ]}
                    onPress={() => setDetailTab("history")}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        detailTab === "history" && styles.activeTabText,
                      ]}
                    >
                      Geçmiş İşlemler
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tabButton,
                      detailTab === "reminders" && styles.activeTab,
                    ]}
                    onPress={() => setDetailTab("reminders")}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        detailTab === "reminders" && styles.activeTabText,
                      ]}
                    >
                      Hatırlatıcılar
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.detailContent}
                  showsVerticalScrollIndicator={false}
                >
                  {detailTab === "history" ? (
                    carJobs.length > 0 ? (
                      carJobs.map((job: Job) => {
                        const mechanic = mechanics.find(
                          (m) => m.id === job.mechanicId
                        );
                        // Tamamlanan işlerde ustanın notunu, diğerlerinde müşteri notunu veya başlığı göster
                        const description =
                          job.status === "completed" && job.workDescription
                            ? job.workDescription
                            : job.customerNote || job.title;

                        return (
                          <View key={job.id} style={styles.historyCard}>
                            {/* Header: Mechanic Name & Date */}
                            <View style={styles.historyHeader}>
                              <View style={styles.mechanicInfo}>
                                <Ionicons
                                  name="person-circle"
                                  size={24}
                                  color={Colors.light.primary}
                                />
                                <Text style={styles.mechanicName}>
                                  {mechanic
                                    ? mechanic.name
                                    : "Bilinmeyen Tamirci"}
                                </Text>
                              </View>
                              <Text style={styles.historyDate}>
                                {new Date(
                                  job.completedAt || job.createdAt
                                ).toLocaleDateString("tr-TR")}
                              </Text>
                            </View>

                            {/* Body: Description */}
                            <View style={styles.historyBody}>
                              <Text style={styles.historyLabel}>Açıklama:</Text>
                              <Text
                                style={styles.historyDescription}
                                numberOfLines={3}
                              >
                                {description}
                              </Text>
                            </View>

                            {/* Footer: Status & Cost */}
                            <View style={styles.historyFooter}>
                              <View
                                style={[
                                  styles.statusBadge,
                                  {
                                    backgroundColor:
                                      job.status === "completed"
                                        ? "#DCFCE7" // Green
                                        : job.status === "pending"
                                        ? "#FEF3C7" // Yellow
                                        : job.status === "rejected" ||
                                          job.status === "cancelled"
                                        ? "#FEE2E2" // Red
                                        : "#DBEAFE", // Blue (Accepted/In Progress)
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.statusText,
                                    {
                                      color:
                                        job.status === "completed"
                                          ? "#166534"
                                          : job.status === "pending"
                                          ? "#92400E"
                                          : job.status === "rejected" ||
                                            job.status === "cancelled"
                                          ? "#991B1B"
                                          : "#1E40AF",
                                    },
                                  ]}
                                >
                                  {job.status === "completed"
                                    ? "Tamamlandı"
                                    : job.status === "pending"
                                    ? "Beklemede"
                                    : job.status === "rejected" ||
                                      job.status === "cancelled"
                                    ? "İptal Edildi"
                                    : "Devam Ediyor"}
                                </Text>
                              </View>
                              {job.cost && (
                                <Text style={styles.historyCost}>
                                  {job.cost} ₺
                                </Text>
                              )}
                            </View>

                            {/* Değerlendirme Butonu (Sadece Tamamlananlar İçin) */}
                            {job.status === "completed" && (
                              <View
                                style={{
                                  marginTop: 12,
                                  alignItems: "flex-end",
                                }}
                              >
                                {job.isRated ? (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: Colors.light.tabIconDefault,
                                        marginRight: 4,
                                        fontSize: 12,
                                      }}
                                    >
                                      Değerlendirildi
                                    </Text>
                                    <Ionicons
                                      name="star"
                                      size={16}
                                      color="#FFD700"
                                    />
                                    <Text
                                      style={{
                                        marginLeft: 4,
                                        fontWeight: "bold",
                                        color: Colors.light.text,
                                      }}
                                    >
                                      {job.rating}
                                    </Text>
                                  </View>
                                ) : (
                                  <TouchableOpacity
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      backgroundColor: Colors.light.primary,
                                      paddingHorizontal: 12,
                                      paddingVertical: 6,
                                      borderRadius: 16,
                                    }}
                                    onPress={() => {
                                      setRatingJobId(job.id);
                                      setRatingModalVisible(true);
                                    }}
                                  >
                                    <Ionicons
                                      name="star-outline"
                                      size={14}
                                      color="white"
                                      style={{ marginRight: 4 }}
                                    />
                                    <Text
                                      style={{
                                        color: "white",
                                        fontSize: 12,
                                        fontWeight: "600",
                                      }}
                                    >
                                      Hizmeti Değerlendir
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            )}
                          </View>
                        );
                      })
                    ) : (
                      <View style={styles.emptyTabState}>
                        <Text style={styles.emptyTabText}>
                          Geçmiş işlem bulunamadı.
                        </Text>
                      </View>
                    )
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.addReminderButton}
                        onPress={() => setReminderModalVisible(true)}
                      >
                        <Ionicons
                          name="add-circle"
                          size={20}
                          color={Colors.light.primary}
                        />
                        <Text style={styles.addReminderText}>
                          Yeni Hatırlatıcı Ekle
                        </Text>
                      </TouchableOpacity>

                      {carReminders.length > 0 ? (
                        carReminders.map((rem: Reminder) => (
                          <TouchableOpacity
                            key={rem.id}
                            style={styles.reminderItem}
                            onPress={() => toggleReminder(rem.id)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name={
                                rem.isCompleted ? "checkbox" : "square-outline"
                              }
                              size={24}
                              color={
                                rem.isCompleted
                                  ? Colors.light.success
                                  : Colors.light.tabIconDefault
                              }
                            />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <Text
                                style={[
                                  styles.reminderTitle,
                                  rem.isCompleted && {
                                    textDecorationLine: "line-through",
                                    color: "#999",
                                  },
                                ]}
                              >
                                {rem.title}
                              </Text>
                              <Text style={styles.reminderDetail}>
                                {rem.dueDate ||
                                  (rem.dueMileage
                                    ? `${rem.dueMileage} km`
                                    : "")}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View style={styles.emptyTabState}>
                          <Text style={styles.emptyTabText}>
                            Hatırlatıcı yok.
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* --- ADD REMINDER MODAL --- */}
      <Modal visible={isReminderModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hatırlatıcı Ekle</Text>
              <TouchableOpacity onPress={() => setReminderModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Başlık</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: Muayene, Sigorta"
                  value={remTitle}
                  onChangeText={setRemTitle}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tarih (Opsiyonel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="GG.AA.YYYY"
                  value={remDate}
                  onChangeText={setRemDate}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Kilometre (Opsiyonel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: 60000"
                  keyboardType="number-pad"
                  value={remMileage}
                  onChangeText={setRemMileage}
                />
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveReminder}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* --- RATING MODAL --- */}
      <Modal
        visible={isRatingModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Hizmeti Değerlendir</Text>
              <TouchableOpacity onPress={() => setRatingModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.formContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRatingScore(star)}
                  >
                    <Ionicons
                      name={star <= ratingScore ? "star" : "star-outline"}
                      size={40}
                      color="#FFD700"
                      style={{ marginHorizontal: 4 }}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Yorumunuz (Opsiyonel)</Text>
                <TextInput
                  style={[
                    styles.input,
                    { height: 80, textAlignVertical: "top" },
                  ]}
                  placeholder="Hizmet nasıldı?"
                  value={ratingComment}
                  onChangeText={setRatingComment}
                  multiline
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleRateJob}
              >
                <Text style={styles.saveButtonText}>Gönder</Text>
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
  lastJobContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  lastJobHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  lastJobLabel: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
  lastJobDetails: {
    paddingLeft: 0,
  },
  lastJobTitle: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    marginBottom: 2,
  },
  lastJobMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastJobDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  lastJobMechanic: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.light.text,
    opacity: 0.7,
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    backgroundColor: "white",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  // Car Card Styles
  carCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  carImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#F0F0F0",
  },
  carInfo: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carBrandModel: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  carPlate: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginTop: 4,
    fontWeight: "500",
  },
  carYearBadge: {
    backgroundColor: Colors.light.lightBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  carYearText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginTop: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  modalSubtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    marginTop: 4,
  },
  // Forms
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  // History Card Styles (New)
  historyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  mechanicInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mechanicName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginLeft: 8,
  },
  historyDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  historyBody: {
    marginBottom: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
  },
  historyLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 4,
  },
  historyDescription: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  historyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  historyCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  ratingContainer: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  ratedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F57F17",
    marginLeft: 4,
  },
  rateButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rateButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  // Inputs & Buttons (Used in Add Car Modal)
  input: {
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.light.text,
  },
  imagePicker: {
    height: 150,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  pickedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Tabs (Used in Detail Modal)
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.tabIconDefault,
  },
  activeTabText: {
    color: Colors.light.primary,
  },
  detailContent: {
    flex: 1,
  },

  // Reminders
  addReminderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderStyle: "dashed",
    borderRadius: 12,
    marginBottom: 16,
  },
  addReminderText: {
    marginLeft: 8,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  reminderItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    marginBottom: 12,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  reminderDetail: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginTop: 2,
  },
  emptyTabState: {
    padding: 40,
    alignItems: "center",
  },
  emptyTabText: {
    color: Colors.light.tabIconDefault,
    fontSize: 14,
  },
});
