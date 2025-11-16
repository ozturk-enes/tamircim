import Colors from "@/constants/Colors";
import { mockUsers } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Image,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get("window");

// Type definitions
interface CarData {
  id: number;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  fuelType: string;
  mileage: number;
  lastService: string;
  nextService: string;
  image: string;
  inspectionDate: string;
  insuranceDate: string;
  transmission: string;
  engineSize: string;
  carPhoto?: string;
}

interface AddCarItem {
  id: string;
  isAddCard: true;
}

type ListItem = CarData | AddCarItem;

// Mock car data for the user
const mockUserCars: CarData[] = [
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
    inspectionDate: "2024-12-15",
    insuranceDate: "2024-11-20",
    transmission: "Manuel",
    engineSize: "1.6L",
    carPhoto: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop",
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
    inspectionDate: "2024-10-30",
    insuranceDate: "2024-09-15",
    transmission: "Otomatik",
    engineSize: "2.0L",
    carPhoto: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop",
  },
];

// SVG Avatar Component
const DefaultAvatar = ({ size = 200 }: { size?: number }) => (
  <View style={[styles.avatarSvg, { width: size, height: size }]}>
    <Ionicons name="person" size={size * 0.6} color={Colors.light.primary} />
  </View>
);

export default function CustomerProfileScreen() {
  const [cars, setCars] = useState(mockUserCars);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [editCarModalVisible, setEditCarModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
  const [activeBottomTab, setActiveBottomTab] = useState('recent');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  // Form states
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Mock current user - in real app this would come from auth context
  const currentUser = mockUsers.customers[0];

  const handleSettingsPress = () => {
    setSettingsModalVisible(true);
  };

  const handleAddCarPress = () => {
    router.push("/customer/addCar");
  };

  const handleCarPress = (car: CarData) => {
    setSelectedCar(car);
    setEditCarModalVisible(true);
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    router.replace("/");
  };

  const handleEditProfile = () => {
    setEditForm({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      address: currentUser.address || '',
    });
    setEditProfileModalVisible(true);
    setSettingsModalVisible(false);
  };

  const handleChangePassword = () => {
    setChangePasswordModalVisible(true);
    setSettingsModalVisible(false);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+90\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/;
    return phoneRegex.test(phone);
  };

  const saveProfileChanges = () => {
    if (!editForm.name.trim()) {
      Alert.alert('Hata', 'Ad ve soyad boş olamaz.');
      return;
    }
    if (!validateEmail(editForm.email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin.');
      return;
    }
    if (!validatePhone(editForm.phone)) {
      Alert.alert('Hata', 'Telefon numarası +90 XXX XXX XX XX formatında olmalıdır.');
      return;
    }
    
    Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.');
    setEditProfileModalVisible(false);
  };

  const changePassword = () => {
    if (!passwordForm.currentPassword) {
      Alert.alert('Hata', 'Mevcut şifrenizi girin.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Hata', 'Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
      return;
    }
    
    Alert.alert('Başarılı', 'Şifreniz güncellendi.');
    setChangePasswordModalVisible(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Format as +90 XXX XXX XX XX
    if (cleaned.length >= 10) {
      const formatted = `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
      return formatted;
    }
    return text;
  };

  const handleCarCardPress = (car: CarData) => {
    // Navigate to car details page
    router.push({
      pathname: "/customer/carDetails",
      params: { carId: car.id.toString() }
    });
  };

  const renderCarCard = ({ item }: { item: CarData }) => (
    <View style={styles.carCardContainer}>
      <TouchableOpacity 
        style={styles.carCardBackground}
        onPress={() => handleCarCardPress(item)}
        activeOpacity={0.9}
      >
        {item.carPhoto ? (
          <Image source={{ uri: item.carPhoto }} style={styles.carBackgroundImage} />
        ) : (
          <LinearGradient
            colors={[Colors.light.primary, Colors.light.lightBlue]}
            style={styles.carBackgroundGradient}
          />
        )}
        <BlurView intensity={20} style={styles.carCardBlur}>
          <View style={styles.carInfoCard}>
            <View style={styles.carCardHeader}>
              <View style={styles.carTitleSection}>
                <Text style={styles.carBrandModel}>{item.brand} {item.model}</Text>
                <Text style={styles.carYear}>{item.year}</Text>
              </View>
              <TouchableOpacity
                style={styles.editCarButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleCarPress(item);
                }}
              >
                <Ionicons name="create-outline" size={24} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.carDetailsGrid}>
              <View style={styles.carDetailRow}>
                <View style={styles.carDetailItem}>
                  <Text style={styles.carDetailLabel}>Vites</Text>
                  <Text style={styles.carDetailValue}>{item.transmission}</Text>
                </View>
                <View style={styles.carDetailItem}>
                  <Text style={styles.carDetailLabel}>Motor</Text>
                  <Text style={styles.carDetailValue}>{item.engineSize}</Text>
                </View>
              </View>
              
              <View style={styles.carDetailRow}>
                <View style={styles.carDetailItem}>
                  <Text style={styles.carDetailLabel}>Plaka</Text>
                  <Text style={styles.carDetailValue}>{item.plate}</Text>
                </View>
                <View style={styles.carDetailItem}>
                  <Text style={styles.carDetailLabel}>Yakıt</Text>
                  <Text style={styles.carDetailValue}>{item.fuelType}</Text>
                </View>
              </View>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
      
      {/* Bottom Menu for Car Details */}
      <View style={styles.bottomMenuContainer}>
        <TouchableOpacity
          style={[styles.bottomMenuItem, activeBottomTab === 'recent' && styles.bottomMenuItemActive]}
          onPress={() => setActiveBottomTab('recent')}
        >
          <Ionicons 
            name="time-outline" 
            size={24} 
            color={activeBottomTab === 'recent' ? Colors.light.primary : Colors.light.tabIconDefault} 
          />
          <Text style={[styles.bottomMenuText, activeBottomTab === 'recent' && styles.bottomMenuTextActive]}>
            Son İşlemler
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.bottomMenuItem, activeBottomTab === 'parts' && styles.bottomMenuItemActive]}
          onPress={() => setActiveBottomTab('parts')}
        >
          <Ionicons 
            name="build-outline" 
            size={24} 
            color={activeBottomTab === 'parts' ? Colors.light.primary : Colors.light.tabIconDefault} 
          />
          <Text style={[styles.bottomMenuText, activeBottomTab === 'parts' && styles.bottomMenuTextActive]}>
            Değişen Parçalar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.bottomMenuItem, activeBottomTab === 'messages' && styles.bottomMenuItemActive]}
          onPress={() => setActiveBottomTab('messages')}
        >
          <Ionicons 
            name="chatbubble-outline" 
            size={24} 
            color={activeBottomTab === 'messages' ? Colors.light.primary : Colors.light.tabIconDefault} 
          />
          <Text style={[styles.bottomMenuText, activeBottomTab === 'messages' && styles.bottomMenuTextActive]}>
            Mesajlar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.bottomMenuItem, activeBottomTab === 'alarms' && styles.bottomMenuItemActive]}
          onPress={() => setActiveBottomTab('alarms')}
        >
          <Ionicons 
            name="notifications-outline" 
            size={24} 
            color={activeBottomTab === 'alarms' ? Colors.light.primary : Colors.light.tabIconDefault} 
          />
          <Text style={[styles.bottomMenuText, activeBottomTab === 'alarms' && styles.bottomMenuTextActive]}>
            Alarmlar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddCarCard = () => (
    <TouchableOpacity
      style={styles.addCarCard}
      onPress={handleAddCarPress}
      activeOpacity={0.7}
    >
      <View style={styles.addCarContent}>
        <View style={styles.addCarIconContainer}>
          <Ionicons name="add" size={32} color={Colors.light.primary} />
        </View>
        <Text style={styles.addCarText}>Yeni Araç Ekle</Text>
        <Text style={styles.addCarSubtext}>Araç bilgilerinizi ekleyin</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.primary} />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Enhanced Profile Header */}
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.lightBlue]}
          style={styles.header}
        >
          <View style={styles.profileSection}>
            {/* Profile Photo Section */}
            <View style={styles.profilePhotoSection}>
              <TouchableOpacity style={styles.profilePhotoContainer}>
                {profilePhoto ? (
                  <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
                ) : (
                  <DefaultAvatar size={200} />
                )}
                <View style={styles.photoEditOverlay}>
                  <Ionicons name="camera" size={24} color="white" />
                </View>
              </TouchableOpacity>
            </View>
            
            {/* Personal Information Grid */}
            <View style={styles.personalInfoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.userName}>{currentUser.name}</Text>
                <View style={styles.verificationBadge}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                </View>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="call" size={16} color="white" />
                <Text style={styles.infoText}>+90 532 123 45 67</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="mail" size={16} color="white" />
                <Text style={styles.infoText}>{currentUser.email}</Text>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="location" size={16} color="white" />
                <Text style={styles.infoText}>
                  Kadıköy, İstanbul{'\n'}Fenerbahçe Mahallesi, Bağdat Caddesi No: 123
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Cars Section */}
          <View style={styles.carsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Araçlarım</Text>
              <Text style={styles.sectionSubtitle}>
                {cars.length} araç kayıtlı
              </Text>
            </View>

            <FlatList<ListItem>
              data={[...cars, { id: "add-car", isAddCard: true as const }]}
              renderItem={({ item }) =>
                "isAddCard" in item ? renderAddCarCard() : renderCarCard({ item })
              }
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              numColumns={1}
            />
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button for Settings */}
      <TouchableOpacity
        style={styles.floatingActionButton}
        onPress={handleSettingsPress}
        activeOpacity={0.8}
      >
        <Ionicons name="settings" size={28} color="white" />
      </TouchableOpacity>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ayarlar</Text>
              <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingsOptions}>
              <TouchableOpacity style={styles.settingsOption} onPress={handleEditProfile}>
                <Ionicons name="person-outline" size={24} color={Colors.light.primary} />
                <Text style={styles.settingsOptionText}>Profil Bilgilerini Düzenle</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsOption}>
                <Ionicons name="camera-outline" size={24} color={Colors.light.primary} />
                <Text style={styles.settingsOptionText}>Profil Fotoğrafı Yükle</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsOption} onPress={handleChangePassword}>
                <Ionicons name="lock-closed-outline" size={24} color={Colors.light.primary} />
                <Text style={styles.settingsOptionText}>Şifre Değiştir</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsOption}>
                <Ionicons name="location-outline" size={24} color={Colors.light.primary} />
                <Text style={styles.settingsOptionText}>Konum İzinleri</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsOption}>
                <Ionicons name="notifications-outline" size={24} color={Colors.light.primary} />
                <Text style={styles.settingsOptionText}>Bildirim Tercihleri</Text>
                <Ionicons name="chevron-forward" size={20} color={Colors.light.tabIconDefault} />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.settingsOption, styles.logoutOption]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#FF4444" />
                <Text style={[styles.settingsOptionText, styles.logoutText]}>Çıkış Yap</Text>
                <Ionicons name="chevron-forward" size={20} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationModal}>
            <View style={styles.confirmationContent}>
              <Ionicons name="log-out-outline" size={48} color="#FF4444" />
              <Text style={styles.confirmationTitle}>Çıkış Yap</Text>
              <Text style={styles.confirmationMessage}>
                Çıkış yapmak istediğinize emin misiniz?
              </Text>
            </View>
            
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmationButton, styles.logoutButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editProfileModalVisible}
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profil Bilgilerini Düzenle</Text>
              <TouchableOpacity onPress={() => setEditProfileModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Ad ve Soyad *</Text>
                <TextInput
                  style={styles.formInput}
                  value={editForm.name}
                  onChangeText={(text) => setEditForm({...editForm, name: text})}
                  placeholder="Ad ve soyadınızı girin"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>E-posta Adresi *</Text>
                <TextInput
                  style={styles.formInput}
                  value={editForm.email}
                  onChangeText={(text) => setEditForm({...editForm, email: text})}
                  placeholder="E-posta adresinizi girin"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Telefon Numarası *</Text>
                <TextInput
                  style={styles.formInput}
                  value={editForm.phone}
                  onChangeText={(text) => setEditForm({...editForm, phone: formatPhoneNumber(text)})}
                  placeholder="+90 XXX XXX XX XX"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Adres</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={editForm.address}
                  onChangeText={(text) => setEditForm({...editForm, address: text})}
                  placeholder="Adresinizi girin"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>
            
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelFormButton]}
                onPress={() => setEditProfileModalVisible(false)}
              >
                <Text style={styles.cancelFormButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.formButton, styles.saveFormButton]}
                onPress={saveProfileChanges}
              >
                <Text style={styles.saveFormButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModalVisible}
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Şifre Değiştir</Text>
              <TouchableOpacity onPress={() => setChangePasswordModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.formContent}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Mevcut Şifre *</Text>
                <TextInput
                  style={styles.formInput}
                  value={passwordForm.currentPassword}
                  onChangeText={(text) => setPasswordForm({...passwordForm, currentPassword: text})}
                  placeholder="Mevcut şifrenizi girin"
                  secureTextEntry
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Yeni Şifre *</Text>
                <TextInput
                  style={styles.formInput}
                  value={passwordForm.newPassword}
                  onChangeText={(text) => setPasswordForm({...passwordForm, newPassword: text})}
                  placeholder="Yeni şifrenizi girin"
                  secureTextEntry
                />
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Yeni Şifre Tekrar *</Text>
                <TextInput
                  style={styles.formInput}
                  value={passwordForm.confirmPassword}
                  onChangeText={(text) => setPasswordForm({...passwordForm, confirmPassword: text})}
                  placeholder="Yeni şifrenizi tekrar girin"
                  secureTextEntry
                />
              </View>
            </ScrollView>
            
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelFormButton]}
                onPress={() => setChangePasswordModalVisible(false)}
              >
                <Text style={styles.cancelFormButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.formButton, styles.saveFormButton]}
                onPress={changePassword}
              >
                <Text style={styles.saveFormButtonText}>Değiştir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Car Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editCarModalVisible}
        onRequestClose={() => setEditCarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.carDetailModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Araç Detayları</Text>
              <TouchableOpacity onPress={() => setEditCarModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
            
            {selectedCar && (
              <ScrollView style={styles.carDetailContent}>
                {/* Araç Fotoğrafı */}
                {selectedCar.carPhoto && (
                  <Image source={{ uri: selectedCar.carPhoto }} style={styles.carDetailImage} />
                )}
                
                {/* Araç Bilgileri */}
                <View style={styles.carDetailInfo}>
                  <Text style={styles.carDetailTitle}>{selectedCar.brand} {selectedCar.model}</Text>
                  <Text style={styles.carDetailSubtitle}>{selectedCar.year} Model</Text>
                  
                  <View style={styles.carDetailGrid}>
                    <View style={styles.carDetailItem}>
                      <Text style={styles.carDetailLabel}>Marka/Model:</Text>
                      <Text style={styles.carDetailValue}>{selectedCar.brand} {selectedCar.model}</Text>
                    </View>
                    
                    <View style={styles.carDetailItem}>
                      <Text style={styles.carDetailLabel}>Yıl:</Text>
                      <Text style={styles.carDetailValue}>{selectedCar.year}</Text>
                    </View>
                    
                    <View style={styles.carDetailItem}>
                      <Text style={styles.carDetailLabel}>Yakıt Türü:</Text>
                      <Text style={styles.carDetailValue}>{selectedCar.fuelType}</Text>
                    </View>
                    
                    <View style={styles.carDetailItem}>
                      <Text style={styles.carDetailLabel}>Motor Bilgisi:</Text>
                      <Text style={styles.carDetailValue}>{selectedCar.engineSize}</Text>
                    </View>
                    
                    <View style={styles.carDetailItem}>
                      <Text style={styles.carDetailLabel}>Vites Tipi:</Text>
                      <Text style={styles.carDetailValue}>{selectedCar.transmission}</Text>
                    </View>
                    
                    <View style={styles.carDetailItem}>
                      <Text style={styles.carDetailLabel}>Plaka:</Text>
                      <Text style={styles.carDetailValue}>{selectedCar.plate}</Text>
                    </View>
                  </View>
                </View>
                
                {/* Alt Menü - 4 İkon */}
                <View style={styles.carDetailBottomMenu}>
                  <TouchableOpacity
                    style={[styles.bottomMenuItem, activeBottomTab === 'messages' && styles.bottomMenuItemActive]}
                    onPress={() => setActiveBottomTab('messages')}
                  >
                    <Ionicons 
                      name="chatbubble-outline" 
                      size={24} 
                      color={activeBottomTab === 'messages' ? Colors.light.primary : Colors.light.tabIconDefault} 
                    />
                    <Text style={[styles.bottomMenuText, activeBottomTab === 'messages' && styles.bottomMenuTextActive]}>
                      Mesaj Kutusu
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.bottomMenuItem, activeBottomTab === 'recent' && styles.bottomMenuItemActive]}
                    onPress={() => setActiveBottomTab('recent')}
                  >
                    <Ionicons 
                      name="time-outline" 
                      size={24} 
                      color={activeBottomTab === 'recent' ? Colors.light.primary : Colors.light.tabIconDefault} 
                    />
                    <Text style={[styles.bottomMenuText, activeBottomTab === 'recent' && styles.bottomMenuTextActive]}>
                      Son İşlemler
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.bottomMenuItem, activeBottomTab === 'parts' && styles.bottomMenuItemActive]}
                    onPress={() => setActiveBottomTab('parts')}
                  >
                    <Ionicons 
                      name="build-outline" 
                      size={24} 
                      color={activeBottomTab === 'parts' ? Colors.light.primary : Colors.light.tabIconDefault} 
                    />
                    <Text style={[styles.bottomMenuText, activeBottomTab === 'parts' && styles.bottomMenuTextActive]}>
                      Değişen Parçalar
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.bottomMenuItem, activeBottomTab === 'alarms' && styles.bottomMenuItemActive]}
                    onPress={() => setActiveBottomTab('alarms')}
                  >
                    <Ionicons 
                      name="notifications-outline" 
                      size={24} 
                      color={activeBottomTab === 'alarms' ? Colors.light.primary : Colors.light.tabIconDefault} 
                    />
                    <Text style={[styles.bottomMenuText, activeBottomTab === 'alarms' && styles.bottomMenuTextActive]}>
                      Alarm
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
            
            <View style={styles.carDetailButtons}>
              <TouchableOpacity
                style={[styles.carDetailButton, styles.editCarDetailButton]}
                onPress={() => {
                  // Edit car functionality
                  Alert.alert('Düzenle', 'Araç bilgilerini düzenleme özelliği yakında eklenecek.');
                }}
              >
                <Ionicons name="create-outline" size={20} color="white" />
                <Text style={styles.editCarDetailButtonText}>Düzenle</Text>
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
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  // Yeni profil container tasarımı
  profileSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  // Sol taraf - Profil fotoğrafı
  profilePhotoSection: {
    marginRight: 15,
  },
  profilePhotoContainer: {
    position: 'relative',
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
  photoEditOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  avatarSvg: {
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  // Sağ taraf - Kişisel bilgiler grid
  personalInfoGrid: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
  },
  verificationBadge: {
    marginLeft: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    flex: 1,
  },
  // Floating Action Button
  floatingActionButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // FAB için alan bırak
  },
  carsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  // Yeni araç kartı container tasarımı
  carCardContainer: {
    marginBottom: 20,
  },
  carCardBackground: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  carBackgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  carBackgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  carCardBlur: {
    padding: 20,
    minHeight: 180,
  },
  carInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 16,
  },
  carCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  carTitleSection: {
    flex: 1,
  },
  carBrandModel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 2,
  },
  carYear: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
  },
  editCarButton: {
    backgroundColor: Colors.light.lightBlue,
    borderRadius: 8,
    padding: 8,
  },
  carDetailsGrid: {
    gap: 12,
  },
  carDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  carDetailItem: {
    flex: 1,
    backgroundColor: Colors.light.lightGray,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  carDetailLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
    marginBottom: 2,
  },
  carDetailValue: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Bottom Menu Container
  bottomMenuContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  bottomMenuItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  bottomMenuItemActive: {
    backgroundColor: Colors.light.lightBlue,
    borderRadius: 10,
    margin: 4,
  },
  bottomMenuText: {
    fontSize: 11,
    color: Colors.light.tabIconDefault,
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomMenuTextActive: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  addCarCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderStyle: 'dashed',
  },
  addCarContent: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCarIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  addCarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 5,
  },
  addCarSubtext: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  settingsOptions: {
    gap: 5,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  settingsOptionText: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 15,
    flex: 1,
  },
  logoutOption: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.lightGray,
    paddingTop: 20,
  },
  logoutText: {
    color: '#FF4444',
  },
  confirmationModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: width * 0.85,
    alignItems: 'center',
  },
  confirmationContent: {
    alignItems: 'center',
    marginBottom: 30,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 15,
    marginBottom: 10,
  },
  confirmationMessage: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    lineHeight: 22,
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
  },
  confirmationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.light.lightGray,
  },
  logoutButton: {
    backgroundColor: '#FF4444',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  formModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  formContent: {
    maxHeight: height * 0.5,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: Colors.light.lightGray,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelFormButton: {
    backgroundColor: Colors.light.lightGray,
  },
  saveFormButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelFormButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  saveFormButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  // Araç detay modal stilleri
  carDetailModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width * 0.95,
    maxHeight: height * 0.9,
  },
  carDetailContent: {
    maxHeight: height * 0.65,
  },
  carDetailImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  carDetailInfo: {
    marginBottom: 20,
  },
  carDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 5,
  },
  carDetailSubtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    marginBottom: 20,
  },
  carDetailGrid: {
    gap: 15,
  },
  // Alt menü stilleri
  carDetailBottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: Colors.light.lightGray,
    borderRadius: 15,
    marginTop: 20,
  },
  carDetailButtons: {
    marginTop: 20,
  },
  carDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  editCarDetailButton: {
    backgroundColor: Colors.light.primary,
  },
  editCarDetailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
