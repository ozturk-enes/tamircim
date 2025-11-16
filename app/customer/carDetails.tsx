import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Mock data - In a real app, this would come from a database
const mockCarData = {
  id: "1",
  brand: "Toyota",
  model: "Corolla",
  year: "2020",
  plate: "34 ABC 123",
  color: "Beyaz",
  fuelType: "Benzin",
  transmission: "Manuel",
  mileage: "45000",
  engineSize: "1.6",
  chassisNumber: "JT2BF22K9X0123456",
  notes: "Düzenli bakımı yapılmış, temiz araç",
  inspectionDate: "2024-06-15",
  insuranceDate: "2024-12-30",
};

const mockRepairs = [
  {
    id: "1",
    title: "Fren Balata Değişimi",
    status: "completed",
    date: "2024-01-15",
    cost: "850 TL",
    description: "Ön fren balatalar değiştirildi",
    parts: ["Fren Balata (Ön)", "İş Gücü"],
  },
  {
    id: "2",
    title: "Motor Yağı Değişimi",
    status: "in_progress",
    date: "2024-01-20",
    cost: "320 TL",
    description: "Periyodik motor yağı ve filtre değişimi",
    parts: ["Motor Yağı 5W-30", "Yağ Filtresi"],
  },
  {
    id: "3",
    title: "Klima Gazı Dolumu",
    status: "pending",
    date: "2024-01-25",
    cost: "200 TL",
    description: "Klima sistemi gaz dolumu",
    parts: ["R134a Gaz"],
  },
];

const mockParts = [
  {
    id: "1",
    name: "Fren Balata (Ön)",
    changeDate: "2024-01-15",
    nextChangeKm: "55000",
    status: "good",
  },
  {
    id: "2",
    name: "Motor Yağı",
    changeDate: "2024-01-20",
    nextChangeKm: "50000",
    status: "warning",
  },
  {
    id: "3",
    name: "Lastik (4 Adet)",
    changeDate: "2023-08-10",
    nextChangeKm: "65000",
    status: "critical",
  },
];

const mockMessages = [
  {
    id: "1",
    sender: "mechanic",
    message:
      "Aracınızın fren balataları değiştirildi. Kontrol için 1000 km sonra gelebilirsiniz.",
    time: "14:30",
    date: "2024-01-15",
  },
  {
    id: "2",
    sender: "customer",
    message: "Teşekkürler, frenler çok daha iyi çalışıyor şimdi.",
    time: "16:45",
    date: "2024-01-15",
  },
  {
    id: "3",
    sender: "mechanic",
    message:
      "Motor yağı değişimi için randevu alabilirsiniz. Yaklaşık 5000 km olmuş.",
    time: "10:15",
    date: "2024-01-18",
  },
];

