import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

// Mock comprehensive car data
const mockCarData = {
  id: 1,
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  plate: '34 ABC 123',
  color: 'Beyaz',
  fuelType: 'Benzin',
  mileage: 45000,
  lastService: '2024-01-15',
  nextService: '2024-07-15',
  image: '🚗',
  specifications: {
    engine: '1.6L 4 Silindir',
    power: '132 HP',
    transmission: 'CVT Otomatik',
    fuelCapacity: '50 L',
    fuelConsumption: '6.2 L/100km',
    maxSpeed: '180 km/h',
    acceleration: '10.2 sn (0-100)',
    weight: '1320 kg',
    dimensions: '4630x1780x1435 mm',
  },
  repairHistory: [
    {
      id: 1,
      date: '2024-01-15',
      type: 'Periyodik Bakım',
      mechanic: 'Mehmet Usta',
      cost: 450,
      description: 'Motor yağı değişimi, filtre değişimi, genel kontrol',
      parts: ['Motor Yağı', 'Yağ Filtresi', 'Hava Filtresi'],
      mileage: 45000,
    },
    {
      id: 2,
      date: '2023-10-20',
      type: 'Fren Sistemi',
      mechanic: 'Ali Tamirci',
      cost: 320,
      description: 'Ön fren balata değişimi',
      parts: ['Fren Balata Takımı'],
      mileage: 42000,
    },
    {
      id: 3,
      date: '2023-07-10',
      type: 'Lastik Değişimi',
      mechanic: 'Veli Oto',
      cost: 800,
      description: '4 adet lastik değişimi',
      parts: ['Lastik x4'],
      mileage: 40000,
    },
  ],
  changedParts: [
    {
      id: 1,
      name: 'Motor Yağı',
      changeDate: '2024-01-15',
      nextChange: '2024-07-15',
      mileage: 45000,
      nextMileage: 50000,
      status: 'good',
    },
    {
      id: 2,
      name: 'Fren Balata',
      changeDate: '2023-10-20',
      nextChange: '2024-10-20',
      mileage: 42000,
      nextMileage: 60000,
      status: 'good',
    },
    {
      id: 3,
      name: 'Lastik',
      changeDate: '2023-07-10',
      nextChange: '2025-07-10',
      mileage: 40000,
      nextMileage: 80000,
      status: 'good',
    },
    {
      id: 4,
      name: 'Akü',
      changeDate: '2022-05-15',
      nextChange: '2025-05-15',
      mileage: 35000,
      nextMileage: 70000,
      status: 'warning',
    },
  ],
  reminders: [
    {
      id: 1,
      title: 'Periyodik Bakım',
      dueDate: '2024-07-15',
      dueMileage: 50000,
      type: 'service',
      priority: 'medium',
      description: 'Motor yağı ve filtre değişimi zamanı',
    },
    {
      id: 2,
      title: 'Muayene Yenileme',
      dueDate: '2024-12-20',
      dueMileage: null,
      type: 'inspection',
      priority: 'high',
      description: 'Araç muayene tarihi yaklaşıyor',
    },
    {
      id: 3,
      title: 'Kasko Yenileme',
      dueDate: '2024-08-10',
      dueMileage: null,
      type: 'insurance',
      priority: 'high',
      description: 'Kasko poliçesi yenileme zamanı',
    },
    {
      id: 4,
      title: 'Klima Gazı Kontrolü',
      dueDate: '2024-06-01',
      dueMileage: 48000,
      type: 'maintenance',
      priority: 'low',
      description: 'Yaz öncesi klima sistemi kontrolü',
    },
  ],
  messages: [
    {
      id: 1,
      sender: 'Mehmet Usta',
      message: 'Aracınızın periyodik bakım zamanı yaklaşıyor. Randevu almak için bize ulaşabilirsiniz.',
      date: '2024-01-20',
      type: 'reminder',
    },
    {
      id: 2,
      sender: 'Sistem',
      message: 'Muayene tarihiniz 6 ay sonra sona eriyor. Unutmayın!',
      date: '2024-01-18',
      type: 'system',
    },
    {
      id: 3,
      sender: 'Ali Tamirci',
      message: 'Fren balata değişimi başarıyla tamamlandı. İyi yolculuklar!',
      date: '2023-10-20',
      type: 'service',
    },
  ],
};

