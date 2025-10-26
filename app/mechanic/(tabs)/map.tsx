import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

// Mock data for mechanics
const mockMechanics = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    specialties: ['Motor', 'Fren', 'Elektrik'],
    rating: 4.8,
    distance: 0.5,
    isOnline: true,
    priceRange: '₺150-300',
    location: 'Kadıköy, İstanbul',
    coordinates: { latitude: 40.9903, longitude: 29.0253 },
    isSelf: true, // This is the current mechanic
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
    coordinates: { latitude: 40.9876, longitude: 29.0298 },
    isSelf: false,
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
    coordinates: { latitude: 40.9956, longitude: 29.0189 },
    isSelf: false,
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
    coordinates: { latitude: 40.9987, longitude: 29.0145 },
    isSelf: false,
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
    coordinates: { latitude: 40.9834, longitude: 29.0167 },
    isSelf: false,
  },
];

export default function MechanicMapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null);

  const filters = [
    { id: 'all', title: 'Tümü', icon: 'grid' },
    { id: 'online', title: 'Çevrimiçi', icon: 'radio-button-on' },
    { id: 'nearby', title: 'Yakın', icon: 'location' },
    { id: 'rated', title: 'Yüksek Puan', icon: 'star' },
  ];

  const filteredMechanics = mockMechanics.filter((mechanic) => {
    const matchesSearch = mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mechanic.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         mechanic.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'online' && mechanic.isOnline) ||
                         (selectedFilter === 'nearby' && mechanic.distance <= 2) ||
                         (selectedFilter === 'rated' && mechanic.rating >= 4.7);
    
    return matchesSearch && matchesFilter;
  });

  const handleMechanicPress = (mechanic: any) => {
    setSelectedMechanic(mechanic);
  };

  const handleContactMechanic = (mechanic: any) => {
    if (mechanic.isSelf) {
      Alert.alert('Bilgi', 'Bu sizin profiliniz.');
      return;
    }
    
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
        <View style={styles.distanceContainer}>
          <Ionicons name="navigate" size={14} color={Colors.light.secondary} />
          <Text style={styles.distance}>{item.distance} km</Text>
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

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={selectedFilter === filter.id ? 'white' : Colors.light.secondary}
              />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapPinsContainer}>
          {/* Self Pin (Orange) */}
          <View style={[styles.mapPin, styles.selfPin]}>
            <Ionicons name="location" size={24} color="white" />
          </View>
          
          {/* Other Mechanics Pins (Yellow) */}
          <View style={[styles.mapPin, styles.otherPin, { top: 30, left: 60 }]}>
            <Ionicons name="location" size={20} color="white" />
          </View>
          <View style={[styles.mapPin, styles.otherPin, { top: 80, right: 40 }]}>
            <Ionicons name="location" size={20} color="white" />
          </View>
          <View style={[styles.mapPin, styles.otherPin, { bottom: 40, left: 80 }]}>
            <Ionicons name="location" size={20} color="white" />
          </View>
          <View style={[styles.mapPin, styles.otherPin, { bottom: 60, right: 60 }]}>
            <Ionicons name="location" size={20} color="white" />
          </View>
        </View>
        
        <Ionicons name="map" size={48} color={Colors.light.secondary} />
        <Text style={styles.mapPlaceholderText}>Tamirci Haritası</Text>
        <Text style={styles.mapPlaceholderSubtext}>
          Turuncu pin sizsiniz, sarı pinler diğer tamirciler
        </Text>
      </View>

      {/* Selected Mechanic Card */}
      {selectedMechanic && (
        <View style={styles.selectedMechanicCard}>
          <View style={styles.selectedMechanicHeader}>
            <Text style={styles.selectedMechanicName}>{selectedMechanic.name}</Text>
            <TouchableOpacity onPress={() => setSelectedMechanic(null)}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.selectedMechanicLocation}>{selectedMechanic.location}</Text>
          <View style={styles.selectedMechanicInfo}>
            <View style={styles.selectedMechanicRating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.selectedMechanicRatingText}>{selectedMechanic.rating}</Text>
            </View>
            <Text style={styles.selectedMechanicDistance}>{selectedMechanic.distance} km</Text>
            <Text style={styles.selectedMechanicPrice}>{selectedMechanic.priceRange}</Text>
          </View>
        </View>
      )}

      {/* Mechanics List */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Yakındaki Tamirciler ({filteredMechanics.length})</Text>
      </View>

      <FlatList
        data={filteredMechanics}
        renderItem={renderMechanicCard}
        keyExtractor={(item) => item.id}
        style={styles.mechanicsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search" size={48} color={Colors.light.tabIconDefault} />
            <Text style={styles.emptyStateText}>Tamirci bulunamadı</Text>
            <Text style={styles.emptyStateSubtext}>
              Arama kriterlerinizi değiştirmeyi deneyin
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.secondary,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.light.secondary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: Colors.light.lightOrange,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 16,
    position: 'relative',
  },
  mapPinsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapPin: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selfPin: {
    backgroundColor: Colors.light.secondary, // Orange for self
    top: 50,
    left: '50%',
    marginLeft: -16,
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  otherPin: {
    backgroundColor: '#FFD700', // Yellow for others
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  selectedMechanicCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedMechanicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedMechanicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  selectedMechanicLocation: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 8,
  },
  selectedMechanicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  selectedMechanicRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectedMechanicRatingText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  selectedMechanicDistance: {
    fontSize: 14,
    color: Colors.light.secondary,
    fontWeight: '500',
  },
  selectedMechanicPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.secondary,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  mechanicsList: {
    flex: 1,
    paddingHorizontal: 16,
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
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    color: Colors.light.secondary,
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
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    marginTop: 8,
  },
});