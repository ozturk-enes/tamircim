import Colors from "@/constants/Colors";
import { mockUsers } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// Mock mechanic data with ratings and pricing
const mechanicsWithDetails = mockUsers.mechanics.map((mechanic, index) => ({
  ...mechanic,
  rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Rating between 3.5-5.0
  averagePrice: Math.floor(Math.random() * 200 + 150), // Price between 150-350
  distance: (Math.random() * 10 + 0.5).toFixed(1), // Distance 0.5-10.5 km
  isOnline: Math.random() > 0.3, // 70% chance of being online
  completedJobs: Math.floor(Math.random() * 100 + 20), // 20-120 completed jobs
  responseTime: Math.floor(Math.random() * 30 + 5), // 5-35 minutes response time
}));

export default function CustomerHomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const categories = [
    "Tümü",
    "Oto Elektrik",
    "Kaporta",
    "Motor",
    "Fren Sistemi",
    "Klima",
    "Lastik",
  ];

  const filteredMechanics = mechanicsWithDetails.filter((mechanic) => {
    const matchesSearch =
      mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mechanic.specialties.some((spec) =>
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "Tümü" ||
      mechanic.specialties.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const handleMechanicPress = (mechanic: any) => {
    Alert.alert(
      mechanic.name,
      `Puan: ${mechanic.rating}/5.0\nOrtalama Fiyat: ₺${
        mechanic.averagePrice
      }\nUzmanlık: ${mechanic.specialties.join(", ")}\nMesafe: ${
        mechanic.distance
      } km\nTamamlanan İş: ${mechanic.completedJobs}`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Ara",
          onPress: () =>
            Alert.alert("Aranıyor...", `${mechanic.phone} aranıyor`),
        },
        {
          text: "Mesaj",
          onPress: () =>
            Alert.alert("Mesaj", "Mesaj özelliği yakında eklenecek!"),
        },
        {
          text: "Detaylar",
          onPress: () =>
            Alert.alert("Detaylar", "Detay sayfası yakında eklenecek!"),
        },
      ]
    );
  };

  const renderMechanicCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.mechanicCard}
      onPress={() => handleMechanicPress(item)}
    >
      <View style={styles.mechanicHeader}>
        <View style={styles.mechanicAvatar}>
          <Ionicons name="person" size={24} color="white" />
        </View>
        <View style={styles.mechanicInfo}>
          <View style={styles.mechanicNameRow}>
            <Text style={styles.mechanicName}>{item.name}</Text>
            <View
              style={[
                styles.onlineIndicator,
                {
                  backgroundColor: item.isOnline
                    ? Colors.light.success
                    : Colors.light.tabIconDefault,
                },
              ]}
            />
          </View>
          <View style={styles.ratingRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.rating}>{item.rating}</Text>
              <Text style={styles.ratingCount}>({item.completedJobs})</Text>
            </View>
            <Text style={styles.averagePrice}>₺{item.averagePrice}</Text>
          </View>
          <Text style={styles.category} numberOfLines={1}>
            {item.specialties[0]}
          </Text>
        </View>
      </View>

      <View style={styles.mechanicFooter}>
        <View style={styles.mechanicStats}>
          <View style={styles.statItem}>
            <Ionicons
              name="location"
              size={12}
              color={Colors.light.tabIconDefault}
            />
            <Text style={styles.statText}>{item.distance} km</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons
              name="time"
              size={12}
              color={Colors.light.tabIconDefault}
            />
            <Text style={styles.statText}>{item.responseTime} dk</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="call" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.lightBlue]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Merhaba!</Text>
            <Text style={styles.userName}>Müşteri Adı</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color={Colors.light.tabIconDefault}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tamirci ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.light.tabIconDefault}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors.light.tabIconDefault}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Selector */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Mechanics List */}
      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Tamirciler ({filteredMechanics.length})
          </Text>
          <TouchableOpacity style={styles.sortButton}>
            <Ionicons name="funnel" size={16} color={Colors.light.primary} />
            <Text style={styles.sortText}>Sırala</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredMechanics}
          renderItem={renderMechanicCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Ionicons
                name="search"
                size={48}
                color={Colors.light.tabIconDefault}
              />
              <Text style={styles.emptyText}>Tamirci bulunamadı</Text>
              <Text style={styles.emptySubtext}>
                Arama kriterlerinizi değiştirip tekrar deneyin
              </Text>
            </View>
          )}
        />
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
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.background,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
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
    marginLeft: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  categoryContainer: {
    paddingVertical: 8,
    backgroundColor: Colors.light.background,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.lightGray,
  },
  categoryChipActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.light.text,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "white",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  sortText: {
    fontSize: 14,
    color: Colors.light.primary,
    marginLeft: 4,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 20,
  },
  mechanicCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mechanicHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  mechanicAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  mechanicName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    flex: 1,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginLeft: 2,
  },
  averagePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  category: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  mechanicFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mechanicStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginLeft: 4,
  },
  contactButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
