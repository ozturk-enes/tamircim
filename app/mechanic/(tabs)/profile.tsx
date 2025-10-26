import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

// Mock data for mechanic profile
const mechanicProfile = {
  id: '1',
  name: 'Ahmet Yılmaz',
  email: 'ahmet.yilmaz@email.com',
  phone: '+90 532 123 45 67',
  address: 'Kadıköy, İstanbul',
  specialties: ['Motor', 'Fren', 'Elektrik', 'Klima'],
  rating: 4.8,
  completedJobs: 156,
  priceRange: '₺150-300',
  workingHours: '08:00 - 18:00',
  experience: '8 yıl',
  isOnline: true,
};

// Mock data for cars to be repaired
const mockCarsToRepair = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2018,
    plate: '34 ABC 123',
    customerName: 'Mehmet Demir',
    customerPhone: '+90 532 987 65 43',
    problem: 'Motor arızası, çalışmıyor',
    priority: 'high',
    addedDate: '2024-01-15',
    estimatedPrice: '₺800',
    status: 'waiting',
  },
  {
    id: '2',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2020,
    plate: '06 XYZ 789',
    customerName: 'Ayşe Kaya',
    customerPhone: '+90 533 456 78 90',
    problem: 'Fren balata değişimi',
    priority: 'medium',
    addedDate: '2024-01-16',
    estimatedPrice: '₺350',
    status: 'waiting',
  },
  {
    id: '3',
    brand: 'BMW',
    model: '3 Series',
    year: 2019,
    plate: '35 BMW 456',
    customerName: 'Ali Özkan',
    customerPhone: '+90 534 123 45 67',
    problem: 'Klima çalışmıyor',
    priority: 'low',
    addedDate: '2024-01-17',
    estimatedPrice: '₺450',
    status: 'in_progress',
  },
];

// Mock data for customer messages
const mockMessages = [
  {
    id: '1',
    customerName: 'Mehmet Demir',
    message: 'Merhaba, aracımın motor arızası için ne zaman bakabilirsiniz?',
    time: '14:30',
    isRead: false,
    carPlate: '34 ABC 123',
  },
  {
    id: '2',
    customerName: 'Ayşe Kaya',
    message: 'Fren balata işi ne kadar sürer?',
    time: '13:15',
    isRead: true,
    carPlate: '06 XYZ 789',
  },
  {
    id: '3',
    customerName: 'Ali Özkan',
    message: 'Klima tamiri tamamlandı mı?',
    time: '12:45',
    isRead: false,
    carPlate: '35 BMW 456',
  },
];

// Mock data for new customer offers
const mockOffers = [
  {
    id: '1',
    customerName: 'Fatma Çelik',
    carInfo: '2017 Ford Focus - 34 DEF 456',
    problem: 'Transmisyon arızası',
    offeredPrice: '₺600',
    location: 'Üsküdar, İstanbul',
    distance: '2.3 km',
    urgency: 'high',
    time: '10 dk önce',
  },
  {
    id: '2',
    customerName: 'Hasan Kara',
    carInfo: '2019 Renault Clio - 06 REN 789',
    problem: 'Lastik değişimi',
    offeredPrice: '₺200',
    location: 'Beşiktaş, İstanbul',
    distance: '1.8 km',
    urgency: 'medium',
    time: '25 dk önce',
  },
];

// Mock data for active jobs
const mockActiveJobs = [
  {
    id: '1',
    customerName: 'Ali Özkan',
    carInfo: '2019 BMW 3 Series - 35 BMW 456',
    problem: 'Klima çalışmıyor',
    startDate: '2024-01-17',
    estimatedCompletion: '2024-01-18',
    price: '₺450',
    progress: 75,
    status: 'in_progress',
  },
  {
    id: '2',
    customerName: 'Zeynep Yıldız',
    carInfo: '2020 Honda Civic - 34 HON 123',
    problem: 'Fren sistemi bakımı',
    startDate: '2024-01-16',
    estimatedCompletion: '2024-01-17',
    price: '₺300',
    progress: 90,
    status: 'almost_done',
  },
];

