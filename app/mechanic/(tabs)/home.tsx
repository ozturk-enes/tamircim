import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

// Mock data for mechanics
const mockMechanics = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    specialties: ['Motor', 'Fren', 'Elektrik'],
    rating: 4.8,
    distance: 0.0,
    isOnline: true,
    priceRange: '₺150-300',
    location: 'Kadıköy, İstanbul',
    completedJobs: 156,
    responseTime: '15 dk',
    isSelf: true, // This is the current mechanic
    category: 'Motor',
  },
  {
    id: '2',
    name: 'Mehmet Demir',
    specialties: ['Kaportaj', 'Boya', 'Cam'],
    rating: 4.6,
    distance: 1.2,
    isOnline: true,
    priceRange: '₺200-400',
    location: 'Üsküdar, İstanbul',
    completedJobs: 89,
    responseTime: '25 dk',
    isSelf: false,
    category: 'Kaportaj',
  },
  {
    id: '3',
    name: 'Ali Kaya',
    specialties: ['Lastik', 'Jant', 'Balans'],
    rating: 4.7,
    distance: 2.1,
    isOnline: false,
    priceRange: '₺100-250',
    location: 'Beşiktaş, İstanbul',
    completedJobs: 234,
    responseTime: '30 dk',
    isSelf: false,
    category: 'Lastik',
  },
  {
    id: '4',
    name: 'Hasan Özkan',
    specialties: ['Klima', 'Elektrik', 'Elektronik'],
    rating: 4.5,
    distance: 3.0,
    isOnline: true,
    priceRange: '₺180-350',
    location: 'Şişli, İstanbul',
    completedJobs: 67,
    responseTime: '20 dk',
    isSelf: false,
    category: 'Elektrik',
  },
  {
    id: '5',
    name: 'Mustafa Çelik',
    specialties: ['Transmisyon', 'Diferansiyel', 'Debriyaj'],
    rating: 4.9,
    distance: 1.8,
    isOnline: true,
    priceRange: '₺250-500',
    location: 'Beyoğlu, İstanbul',
    completedJobs: 312,
    responseTime: '10 dk',
    isSelf: false,
    category: 'Transmisyon',
  },
  {
    id: '6',
    name: 'Osman Kara',
    specialties: ['Fren', 'Amortisör', 'Süspansiyon'],
    rating: 4.4,
    distance: 4.2,
    isOnline: false,
    priceRange: '₺120-280',
    location: 'Fatih, İstanbul',
    completedJobs: 145,
    responseTime: '35 dk',
    isSelf: false,
    category: 'Fren',
  },
];

const categories = [
  { id: 'all', title: 'Tümü', icon: 'grid' },
  { id: 'Motor', title: 'Motor', icon: 'car-sport' },
  { id: 'Kaportaj', title: 'Kaportaj', icon: 'hammer' },
  { id: 'Lastik', title: 'Lastik', icon: 'ellipse' },
  { id: 'Elektrik', title: 'Elektrik', icon: 'flash' },
  { id: 'Fren', title: 'Fren', icon: 'stop-circle' },
  { id: 'Transmisyon', title: 'Transmisyon', icon: 'settings' },
];