export default function CarDetailsScreen() {
  const { carId } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // In a real app, you would fetch car data based on carId
  const carData = mockCarData;

  const tabs = [
    { id: 'overview', title: 'Genel', icon: 'car' },
    { id: 'specs', title: 'Özellikler', icon: 'settings' },
    { id: 'history', title: 'Geçmiş', icon: 'time' },
    { id: 'parts', title: 'Parçalar', icon: 'construct' },
    { id: 'reminders', title: 'Hatırlatıcılar', icon: 'notifications' },
    { id: 'messages', title: 'Mesajlar', icon: 'chatbubbles' },
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      Alert.alert('Hata', 'Lütfen bir mesaj yazın.');
      return;
    }

    // In a real app, you would send the message to the backend
    Alert.alert('Başarılı', 'Mesajınız gönderildi!');
    setNewMessage('');
    setShowMessageModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return Colors.light.success;
      case 'warning': return Colors.light.warning;
      case 'critical': return Colors.light.error;
      default: return Colors.light.tabIconDefault;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return Colors.light.error;
      case 'medium': return Colors.light.warning;
      case 'low': return Colors.light.success;
      default: return Colors.light.tabIconDefault;
    }
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Car Info Card */}
      <View style={styles.card}>
        <View style={styles.carHeader}>
          <Text style={styles.carEmoji}>{carData.image}</Text>
          <View style={styles.carInfo}>
            <Text style={styles.carTitle}>{carData.brand} {carData.model}</Text>
            <Text style={styles.carSubtitle}>{carData.year} • {carData.plate}</Text>
            <Text style={styles.carDetails}>{carData.color} • {carData.fuelType}</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="speedometer" size={20} color={Colors.light.primary} />
            <Text style={styles.statLabel}>Kilometre</Text>
            <Text style={styles.statValue}>{carData.mileage.toLocaleString()} km</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={20} color={Colors.light.primary} />
            <Text style={styles.statLabel}>Son Servis</Text>
            <Text style={styles.statValue}>{carData.lastService}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={20} color={Colors.light.primary} />
            <Text style={styles.statLabel}>Sonraki Servis</Text>
            <Text style={styles.statValue}>{carData.nextService}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Hızlı İşlemler</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="construct" size={24} color={Colors.light.primary} />
            <Text style={styles.quickActionText}>Servis Randevusu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="car" size={24} color={Colors.light.primary} />
            <Text style={styles.quickActionText}>Tamirci Bul</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="document-text" size={24} color={Colors.light.primary} />
            <Text style={styles.quickActionText}>Rapor Al</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Son Aktiviteler</Text>
        {carData.repairHistory.slice(0, 3).map((repair) => (
          <View key={repair.id} style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="construct" size={16} color="white" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{repair.type}</Text>
              <Text style={styles.activityDate}>{repair.date} • {repair.mechanic}</Text>
            </View>
            <Text style={styles.activityCost}>₺{repair.cost}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSpecs = () => (
    <View style={styles.tabContent}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Teknik Özellikler</Text>
        {Object.entries(carData.specifications).map(([key, value]) => (
          <View key={key} style={styles.specRow}>
            <Text style={styles.specLabel}>
              {key === 'engine' ? 'Motor' :
               key === 'power' ? 'Güç' :
               key === 'transmission' ? 'Şanzıman' :
               key === 'fuelCapacity' ? 'Yakıt Kapasitesi' :
               key === 'fuelConsumption' ? 'Yakıt Tüketimi' :
               key === 'maxSpeed' ? 'Maksimum Hız' :
               key === 'acceleration' ? '0-100 km/h' :
               key === 'weight' ? 'Ağırlık' :
               key === 'dimensions' ? 'Boyutlar' : key}
            </Text>
            <Text style={styles.specValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={carData.repairHistory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.historyHeader}>
              <View>
                <Text style={styles.historyTitle}>{item.type}</Text>
                <Text style={styles.historyDate}>{item.date} • {item.mileage.toLocaleString()} km</Text>
              </View>
              <Text style={styles.historyCost}>₺{item.cost}</Text>
            </View>
            <Text style={styles.historyMechanic}>Tamirci: {item.mechanic}</Text>
            <Text style={styles.historyDescription}>{item.description}</Text>
            <View style={styles.historyParts}>
              <Text style={styles.historyPartsTitle}>Değişen Parçalar:</Text>
              {item.parts.map((part, index) => (
                <Text key={index} style={styles.historyPart}>• {part}</Text>
              ))}
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderParts = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={carData.changedParts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.partHeader}>
              <View style={styles.partInfo}>
                <Text style={styles.partName}>{item.name}</Text>
                <Text style={styles.partDate}>Son Değişim: {item.changeDate}</Text>
              </View>
              <View style={[styles.partStatus, { backgroundColor: getStatusColor(item.status) }]}>
                <Ionicons 
                  name={item.status === 'good' ? 'checkmark' : item.status === 'warning' ? 'warning' : 'close'} 
                  size={16} 
                  color="white" 
                />
              </View>
            </View>
            <View style={styles.partDetails}>
              <View style={styles.partDetail}>
                <Text style={styles.partDetailLabel}>Sonraki Değişim</Text>
                <Text style={styles.partDetailValue}>{item.nextChange}</Text>
              </View>
              <View style={styles.partDetail}>
                <Text style={styles.partDetailLabel}>Kilometre</Text>
                <Text style={styles.partDetailValue}>{item.mileage.toLocaleString()} / {item.nextMileage.toLocaleString()} km</Text>
              </View>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderReminders = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={carData.reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.reminderHeader}>
              <View style={styles.reminderInfo}>
                <Text style={styles.reminderTitle}>{item.title}</Text>
                <Text style={styles.reminderDate}>Tarih: {item.dueDate}</Text>
                {item.dueMileage && (
                  <Text style={styles.reminderMileage}>Kilometre: {item.dueMileage.toLocaleString()} km</Text>
                )}
              </View>
              <View style={[styles.reminderPriority, { backgroundColor: getPriorityColor(item.priority) }]}>
                <Text style={styles.reminderPriorityText}>
                  {item.priority === 'high' ? 'Yüksek' : 
                   item.priority === 'medium' ? 'Orta' : 'Düşük'}
                </Text>
              </View>
            </View>
            <Text style={styles.reminderDescription}>{item.description}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderMessages = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity 
        style={styles.newMessageButton}
        onPress={() => setShowMessageModal(true)}
      >
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.newMessageText}>Yeni Mesaj</Text>
      </TouchableOpacity>

      <FlatList
        data={carData.messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.messageHeader}>
              <View style={styles.messageInfo}>
                <Text style={styles.messageSender}>{item.sender}</Text>
                <Text style={styles.messageDate}>{item.date}</Text>
              </View>
              <View style={[styles.messageType, { 
                backgroundColor: item.type === 'system' ? Colors.light.primary : 
                                item.type === 'reminder' ? Colors.light.warning : Colors.light.success 
              }]}>
                <Ionicons 
                  name={item.type === 'system' ? 'information' : 
                       item.type === 'reminder' ? 'time' : 'construct'} 
                  size={16} 
                  color="white" 
                />
              </View>
            </View>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'specs': return renderSpecs();
      case 'history': return renderHistory();
      case 'parts': return renderParts();
      case 'reminders': return renderReminders();
      case 'messages': return renderMessages();
      default: return renderOverview();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.lightBlue]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Araç Detayları</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons 
                name={tab.icon as any} 
                size={16} 
                color={activeTab === tab.id ? Colors.light.primary : Colors.light.tabIconDefault} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>

      {/* New Message Modal */}
      <Modal
        visible={showMessageModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowMessageModal(false)}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Yeni Mesaj</Text>
            <TouchableOpacity onPress={handleSendMessage}>
              <Text style={styles.sendButton}>Gönder</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Mesajınız</Text>
            <TextInput
              style={styles.messageInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Tamirci ile ilgili sorularınızı yazabilirsiniz..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  tabScrollContent: {
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 20,
    gap: 6,
  },
  activeTab: {
    backgroundColor: Colors.light.lightBlue,
  },
  tabText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  carHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  carEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  carInfo: {
    flex: 1,
  },
  carTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  carSubtitle: {
    fontSize: 16,
    color: Colors.light.tabIconDefault,
    marginBottom: 2,
  },
  carDetails: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 16,
  },
  quickActionText: {
    fontSize: 12,
    color: Colors.light.text,
    marginTop: 8,
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  activityCost: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  specLabel: {
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
    textAlign: 'right',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  historyDate: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  historyCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  historyMechanic: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 8,
  },
  historyDescription: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 12,
  },
  historyParts: {
    backgroundColor: Colors.light.background,
    padding: 12,
    borderRadius: 8,
  },
  historyPartsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 4,
  },
  historyPart: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginLeft: 8,
  },
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  partInfo: {
    flex: 1,
  },
  partName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  partDate: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  partStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  partDetail: {
    flex: 1,
  },
  partDetailLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginBottom: 2,
  },
  partDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  reminderDate: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  reminderMileage: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  reminderPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reminderPriorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  reminderDescription: {
    fontSize: 14,
    color: Colors.light.text,
  },
  newMessageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  newMessageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  messageInfo: {
    flex: 1,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  messageDate: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  messageType: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  sendButton: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
    height: 120,
  },
});