export default function MechanicProfileScreen() {
  const [isOnline, setIsOnline] = useState(mechanicProfile.isOnline);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [newCarData, setNewCarData] = useState({
    brand: '',
    model: '',
    year: '',
    plate: '',
    customerName: '',
    customerPhone: '',
    problem: '',
    estimatedPrice: '',
  });

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: () => {
            router.replace('/');
          }
        },
      ]
    );
  };

  const handleAddCar = () => {
    if (!newCarData.brand || !newCarData.model || !newCarData.plate || !newCarData.customerName) {
      Alert.alert('Hata', 'Lütfen gerekli alanları doldurun.');
      return;
    }
    
    Alert.alert('Başarılı', 'Araç başarıyla eklendi!');
    setShowAddCarModal(false);
    setNewCarData({
      brand: '',
      model: '',
      year: '',
      plate: '',
      customerName: '',
      customerPhone: '',
      problem: '',
      estimatedPrice: '',
    });
  };

  const handleOfferAction = (offerId: string, action: 'accept' | 'reject') => {
    const offer = mockOffers.find(o => o.id === offerId);
    if (action === 'accept') {
      Alert.alert('Teklif Kabul Edildi', `${offer?.customerName} müşterisinin teklifi kabul edildi. Müşteri ile iletişime geçebilirsiniz.`);
    } else {
      Alert.alert('Teklif Reddedildi', `${offer?.customerName} müşterisinin teklifi reddedildi.`);
    }
    setShowOffersModal(false);
  };

  const handleMessagePress = (message: any) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  const handleJobComplete = (jobId: string) => {
    Alert.alert(
      'İş Tamamla',
      'Bu işi tamamladığınızı onaylıyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Tamamla', onPress: () => Alert.alert('Başarılı', 'İş tamamlandı!') },
      ]
    );
  };

  const unreadMessagesCount = mockMessages.filter(m => !m.isRead).length;
  const pendingOffersCount = mockOffers.length;

  const renderCarCard = ({ item }: { item: any }) => (
    <View style={styles.carCard}>
      <View style={styles.carHeader}>
        <View style={styles.carMainInfo}>
          <Text style={styles.carTitle}>{item.brand} {item.model} ({item.year})</Text>
          <Text style={styles.carPlate}>{item.plate}</Text>
          <Text style={styles.customerName}>{item.customerName}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: 
          item.priority === 'high' ? Colors.light.error : 
          item.priority === 'medium' ? Colors.light.warning : Colors.light.success 
        }]}>
          <Text style={styles.priorityText}>
            {item.priority === 'high' ? 'Acil' : item.priority === 'medium' ? 'Orta' : 'Düşük'}
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
            <Text style={styles.userName}>{mechanicProfile.name}</Text>
            <Text style={styles.userEmail}>{mechanicProfile.email}</Text>
            <Text style={styles.userPhone}>{mechanicProfile.phone}</Text>
            <Text style={styles.userAddress}>{mechanicProfile.address}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create" size={20} color={Colors.light.secondary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Online Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: isOnline ? Colors.light.success : Colors.light.error }]} />
              <Text style={styles.statusText}>{isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}</Text>
            </View>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: Colors.light.tabIconDefault, true: Colors.light.success }}
              thumbColor={isOnline ? 'white' : '#f4f3f4'}
            />
          </View>
          <Text style={styles.statusDescription}>
            {isOnline ? 'Müşteriler sizi görebilir ve iş teklifi gönderebilir.' : 'Müşteriler sizi göremez.'}
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mechanicProfile.rating}</Text>
            <Text style={styles.statLabel}>Puan</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mechanicProfile.completedJobs}</Text>
            <Text style={styles.statLabel}>Tamamlanan İş</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mechanicProfile.experience}</Text>
            <Text style={styles.statLabel}>Deneyim</Text>
          </View>
        </View>

        {/* Price Range & Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hizmet Bilgileri</Text>
          <View style={styles.serviceCard}>
            <View style={styles.serviceRow}>
              <Ionicons name="pricetag" size={20} color={Colors.light.secondary} />
              <Text style={styles.serviceLabel}>Fiyat Aralığı:</Text>
              <Text style={styles.serviceValue}>{mechanicProfile.priceRange}</Text>
            </View>
            <View style={styles.serviceRow}>
              <Ionicons name="time" size={20} color={Colors.light.secondary} />
              <Text style={styles.serviceLabel}>Çalışma Saatleri:</Text>
              <Text style={styles.serviceValue}>{mechanicProfile.workingHours}</Text>
            </View>
          </View>
          
          <View style={styles.specialtiesContainer}>
            {mechanicProfile.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowAddCarModal(true)}
            >
              <Ionicons name="car-sport" size={24} color="white" />
              <Text style={styles.actionButtonText}>Araç Ekle</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.light.primary }]}
              onPress={() => setShowMessageModal(true)}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons name="chatbubbles" size={24} color="white" />
                {unreadMessagesCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadMessagesCount}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.actionButtonText}>Mesajlar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: Colors.light.warning }]}
              onPress={() => setShowOffersModal(true)}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons name="notifications" size={24} color="white" />
                {pendingOffersCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{pendingOffersCount}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.actionButtonText}>Teklifler</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cars to Repair */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tamir Edilecek Araçlar ({mockCarsToRepair.length})</Text>
          <FlatList
            data={mockCarsToRepair}
            renderItem={renderCarCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Active Jobs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktif İşler ({mockActiveJobs.length})</Text>
          <FlatList
            data={mockActiveJobs}
            renderItem={renderActiveJob}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={Colors.light.error} />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>

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
                  onChangeText={(text) => setNewCarData({...newCarData, brand: text})}
                  placeholder="Örn: Toyota"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Model</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.model}
                  onChangeText={(text) => setNewCarData({...newCarData, model: text})}
                  placeholder="Örn: Corolla"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Yıl</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.year}
                  onChangeText={(text) => setNewCarData({...newCarData, year: text})}
                  placeholder="Örn: 2020"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Plaka</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.plate}
                  onChangeText={(text) => setNewCarData({...newCarData, plate: text})}
                  placeholder="Örn: 34 ABC 123"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Müşteri Adı</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.customerName}
                  onChangeText={(text) => setNewCarData({...newCarData, customerName: text})}
                  placeholder="Müşteri adı"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Müşteri Telefonu</Text>
                <TextInput
                  style={styles.input}
                  value={newCarData.customerPhone}
                  onChangeText={(text) => setNewCarData({...newCarData, customerPhone: text})}
                  placeholder="+90 5XX XXX XX XX"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Sorun Açıklaması</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newCarData.problem}
                  onChangeText={(text) => setNewCarData({...newCarData, problem: text})}
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
                  onChangeText={(text) => setNewCarData({...newCarData, estimatedPrice: text})}
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
                  style={[styles.messageCard, !item.isRead && styles.unreadMessage]}
                  onPress={() => handleMessagePress(item)}
                >
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageSender}>{item.customerName}</Text>
                    <Text style={styles.messageTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.messageCarPlate}>{item.carPlate}</Text>
                  <Text style={styles.messageText} numberOfLines={2}>{item.message}</Text>
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
                    <Text style={styles.offerCustomer}>{item.customerName}</Text>
                    <Text style={styles.offerTime}>{item.time}</Text>
                  </View>
                  <Text style={styles.offerCarInfo}>{item.carInfo}</Text>
                  <Text style={styles.offerProblem}>{item.problem}</Text>
                  <View style={styles.offerDetails}>
                    <Text style={styles.offerPrice}>{item.offeredPrice}</Text>
                    <Text style={styles.offerLocation}>{item.location} ({item.distance})</Text>
                  </View>
                  <View style={styles.offerActions}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleOfferAction(item.id, 'reject')}
                    >
                      <Text style={styles.rejectButtonText}>Reddet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.acceptButton}
                      onPress={() => handleOfferAction(item.id, 'accept')}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: 'white',
    opacity: 0.8,
    marginBottom: 2,
  },
  userAddress: {
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  statusDescription: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    color: Colors.light.secondary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  serviceLabel: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: '500',
    flex: 1,
  },
  serviceValue: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: 'bold',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonContent: {
    position: 'relative',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.light.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  carCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  carMainInfo: {
    flex: 1,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: '600',
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
    fontWeight: 'bold',
    color: 'white',
  },
  carProblem: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 20,
  },
  carFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimatedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.secondary,
  },
  addedDate: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  jobCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobCustomer: {
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: Colors.light.secondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    height: '100%',
    backgroundColor: Colors.light.secondary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.secondary,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontWeight: '600',
    color: 'white',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.error,
    gap: 12,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    fontWeight: '600',
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
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.light.lightOrange,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.secondary,
  },
  saveButton: {
    backgroundColor: Colors.light.secondary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  messageCard: {
    backgroundColor: Colors.light.lightOrange,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
  },
  unreadMessage: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  messageCarPlate: {
    fontSize: 12,
    color: Colors.light.secondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  unreadDot: {
    position: 'absolute',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerCustomer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  offerTime: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  offerCarInfo: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  offerProblem: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
  },
  offerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.secondary,
  },
  offerLocation: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  offerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.error,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.error,
  },
  acceptButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.secondary,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});