import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { mockUsers } from '@/constants/mockData';

const { width, height } = Dimensions.get('window');

// Mock mechanic locations with coordinates
const mechanicLocations = mockUsers.mechanics.map((mechanic, index) => ({
  ...mechanic,
  latitude: 41.0082 + (Math.random() - 0.5) * 0.1, // Istanbul area
  longitude: 28.9784 + (Math.random() - 0.5) * 0.1,
  distance: (Math.random() * 10 + 0.5).toFixed(1), // Random distance 0.5-10.5 km
  isOpen: Math.random() > 0.3, // 70% chance of being open
  rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Rating between 3.5-5.0
}));

export default function CustomerMapScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('Tümü');
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null);

  const specialties = ['Tümü', 'Oto Elektrik', 'Kaporta', 'Motor', 'Fren Sistemi', 'Klima'];

  const filteredMechanics = mechanicLocations.filter(mechanic => {
    const matchesSearch = mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mechanic.specialties.some(spec => 
                           spec.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesSpecialty = selectedSpecialty === 'Tümü' || 
                            mechanic.specialties.includes(selectedSpecialty);
    
    return matchesSearch && matchesSpecialty;
  });

  const handleMechanicPress = (mechanic: any) => {
    setSelectedMechanic(mechanic);
  };

  const handleContact = (mechanic: any) => {
    Alert.alert(
      'İletişim',
      `${mechanic.name} ile iletişime geçmek istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Ara', onPress: () => Alert.alert('Aranıyor...', `${mechanic.phone} aranıyor`) },
        { text: 'Mesaj', onPress: () => Alert.alert('Mesaj', 'Mesaj özelliği yakında eklenecek!') },
        { text: 'Yol Tarifi', onPress: () => Alert.alert('Yol Tarifi', 'Harita uygulaması açılıyor...') },
      ]
    );
  };

  const handleDirections = (mechanic: any) => {
    Alert.alert('Yol Tarifi', `${mechanic.name} için yol tarifi alınıyor...`);
  };

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
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {specialties.map((specialty) => (
          <TouchableOpacity
            key={specialty}
            style={[
              styles.filterChip,
              selectedSpecialty === specialty && styles.filterChipActive
            ]}
            onPress={() => setSelectedSpecialty(specialty)}
          >
            <Text style={[
              styles.filterChipText,
              selectedSpecialty === specialty && styles.filterChipTextActive
            ]}>
              {specialty}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <View style={styles.mapView}>
          {/* Map Background */}
          <View style={styles.mapBackground}>
            <Text style={styles.mapTitle}>İstanbul Haritası</Text>
            
            {/* Mock Map Pins */}
            {filteredMechanics.slice(0, 8).map((mechanic, index) => (
              <TouchableOpacity
                key={mechanic.id}
                style={[
                  styles.mapPin,
                  {
                    left: 50 + (index % 4) * 60,
                    top: 80 + Math.floor(index / 4) * 80,
                  },
                  selectedMechanic?.id === mechanic.id && styles.mapPinSelected
                ]}
                onPress={() => handleMechanicPress(mechanic)}
              >
                <Ionicons 
                  name="location" 
                  size={24} 
                  color={selectedMechanic?.id === mechanic.id ? 'white' : Colors.light.primary} 
                />
              </TouchableOpacity>
            ))}
            
            {/* User Location */}
            <View style={styles.userLocation}>
              <Ionicons name="radio-button-on" size={16} color="#007AFF" />
            </View>
          </View>
          
          {/* Map Controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapControlButton}>
              <Ionicons name="add" size={20} color={Colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapControlButton}>
              <Ionicons name="remove" size={20} color={Colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapControlButton}>
              <Ionicons name="locate" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected Mechanic Info */}
        {selectedMechanic && (
          <View style={styles.selectedMechanicCard}>
            <View style={styles.selectedMechanicInfo}>
              <Text style={styles.selectedMechanicName}>{selectedMechanic.name}</Text>
              <View style={styles.selectedMechanicDetails}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rating}>{selectedMechanic.rating}</Text>
                </View>
                <Text style={styles.distance}>{selectedMechanic.distance} km</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: selectedMechanic.isOpen ? Colors.light.success : Colors.light.error }
                ]}>
                  <Text style={styles.statusText}>
                    {selectedMechanic.isOpen ? 'Açık' : 'Kapalı'}
                  </Text>
                </View>
              </View>
              <Text style={styles.selectedMechanicSpecialties}>
                {selectedMechanic.specialties.slice(0, 2).join(', ')}
              </Text>
            </View>
            <View style={styles.selectedMechanicActions}>
              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={() => handleDirections(selectedMechanic)}
              >
                <Ionicons name="navigate" size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => handleContact(selectedMechanic)}
              >
                <Ionicons name="call" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Mechanics List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Yakındaki Tamirciler ({filteredMechanics.length})
          </Text>
          <TouchableOpacity style={styles.listViewButton}>
            <Ionicons name="list" size={16} color={Colors.light.primary} />
            <Text style={styles.listViewText}>Liste</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.mechanicsList}
          showsVerticalScrollIndicator={false}
        >
          {filteredMechanics.map((mechanic) => (
            <TouchableOpacity 
              key={mechanic.id} 
              style={[
                styles.mechanicCard,
                selectedMechanic?.id === mechanic.id && styles.mechanicCardSelected
              ]}
              onPress={() => handleMechanicPress(mechanic)}
            >
              <View style={styles.mechanicInfo}>
                <View style={styles.mechanicHeader}>
                  <Text style={styles.mechanicName}>{mechanic.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{mechanic.rating}</Text>
                  </View>
                </View>
                <Text style={styles.mechanicSpecialties}>
                  {mechanic.specialties.join(', ')}
                </Text>
                <View style={styles.mechanicDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="location" size={14} color={Colors.light.tabIconDefault} />
                    <Text style={styles.detailText}>{mechanic.distance} km</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons 
                      name="time" 
                      size={14} 
                      color={mechanic.isOpen ? Colors.light.success : Colors.light.error} 
                    />
                    <Text style={[
                      styles.detailText,
                      { color: mechanic.isOpen ? Colors.light.success : Colors.light.error }
                    ]}>
                      {mechanic.isOpen ? 'Açık' : 'Kapalı'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="pricetag" size={14} color={Colors.light.tabIconDefault} />
                    <Text style={styles.detailText}>₺150-400</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleContact(mechanic)}
              >
                <Ionicons name="call" size={20} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          
          {filteredMechanics.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={48} color={Colors.light.tabIconDefault} />
              <Text style={styles.emptyText}>Tamirci bulunamadı</Text>
              <Text style={styles.emptySubtext}>
                Arama kriterlerinizi değiştirip tekrar deneyin
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
  filterButton: {
    padding: 4,
  },
  filterContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    backgroundColor: 'white',
  },
  filterChipActive: {
    backgroundColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: 'white',
  },
  mapContainer: {
    height: 250,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapView: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: Colors.light.lightBlue,
    position: 'relative',
  },
  mapTitle: {
    position: 'absolute',
    top: 16,
    left: 16,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mapPin: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mapPinSelected: {
    backgroundColor: Colors.light.primary,
    transform: [{ scale: 1.2 }],
  },
  userLocation: {
    position: 'absolute',
    bottom: 80,
    left: 120,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: 60,
    gap: 8,
  },
  mapControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedMechanicCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedMechanicInfo: {
    flex: 1,
  },
  selectedMechanicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  selectedMechanicDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  selectedMechanicSpecialties: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  selectedMechanicActions: {
    flexDirection: 'row',
    gap: 8,
  },
  directionsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  listViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listViewText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  mechanicsList: {
    flex: 1,
  },
  mechanicCard: {
    backgroundColor: 'white',
    borderRadius: 12,
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
  mechanicCardSelected: {
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mechanicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    flex: 1,
  },
  mechanicSpecialties: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginBottom: 8,
  },
  mechanicDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  distance: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  contactButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: 'center',
    marginTop: 8,
  },
});