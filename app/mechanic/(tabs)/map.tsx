import Colors from "@/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";
import { Mechanic } from "@/types/schema";
import { calculateDistance, UserLocation } from "@/utils/geo";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const { width } = Dimensions.get("window");

const MechanicMapScreen = () => {
  // --- STORE INTEGRATION ---
  const currentUser = useAuthStore((state) => state.user);
  const allMechanics = useDataStore((state) => state.mechanics);

  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(
    null
  );

  const [modalVisible, setModalVisible] = useState(false);

  const mapRef = useRef<MapView>(null);
  const searchAnimation = useRef(new Animated.Value(0)).current;

  // Başlangıç Konumu (İstanbul) veya Kullanıcı Konumu
  const initialRegion = {
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // İzin yoksa sessizce devam et
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error("Konum alınamadı:", error);
    }
  };

  // Arama Filtrelemesi (Memoized)
  const filteredMechanics = useMemo(() => {
    if (!searchQuery) return [];
    return allMechanics.filter(
      (mechanic) =>
        mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mechanic.specialties.some((specialty) =>
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        mechanic.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allMechanics, searchQuery]);

  const toggleSearchBar = () => {
    const toValue = searchExpanded ? 0 : 1;
    setSearchExpanded(!searchExpanded);

    Animated.spring(searchAnimation, {
      toValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const openGoogleMapsRoute = (mechanic: Mechanic) => {
    const destination = `${mechanic.location.latitude},${mechanic.location.longitude}`;
    const url = userLocation
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${destination}&travelmode=driving`
      : `https://www.google.com/maps/search/?api=1&query=${destination}`;

    Linking.openURL(url).catch((err) => {
      console.error("Google Maps açılamadı:", err);
      Alert.alert("Hata", "Harita uygulaması açılamadı.");
    });
  };

  const focusOnLocation = (mechanic: Mechanic) => {
    setModalVisible(false);
    mapRef.current?.animateToRegion(
      {
        latitude: mechanic.location.latitude,
        longitude: mechanic.location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
  };

  const handleMechanicSelect = (mechanic: Mechanic) => {
    setSelectedMechanic(mechanic);
    setModalVisible(true);
    setSearchExpanded(false);
    setSearchQuery("");

    Animated.spring(searchAnimation, {
      toValue: 0,
      useNativeDriver: false,
    }).start();

    mapRef.current?.animateToRegion(
      {
        latitude: mechanic.location.latitude,
        longitude: mechanic.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
  };

  // --- RENDER ---

  const searchBarHeight = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 300],
  });

  const renderMechanicListItem = ({ item }: { item: Mechanic }) => {
    const distance = userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          item.location.latitude,
          item.location.longitude
        )
      : null;

    return (
      <TouchableOpacity
        style={styles.mechanicListItem}
        onPress={() => handleMechanicSelect(item)}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.listItemName}>{item.name}</Text>
          <Text style={styles.listItemAddress} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        {distance && (
          <View style={styles.listItemDistanceBadge}>
            <Text style={styles.listItemDistanceText}>
              {distance.toFixed(1)} km
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {allMechanics.map((mechanic) => (
          <Marker
            key={mechanic.id}
            coordinate={{
              latitude: mechanic.location.latitude,
              longitude: mechanic.location.longitude,
            }}
            title={mechanic.name}
            description={mechanic.specialties[0]}
            pinColor={
              currentUser?.id === mechanic.id
                ? Colors.light.secondary
                : selectedMechanic?.id === mechanic.id
                ? Colors.light.primary
                : "red"
            }
            onPress={() => handleMechanicSelect(mechanic)}
          >
            {/* Kendi dükkanını farklı göster */}
            {currentUser?.id === mechanic.id && (
              <View style={styles.myShopMarker}>
                <Ionicons name="home" size={16} color="white" />
              </View>
            )}
          </Marker>
        ))}
      </MapView>

      {/* Arama Çubuğu */}
      <Animated.View
        style={[styles.searchContainer, { height: searchBarHeight }]}
      >
        <View style={styles.searchHeader}>
          <TouchableOpacity
            onPress={toggleSearchBar}
            style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons
              name="search"
              size={24}
              color={Colors.light.tabIconDefault}
            />
            <Text style={styles.searchPlaceholder}>
              {searchExpanded ? "Kapat" : "Diğer Tamircileri Ara"}
            </Text>
          </TouchableOpacity>
        </View>

        {searchExpanded && (
          <View style={styles.searchContent}>
            <TextInput
              style={styles.searchInput}
              placeholder="Ad, uzmanlık veya adres ara..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus
            />
            <FlatList
              data={filteredMechanics}
              renderItem={renderMechanicListItem}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                searchQuery ? (
                  <Text style={styles.emptyText}>Sonuç yok.</Text>
                ) : null
              }
            />
          </View>
        )}
      </Animated.View>

      {/* Konum Butonu */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={() => {
          if (userLocation && mapRef.current) {
            mapRef.current.animateToRegion({
              ...userLocation,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          } else {
            getUserLocation();
          }
        }}
      >
        <Ionicons name="locate" size={24} color={Colors.light.primary} />
      </TouchableOpacity>

      {/* Detay Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMechanic && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalTitle}>
                      {selectedMechanic.name}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                      {selectedMechanic.isOnline
                        ? "• Çevrimiçi"
                        : "• Çevrimdışı"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.modalCloseButton}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons
                    name="build"
                    size={18}
                    color={Colors.light.primary}
                  />
                  <Text style={styles.detailText}>
                    {selectedMechanic.specialties.join(", ")}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons
                    name="location"
                    size={18}
                    color={Colors.light.primary}
                  />
                  <Text style={styles.detailText}>
                    {selectedMechanic.address}
                  </Text>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton]}
                    onPress={() => focusOnLocation(selectedMechanic)}
                  >
                    <Ionicons
                      name="locate"
                      size={24}
                      color={Colors.light.primary}
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: Colors.light.primary },
                      ]}
                    >
                      Konuma Git
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={() => openGoogleMapsRoute(selectedMechanic)}
                  >
                    <Ionicons name="navigate" size={24} color="white" />
                    <Text style={styles.actionButtonText}>Rota Oluştur</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  myShopMarker: {
    backgroundColor: Colors.light.secondary,
    padding: 6,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },

  // Arama
  searchContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: "hidden",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    height: 60,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "500",
  },
  searchContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  mechanicListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  listItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  listItemAddress: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  listItemDistanceBadge: {
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  listItemDistanceText: {
    fontSize: 12,
    color: Colors.light.primary,
    fontWeight: "600",
  },

  // Konum Butonu
  myLocationButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  modalCloseButton: {
    padding: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
  },
  secondaryButton: {
    backgroundColor: "#F0F9FF",
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});

export default MechanicMapScreen;