export default function CarDetailsScreen() {
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("info");
  const [newMessage, setNewMessage] = useState("");
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [alarmType, setAlarmType] = useState("");
  const [alarmDate, setAlarmDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCarData, setEditedCarData] = useState(mockCarData);
  const [carImage, setCarImage] = useState<string | null>(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      Alert.alert("Mesaj Gönderildi", "Mesajınız tamirciye iletildi.");
      setNewMessage("");
    }
  };

  const handleAttachFile = () => {
    setShowAttachmentOptions(true);
  };

  const attachPhoto = async () => {
    setShowAttachmentOptions(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      Alert.alert("Fotoğraf Eklendi", "Fotoğraf mesajınıza eklendi.");
    }
  };

  const attachDocument = () => {
    setShowAttachmentOptions(false);
    Alert.alert("Belge Ekle", "Belge ekleme özelliği yakında eklenecek.");
  };

  const handleSetAlarm = () => {
    if (alarmType && alarmDate) {
      Alert.alert(
        "Alarm Oluşturuldu",
        `${alarmType} için ${alarmDate} tarihinde hatırlatma oluşturuldu.`
      );
      setShowAlarmModal(false);
      setAlarmType("");
      setAlarmDate("");
    } else {
      Alert.alert("Hata", "Lütfen alarm türü ve tarih seçin.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    Alert.alert(
      "Değişiklikleri Kaydet",
      "Araç bilgilerini güncellemek istediğinizden emin misiniz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Kaydet",
          onPress: () => {
            // In a real app, this would update the backend
            Alert.alert("Başarılı", "Araç bilgileri güncellendi.");
            setIsEditing(false);
          },
        },
      ]
    );
  };

  const handleCancelEdit = () => {
    setEditedCarData(mockCarData);
    setIsEditing(false);
  };

  const updateCarData = (field: string, value: string) => {
    setEditedCarData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "İzin Gerekli",
        "Fotoğraf seçmek için galeri erişim izni gereklidir."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCarImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "İzin Gerekli",
        "Fotoğraf çekmek için kamera erişim izni gereklidir."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCarImage(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      "Fotoğraf Seç",
      "Araç fotoğrafını nasıl eklemek istiyorsunuz?",
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Galeriden Seç",
          onPress: pickImage,
        },
        {
          text: "Fotoğraf Çek",
          onPress: takePhoto,
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return Colors.light.success;
      case "warning":
        return Colors.light.warning;
      case "critical":
        return Colors.light.error;
      case "completed":
        return Colors.light.success;
      case "in_progress":
        return Colors.light.warning;
      case "pending":
        return Colors.light.tabIconDefault;
      default:
        return Colors.light.tabIconDefault;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "good":
        return "İyi Durumda";
      case "warning":
        return "Dikkat";
      case "critical":
        return "Acil";
      case "completed":
        return "Tamamlandı";
      case "in_progress":
        return "Devam Ediyor";
      case "pending":
        return "Bekliyor";
      default:
        return status;
    }
  };

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      {/* Car Image */}
      <View style={styles.carImageContainer}>
        <TouchableOpacity
          style={styles.carImagePlaceholder}
          onPress={showImagePicker}
          activeOpacity={0.7}
        >
          {carImage ? (
            <Image source={{ uri: carImage }} style={styles.carImage} />
          ) : (
            <>
              <Ionicons
                name="camera"
                size={60}
                color={Colors.light.tabIconDefault}
              />
              <Text style={styles.carImageText}>Araç Fotoğrafı Ekle</Text>
              <Text style={styles.carImageSubtext}>
                Dokunarak fotoğraf ekleyin
              </Text>
            </>
          )}
        </TouchableOpacity>
        {carImage && (
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={showImagePicker}
          >
            <Ionicons name="camera" size={16} color={Colors.light.primary} />
            <Text style={styles.changeImageText}>Fotoğrafı Değiştir</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Basic Info */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Temel Bilgiler</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Marka</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editedCarData.brand}
                onChangeText={(value) => updateCarData("brand", value)}
                placeholder="Marka"
              />
            ) : (
              <Text style={styles.infoValue}>{editedCarData.brand}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Model</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editedCarData.model}
                onChangeText={(value) => updateCarData("model", value)}
                placeholder="Model"
              />
            ) : (
              <Text style={styles.infoValue}>{editedCarData.model}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Yıl</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editedCarData.year}
                onChangeText={(value) => updateCarData("year", value)}
                placeholder="Yıl"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{editedCarData.year}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Plaka</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editedCarData.plate}
                onChangeText={(value) => updateCarData("plate", value)}
                placeholder="Plaka"
              />
            ) : (
              <Text style={styles.infoValue}>{editedCarData.plate}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Renk</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editedCarData.color}
                onChangeText={(value) => updateCarData("color", value)}
                placeholder="Renk"
              />
            ) : (
              <Text style={styles.infoValue}>{editedCarData.color}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Yakıt</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editedCarData.fuelType}
                onChangeText={(value) => updateCarData("fuelType", value)}
                placeholder="Yakıt Türü"
              />
            ) : (
              <Text style={styles.infoValue}>{editedCarData.fuelType}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Vites</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editedCarData.transmission}
                onChangeText={(value) => updateCarData("transmission", value)}
                placeholder="Vites Türü"
              />
            ) : (
              <Text style={styles.infoValue}>{editedCarData.transmission}</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Kilometre</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editedCarData.mileage}
                onChangeText={(value) => updateCarData("mileage", value)}
                placeholder="Kilometre"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{editedCarData.mileage} km</Text>
            )}
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Motor</Text>
            {isEditing ? (
              <TextInput
                style={styles.editInput}
                value={editedCarData.engineSize}
                onChangeText={(value) => updateCarData("engineSize", value)}
                placeholder="Motor Hacmi"
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{editedCarData.engineSize}L</Text>
            )}
          </View>
        </View>
      </View>

      {/* Important Dates */}
      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Önemli Tarihler</Text>
          <TouchableOpacity
            style={styles.alarmButton}
            onPress={() => setShowAlarmModal(true)}
          >
            <Ionicons name="alarm" size={20} color={Colors.light.primary} />
            <Text style={styles.alarmButtonText}>Alarm Ekle</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateCard}>
          <View style={styles.dateItem}>
            <Ionicons
              name="document-text"
              size={24}
              color={Colors.light.primary}
            />
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Muayene Tarihi</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editedCarData.inspectionDate}
                  onChangeText={(value) =>
                    updateCarData("inspectionDate", value)
                  }
                  placeholder="GG.AA.YYYY"
                />
              ) : (
                <Text style={styles.dateValue}>
                  {editedCarData.inspectionDate}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.dateItem}>
            <Ionicons
              name="shield-checkmark"
              size={24}
              color={Colors.light.success}
            />
            <View style={styles.dateInfo}>
              <Text style={styles.dateLabel}>Sigorta Tarihi</Text>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editedCarData.insuranceDate}
                  onChangeText={(value) =>
                    updateCarData("insuranceDate", value)
                  }
                  placeholder="GG.AA.YYYY"
                />
              ) : (
                <Text style={styles.dateValue}>
                  {editedCarData.insuranceDate}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Notes */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Notlar</Text>
        {isEditing ? (
          <TextInput
            style={[styles.editInput, styles.notesInput]}
            value={editedCarData.notes}
            onChangeText={(value) => updateCarData("notes", value)}
            placeholder="Araç hakkında notlar..."
            multiline
            numberOfLines={4}
          />
        ) : (
          <Text style={styles.notesText}>
            {editedCarData.notes || "Not bulunmuyor"}
          </Text>
        )}
      </View>
    </View>
  );

  const renderPartsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Değişen Parçalar</Text>
      {mockParts.map((part) => (
        <View key={part.id} style={styles.partCard}>
          <View style={styles.partHeader}>
            <Text style={styles.partName}>{part.name}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(part.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(part.status)}
              </Text>
            </View>
          </View>
          <View style={styles.partDetails}>
            <View style={styles.partDetailItem}>
              <Ionicons
                name="calendar"
                size={16}
                color={Colors.light.tabIconDefault}
              />
              <Text style={styles.partDetailText}>
                Değişim: {part.changeDate}
              </Text>
            </View>
            <View style={styles.partDetailItem}>
              <Ionicons
                name="speedometer"
                size={16}
                color={Colors.light.tabIconDefault}
              />
              <Text style={styles.partDetailText}>
                Sonraki: {part.nextChangeKm} km
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderRepairsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Tamirler</Text>
      {mockRepairs.map((repair) => (
        <View key={repair.id} style={styles.repairCard}>
          <View style={styles.repairHeader}>
            <Text style={styles.repairTitle}>{repair.title}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(repair.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(repair.status)}
              </Text>
            </View>
          </View>
          <Text style={styles.repairDescription}>{repair.description}</Text>
          <View style={styles.repairDetails}>
            <View style={styles.repairDetailItem}>
              <Ionicons
                name="calendar"
                size={16}
                color={Colors.light.tabIconDefault}
              />
              <Text style={styles.repairDetailText}>{repair.date}</Text>
            </View>
            <View style={styles.repairDetailItem}>
              <Ionicons
                name="cash"
                size={16}
                color={Colors.light.tabIconDefault}
              />
              <Text style={styles.repairDetailText}>{repair.cost}</Text>
            </View>
          </View>
          <View style={styles.partsUsed}>
            <Text style={styles.partsTitle}>Kullanılan Parçalar:</Text>
            {repair.parts.map((part, index) => (
              <Text key={index} style={styles.partItem}>
                • {part}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderMessagesTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Tamirci ile Mesajlaşma</Text>
      <ScrollView
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {mockMessages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageCard,
              message.sender === "customer"
                ? styles.customerMessage
                : styles.mechanicMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.message}</Text>
            <Text style={styles.messageTime}>
              {message.time} - {message.date}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.messageInputContainer}>
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleAttachFile}
        >
          <Ionicons name="add" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <TextInput
          style={styles.messageTextInput}
          placeholder="Mesaj yazın..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
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
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {mockCarData.brand} {mockCarData.model}
            </Text>
            <Text style={styles.headerSubtitle}>{mockCarData.plate}</Text>
          </View>
          {isEditing ? (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEdit}
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
              >
                <Ionicons name="checkmark" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Ionicons name="create" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "info" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("info")}
        >
          <Ionicons
            name="information-circle"
            size={20}
            color={
              activeTab === "info"
                ? Colors.light.primary
                : Colors.light.tabIconDefault
            }
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "info" && styles.activeTabButtonText,
            ]}
          >
            Bilgiler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "parts" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("parts")}
        >
          <Ionicons
            name="construct"
            size={20}
            color={
              activeTab === "parts"
                ? Colors.light.primary
                : Colors.light.tabIconDefault
            }
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "parts" && styles.activeTabButtonText,
            ]}
          >
            Parçalar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "repairs" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("repairs")}
        >
          <Ionicons
            name="build"
            size={20}
            color={
              activeTab === "repairs"
                ? Colors.light.primary
                : Colors.light.tabIconDefault
            }
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "repairs" && styles.activeTabButtonText,
            ]}
          >
            Tamirler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "messages" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("messages")}
        >
          <Ionicons
            name="chatbubbles"
            size={20}
            color={
              activeTab === "messages"
                ? Colors.light.primary
                : Colors.light.tabIconDefault
            }
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "messages" && styles.activeTabButtonText,
            ]}
          >
            Mesajlar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "info" && renderInfoTab()}
        {activeTab === "parts" && renderPartsTab()}
        {activeTab === "repairs" && renderRepairsTab()}
        {activeTab === "messages" && renderMessagesTab()}
      </ScrollView>

      {/* Bottom Quick Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => setActiveTab("messages")}
        >
          <Ionicons name="chatbubbles" size={24} color={Colors.light.primary} />
          <Text style={styles.quickActionText}>Mesajlar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => setActiveTab("repairs")}
        >
          <Ionicons name="build" size={24} color={Colors.light.primary} />
          <Text style={styles.quickActionText}>Son İşlemler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => setShowAlarmModal(true)}
        >
          <Ionicons name="alarm" size={24} color={Colors.light.primary} />
          <Text style={styles.quickActionText}>Alarm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => setActiveTab("parts")}
        >
          <Ionicons name="construct" size={24} color={Colors.light.primary} />
          <Text style={styles.quickActionText}>Parçalar</Text>
        </TouchableOpacity>
      </View>

      {/* Alarm Modal */}
      <Modal
        visible={showAlarmModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAlarmModal(false)}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Alarm Ekle</Text>
            <TouchableOpacity onPress={handleSetAlarm}>
              <Text style={styles.modalSaveText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Alarm Türü</Text>
              <View style={styles.alarmTypes}>
                {["Muayene", "Sigorta", "Periyodik Bakım", "Özel"].map(
                  (type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.alarmTypeButton,
                        alarmType === type && styles.alarmTypeButtonActive,
                      ]}
                      onPress={() => setAlarmType(type)}
                    >
                      <Text
                        style={[
                          styles.alarmTypeText,
                          alarmType === type && styles.alarmTypeTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tarih</Text>
              <TextInput
                style={styles.input}
                value={alarmDate}
                onChangeText={setAlarmDate}
                placeholder="GG.AA.YYYY"
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Attachment Options Modal */}
      <Modal
        visible={showAttachmentOptions}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View style={styles.attachmentModalOverlay}>
          <View style={styles.attachmentModal}>
            <View style={styles.attachmentHeader}>
              <Text style={styles.attachmentTitle}>Dosya Ekle</Text>
              <TouchableOpacity onPress={() => setShowAttachmentOptions(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.attachmentOptions}>
              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={attachPhoto}
              >
                <Ionicons
                  name="camera"
                  size={32}
                  color={Colors.light.primary}
                />
                <Text style={styles.attachmentOptionText}>Fotoğraf</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.attachmentOption}
                onPress={attachDocument}
              >
                <Ionicons
                  name="document"
                  size={32}
                  color={Colors.light.primary}
                />
                <Text style={styles.attachmentOptionText}>Belge</Text>
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
  headerInfo: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  editActions: {
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  editInput: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "white",
    marginTop: 4,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  tabNavigation: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 4,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.primary,
  },
  tabButtonText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    fontWeight: "500",
  },
  activeTabButtonText: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    marginBottom: 80, // Space for bottom actions
  },
  bottomActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  quickActionButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
  },
  quickActionText: {
    fontSize: 11,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  tabContent: {
    padding: 20,
  },
  carImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  carImagePlaceholder: {
    width: 200,
    height: 120,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.border,
    borderStyle: "dashed",
  },
  carImageText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginTop: 8,
    fontWeight: "600",
  },
  carImageSubtext: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginTop: 4,
    opacity: 0.7,
  },
  carImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  changeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.light.lightBlue,
    borderRadius: 20,
    gap: 6,
  },
  changeImageText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  infoItem: {
    width: "47%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  alarmButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.lightBlue,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  alarmButtonText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  dateCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 16,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 2,
  },
  notesText: {
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    lineHeight: 24,
  },
  partCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  partHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  partName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  partDetails: {
    gap: 8,
  },
  partDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  partDetailText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  repairCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  repairHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  repairTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
  },
  repairDescription: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 12,
  },
  repairDetails: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  repairDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  repairDetailText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  partsUsed: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingTop: 12,
  },
  partsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  partItem: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginLeft: 8,
  },
  messagesContainer: {
    maxHeight: 400,
    marginBottom: 16,
  },
  messageCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "80%",
  },
  customerMessage: {
    backgroundColor: Colors.light.primary,
    alignSelf: "flex-end",
  },
  mechanicMessage: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  messageInput: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    padding: 8,
  },
  messageTextInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: Colors.light.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
  modalSaveText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  modalContent: {
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
  alarmTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  alarmTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: "white",
  },
  alarmTypeButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  alarmTypeText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
  },
  alarmTypeTextActive: {
    color: "white",
  },
  attachmentModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  attachmentModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  attachmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  attachmentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  attachmentOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 30,
  },
  attachmentOption: {
    alignItems: "center",
    gap: 12,
  },
  attachmentOptionText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "600",
  },
});