export default function MechanicHomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredMechanics = mockMechanics.filter((mechanic) => {
    const matchesSearch = mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mechanic.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         mechanic.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || mechanic.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleMechanicPress = (mechanic: any) => {
    if (mechanic.isSelf) {
      Alert.alert('Bilgi', 'Bu sizin profiliniz. Profil sekmesinden düzenleyebilirsiniz.');
      return;
    }
    
    Alert.alert(
      'Tamirci Detayları',
      `${mechanic.name}\n${mechanic.location}\nUzmanlık: ${mechanic.specialties.join(', ')}\nPuan: ${mechanic.rating}\nFiyat: ${mechanic.priceRange}`,
      [
        { text: 'Kapat', style: 'cancel' },
        { text: 'İletişim', onPress: () => handleContactMechanic(mechanic) },
      ]
    );
  };

  const handleContactMechanic = (mechanic: any) => {
    Alert.alert(
      'İletişim',
      `${mechanic.name} ile iletişime geçmek istediğinizden emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Ara', onPress: () => Alert.alert('Aranıyor...', `${mechanic.name} aranıyor.`) },
        { text: 'Mesaj', onPress: () => Alert.alert('Mesaj', `${mechanic.name}'a mesaj gönderiliyor.`) },
      ]
    );
  };

  const quickStats = [
    { id: 1, title: 'Toplam Tamirci', value: mockMechanics.length, icon: 'people', color: Colors.light.primary },
    { id: 2, title: 'Çevrimiçi', value: mockMechanics.filter(m => m.isOnline).length, icon: 'radio-button-on', color: Colors.light.success },
    { id: 3, title: 'Yakındaki', value: mockMechanics.filter(m => m.distance <= 2).length, icon: 'location', color: Colors.light.secondary },
    { id: 4, title: 'Yüksek Puan', value: mockMechanics.filter(m => m.rating >= 4.7).length, icon: 'star', color: Colors.light.warning },
  ];

  const renderMechanicCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.mechanicCard, item.isSelf && styles.selfMechanicCard]}
      onPress={() => handleMechanicPress(item)}
    >
      <View style={styles.mechanicHeader}>
        <View style={styles.mechanicMainInfo}>
          <View style={styles.mechanicNameRow}>
            <Text style={styles.mechanicName}>{item.name}</Text>
            {item.isSelf && (
              <View style={styles.selfBadge}>
                <Ionicons name="person" size={12} color="white" />
                <Text style={styles.selfText}>SİZ</Text>
              </View>
            )}
          </View>
          <View style={styles.mechanicSpecialties}>
            {item.specialties.slice(0, 3).map((specialty: string, index: number) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
          <View style={styles.mechanicLocationRow}>
            <Ionicons name="location-outline" size={14} color={Colors.light.tabIconDefault} />
            <Text style={styles.mechanicLocation}>{item.location}</Text>
          </View>
        </View>
        <View style={styles.mechanicRightInfo}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.priceRange}>{item.priceRange}</Text>
          <View style={[styles.statusIndicator, { backgroundColor: item.isOnline ? Colors.light.success : Colors.light.tabIconDefault }]}>
            <Text style={styles.statusText}>{item.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.mechanicFooter}>
        <View style={styles.mechanicStats}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.light.success} />
            <Text style={styles.statText}>{item.completedJobs} iş</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={14} color={Colors.light.secondary} />
            <Text style={styles.statText}>{item.responseTime}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="navigate" size={14} color={Colors.light.secondary} />
            <Text style={styles.statText}>{item.distance} km</Text>
          </View>
        </View>
        
        {!item.isSelf && (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => handleContactMechanic(item)}
          >
            <Ionicons name="chatbubble" size={16} color="white" />
            <Text style={styles.contactButtonText}>İletişim</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.secondary, Colors.light.lightOrange]}
        style={styles.header}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Tamirci Ağı</Text>
          <Text style={styles.welcomeSubtext}>Yakınınızdaki {mockMechanics.length} tamirci</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İstatistikler</Text>
          <View style={styles.statsGrid}>
            {quickStats.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <Ionicons name={stat.icon as any} size={20} color="white" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={Colors.light.tabIconDefault} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tamirci ara..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.light.tabIconDefault}
            />
          </View>
        </View>

        {/* Category Selector */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={selectedCategory === category.id ? 'white' : Colors.light.secondary}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                  ]}
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Mechanics List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tamirciler ({filteredMechanics.length})</Text>
          <FlatList
            data={filteredMechanics}
            renderItem={renderMechanicCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="search" size={48} color={Colors.light.tabIconDefault} />
                <Text style={styles.emptyStateTitle}>Tamirci bulunamadı</Text>
                <Text style={styles.emptyStateText}>
                  Arama kriterlerinizi değiştirmeyi deneyin
                </Text>
              </View>
            }
          />
        </View>
      </View>
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
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 56) / 2,
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
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
    fontSize: 16,
    color: Colors.light.text,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.secondary,
    gap: 6,
    backgroundColor: 'white',
  },
  categoryChipActive: {
    backgroundColor: Colors.light.secondary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  mechanicCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
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
  selfMechanicCard: {
    borderWidth: 2,
    borderColor: Colors.light.secondary,
    backgroundColor: '#FFF8F0',
  },
  mechanicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mechanicMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  mechanicNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mechanicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginRight: 8,
  },
  selfBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  selfText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  mechanicSpecialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  specialtyTag: {
    backgroundColor: Colors.light.lightOrange,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    color: Colors.light.secondary,
    fontWeight: '500',
  },
  mechanicLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mechanicLocation: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  mechanicRightInfo: {
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  priceRange: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.secondary,
    marginBottom: 8,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
    color: 'white',
  },
  mechanicFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mechanicStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    fontWeight: '500',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.light.secondary,
    gap: 4,
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    marginTop: 8,
  },
});