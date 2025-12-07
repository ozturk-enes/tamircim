import { Mechanic, mockMechanics } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  calculateDistance,
  calculateRealisticRoute,
  UserLocation,
  NavigationInfo,
  RouteStep,
} from "@/utils/geo";



const MapScreen = () => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMechanics, setFilteredMechanics] = useState<Mechanic[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(
    null
  );
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [navigationInfo, setNavigationInfo] = useState<NavigationInfo | null>(
    null
  );
  const [showNavigation, setShowNavigation] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMechanic, setModalMechanic] = useState<Mechanic | null>(null);
  const mapRef = useRef<MapView>(null);
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const navigationAnimation = useRef(new Animated.Value(0)).current;

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
        Alert.alert(
          "Konum İzni",
          "Konum özelliğini kullanmak için izin gerekli."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error("Konum alınamadı:", error);
      Alert.alert("Hata", "Konum bilgisi alınamadı.");
    }
  };

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
    // Boşluk kontrolü kaldırıldı - direkt arama yapılabilir
    const filtered = mockMechanics.filter(
      (mechanic) =>
        mechanic.name.toLowerCase().includes(query.toLowerCase()) ||
        mechanic.specialties.some((specialty) =>
          specialty.toLowerCase().includes(query.toLowerCase())
        ) ||
        mechanic.location.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMechanics(filtered);
  };

  const handleSearchButtonPress = () => {
    if (searchQuery.trim() !== "") {
      handleSearch(searchQuery);
    }
  };



  const createRoute = async (mechanicLocation: {
    latitude: number;
    longitude: number;
  }) => {
    if (!userLocation) {
      Alert.alert("Konum Hatası", "Kullanıcı konumu bulunamadı.");
      return;
    }

    setIsCalculatingRoute(true);

    // Rota hesaplama simülasyonu (1 saniye içinde)
    setTimeout(() => {
      const navInfo = calculateRealisticRoute(userLocation, mechanicLocation);
      setNavigationInfo(navInfo);

      // Rota koordinatlarını oluştur
      const routeCoords = [userLocation];
      navInfo.steps.forEach((step) => {
        routeCoords.push(...step.coordinates);
      });
      routeCoords.push(mechanicLocation);

      setRouteCoordinates(routeCoords);
      setIsCalculatingRoute(false);
      setShowNavigation(true);

      // Navigasyon panelini göster
      Animated.spring(navigationAnimation, {
        toValue: 1,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();

      // Haritayı rotayı gösterecek şekilde ayarla
      const minLat = Math.min(userLocation.latitude, mechanicLocation.latitude);
      const maxLat = Math.max(userLocation.latitude, mechanicLocation.latitude);
      const minLng = Math.min(
        userLocation.longitude,
        mechanicLocation.longitude
      );
      const maxLng = Math.max(
        userLocation.longitude,
        mechanicLocation.longitude
      );

      const latDelta = (maxLat - minLat) * 1.5;
      const lngDelta = (maxLng - minLng) * 1.5;

      mapRef.current?.animateToRegion(
        {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: Math.max(latDelta, 0.01),
          longitudeDelta: Math.max(lngDelta, 0.01),
        },
        1000
      );
    }, 800); // 0.8 saniye rota hesaplama süresi
  };

  // Google Maps'te rota oluşturma
  const openGoogleMapsRoute = (mechanic: Mechanic) => {
    if (!userLocation) {
      Alert.alert("Konum Hatası", "Kullanıcı konumu bulunamadı.");
      return;
    }

    const origin = `${userLocation.latitude},${userLocation.longitude}`;
    const destination = `${mechanic.location.latitude},${mechanic.location.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    Linking.openURL(url).catch((err) => {
      console.error("Google Maps açılamadı:", err);
      Alert.alert(
        "Hata",
        "Google Maps açılamadı. Lütfen uygulamanın yüklü olduğundan emin olun."
      );
    });
  };

  // Konuma gitme (haritada gösterme)
  const goToLocation = (mechanic: Mechanic) => {
    setSelectedMechanic(mechanic);
    mapRef.current?.animateToRegion(
      {
        latitude: mechanic.location.latitude,
        longitude: mechanic.location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
    setModalVisible(false);
  };

  const handleMechanicSelect = (mechanic: Mechanic) => {
    setModalMechanic(mechanic);
    setModalVisible(true);
    setSearchExpanded(false);
    setSearchQuery("");
    setFilteredMechanics([]);

    Animated.spring(searchAnimation, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const clearRoute = () => {
    setRouteCoordinates([]);
    setSelectedMechanic(null);
    setNavigationInfo(null);
    setShowNavigation(false);

    Animated.spring(navigationAnimation, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
  };

  const renderMechanicItem = ({ item }: { item: Mechanic }) => {
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
        style={styles.mechanicItem}
        onPress={() => handleMechanicSelect(item)}
      >
        <View style={styles.mechanicInfo}>
          <Text style={styles.mechanicName}>{item.name}</Text>
          <Text style={styles.mechanicSpecialties}>
            {item.specialties.join(", ")}
          </Text>
          <Text style={styles.mechanicAddress}>{item.location.address}</Text>
          {distance && (
            <Text style={styles.mechanicDistance}>
              {distance.toFixed(1)} km uzaklıkta
            </Text>
          )}
          <View style={styles.mechanicStats}>
            <Text style={styles.mechanicRating}>⭐ {item.rating}</Text>
            <Text style={styles.mechanicPrice}>{item.priceRange}</Text>
            <Text
              style={[
                styles.mechanicStatus,
                { color: item.isOnline ? "#4CAF50" : "#F44336" },
              ]}
            >
              {item.isOnline ? "Çevrimiçi" : "Çevrimdışı"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const searchBarHeight = searchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 300],
  });

  const navigationHeight = navigationAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        loadingIndicatorColor="#2196F3"
        loadingBackgroundColor="#ffffff"
      >
        {mockMechanics.map((mechanic) => (
          <Marker
            key={mechanic.id}
            coordinate={{
              latitude: mechanic.location.latitude,
              longitude: mechanic.location.longitude,
            }}
            title={mechanic.name}
            description={mechanic.specialties.join(", ")}
            pinColor={
              selectedMechanic?.id === mechanic.id ? "#FF6B6B" : "#4CAF50"
            }
            onPress={() => handleMechanicSelect(mechanic)}
          />
        ))}

        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#2196F3"
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}
      </MapView>

      {/* Animasyonlu Arama Çubuğu */}
      <Animated.View
        style={[styles.searchContainer, { height: searchBarHeight }]}
      >
        <TouchableOpacity style={styles.searchHeader} onPress={toggleSearchBar}>
          <Ionicons name="search" size={24} color="#666" />
          <Text style={styles.searchHeaderText}>
            {searchExpanded ? "Arama" : "Tamirci Ara"}
          </Text>
          <Ionicons
            name={searchExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>

        {searchExpanded && (
          <View style={styles.searchContent}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Tamirci adı, uzmanlık veya adres ara..."
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus={true}
                onSubmitEditing={handleSearchButtonPress}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearchButtonPress}
              >
                <Ionicons name="search" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredMechanics}
              renderItem={renderMechanicItem}
              keyExtractor={(item) => item.id}
              style={styles.mechanicsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </Animated.View>

      {/* Tamirci Modal Penceresi */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tamirci Bilgileri</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>

            {modalMechanic && (
              <ScrollView style={styles.modalContent}>
                <View style={styles.mechanicDetailCard}>
                  <Text style={styles.modalMechanicName}>
                    {modalMechanic.name}
                  </Text>

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="build" size={16} color="#666" />
                    <Text style={styles.modalInfoText}>
                      Uzmanlık: {modalMechanic.specialties.join(", ")}
                    </Text>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="location" size={16} color="#666" />
                    <Text style={styles.modalInfoText}>
                      Adres: {modalMechanic.location.address}
                    </Text>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="star" size={16} color="#FF9800" />
                    <Text style={styles.modalInfoText}>
                      Değerlendirme: {modalMechanic.rating} ⭐
                    </Text>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Ionicons name="cash" size={16} color="#4CAF50" />
                    <Text style={styles.modalInfoText}>
                      Fiyat Aralığı: {modalMechanic.priceRange}
                    </Text>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <Ionicons
                      name={
                        modalMechanic.isOnline
                          ? "checkmark-circle"
                          : "close-circle"
                      }
                      size={16}
                      color={modalMechanic.isOnline ? "#4CAF50" : "#F44336"}
                    />
                    <Text
                      style={[
                        styles.modalInfoText,
                        {
                          color: modalMechanic.isOnline ? "#4CAF50" : "#F44336",
                        },
                      ]}
                    >
                      Durum:{" "}
                      {modalMechanic.isOnline ? "Çevrimiçi" : "Çevrimdışı"}
                    </Text>
                  </View>

                  {userLocation && (
                    <View style={styles.modalInfoRow}>
                      <Ionicons name="navigate" size={16} color="#2196F3" />
                      <Text style={styles.modalInfoText}>
                        Mesafe:{" "}
                        {calculateDistance(
                          userLocation.latitude,
                          userLocation.longitude,
                          modalMechanic.location.latitude,
                          modalMechanic.location.longitude
                        ).toFixed(1)}{" "}
                        km
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.locationButton]}
                    onPress={() => goToLocation(modalMechanic)}
                  >
                    <Ionicons name="location" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>Konuma Git</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.routeButton]}
                    onPress={() => {
                      setModalVisible(false);
                      openGoogleMapsRoute(modalMechanic);
                    }}
                  >
                    <Ionicons name="navigate" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>Rota Oluştur</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Navigasyon Paneli */}
      {showNavigation && navigationInfo && (
        <Animated.View
          style={[styles.navigationContainer, { height: navigationHeight }]}
        >
          <View style={styles.navigationHeader}>
            <View style={styles.navigationInfo}>
              <Text style={styles.navigationDistance}>
                {navigationInfo.totalDistance.toFixed(1)} km
              </Text>
              <Text style={styles.navigationDuration}>
                {formatDuration(navigationInfo.totalDuration)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={clearRoute}
              style={styles.closeNavButton}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.navigationSteps}>
            {navigationInfo.steps.slice(0, 3).map((step, index) => (
              <View key={index} style={styles.navigationStep}>
                <Text style={styles.stepInstruction}>{step.instruction}</Text>
                <Text style={styles.stepDistance}>
                  {step.distance.toFixed(1)} km -{" "}
                  {formatDuration(step.duration)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Yükleme Göstergesi */}
      {isCalculatingRoute && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Rota hesaplanıyor...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden",
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchHeaderText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  searchContent: {
    flex: 1,
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    fontSize: 16,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  mechanicsList: {
    flex: 1,
  },
  mechanicItem: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  mechanicSpecialties: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  mechanicAddress: {
    fontSize: 12,
    color: "#888",
    marginBottom: 6,
  },
  mechanicDistance: {
    fontSize: 11,
    color: "#2196F3",
    fontWeight: "600",
    marginBottom: 6,
  },
  mechanicStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mechanicRating: {
    fontSize: 12,
    color: "#FF9800",
    fontWeight: "600",
  },
  mechanicPrice: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  mechanicStatus: {
    fontSize: 11,
    fontWeight: "600",
  },
  // Modal Stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    maxHeight: "80%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    minHeight: 40,
    minWidth: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
  },
  mechanicDetailCard: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalMechanicName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalInfoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    minHeight: 50,
  },
  locationButton: {
    backgroundColor: "#4CAF50",
  },
  routeButton: {
    backgroundColor: "#2196F3",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  navigationContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    overflow: "hidden",
  },
  navigationHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  navigationInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  navigationDistance: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
    marginRight: 12,
  },
  navigationDuration: {
    fontSize: 14,
    color: "#666",
  },
  closeNavButton: {
    padding: 4,
  },
  navigationSteps: {
    flex: 1,
    paddingHorizontal: 16,
  },
  navigationStep: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  stepInstruction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  stepDistance: {
    fontSize: 12,
    color: "#666",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 10,
    elevation: 5,
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});

export default MapScreen;
