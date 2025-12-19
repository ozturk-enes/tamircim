import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Mechanic } from '@/types';

const { width } = Dimensions.get("window");

interface MechanicDetailModalProps {
  visible: boolean;
  mechanic: Mechanic | null;
  onClose: () => void;
  onAppointment: () => void;
  onNavigate: () => void;
}

export default function MechanicDetailModal({
  visible,
  mechanic,
  onClose,
  onAppointment,
  onNavigate,
}: MechanicDetailModalProps) {
  const modalAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(modalAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!mechanic) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            Platform.OS === "web"
              ? styles.modalContentWeb
              : styles.modalContentMobile,
            {
              transform: [
                {
                  scale: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
              opacity: modalAnimation,
            },
          ]}
        >
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>
                {mechanic.serviceTitle}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                accessible={true}
                accessibilityLabel="Kapat"
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={Colors.light.tabIconDefault}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.modalOnlineIndicator,
                {
                  backgroundColor: mechanic.isOnline
                    ? Colors.light.success
                    : Colors.light.tabIconDefault,
                },
              ]}
            >
              <Text style={styles.onlineText}>
                {mechanic.isOnline ? "Çevrimiçi" : "Çevrimdışı"}
              </Text>
            </View>
          </View>

          {/* Mechanic Info */}
          <View style={styles.modalMechanicInfo}>
            <View style={styles.modalAvatar}>
              <Ionicons name="person" size={32} color="white" />
            </View>
            <View style={styles.modalInfoText}>
              <Text style={styles.modalMechanicName}>
                {mechanic.name}
              </Text>
              <View style={styles.modalRating}>
                <Ionicons name="star" size={18} color="#FFD700" />
                <Text style={styles.modalRatingText}>
                  {mechanic.rating} ({mechanic.reviewCount} değerlendirme)
                </Text>
              </View>
            </View>
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons
                name="call"
                size={16}
                color={Colors.light.primary}
              />
              <Text style={styles.detailLabel}>Telefon</Text>
              <Text style={styles.detailValue}>
                {mechanic.phone}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="location"
                size={16}
                color={Colors.light.primary}
              />
              <Text style={styles.detailLabel}>Adres</Text>
              <Text style={styles.detailValue}>
                {mechanic.location.address}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="time"
                size={16}
                color={Colors.light.primary}
              />
              <Text style={styles.detailLabel}>Çalışma Saatleri</Text>
              <Text style={styles.detailValue}>
                {mechanic.workingHours}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons
                name="cash"
                size={16}
                color={Colors.light.primary}
              />
              <Text style={styles.detailLabel}>Fiyat Aralığı</Text>
              <Text style={styles.detailValue}>
                {mechanic.priceRange}
              </Text>
            </View>
          </View>

          {/* Specialties */}
          <View style={styles.specialtiesContainer}>
            <Text style={styles.specialtiesTitle}>Uzmanlık Alanları</Text>
            <View style={styles.specialtiesGrid}>
              {mechanic.specialties.map(
                (specialty: string, index: number) => (
                  <View key={index} style={styles.specialtyChip}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                )
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.appointmentButton}
              onPress={onAppointment}
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel="Randevu al"
            >
              <Ionicons name="calendar" size={20} color="white" />
              <Text style={styles.appointmentButtonText}>Randevu Al</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.callButton}
              onPress={onNavigate}
              activeOpacity={0.8}
              accessible={true}
              accessibilityLabel="Konuma Git"
            >
              <Ionicons name="navigate" size={20} color="white" />
              <Text style={styles.callButtonText}>Konuma Git</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalContentWeb: {
    maxWidth: 500,
    width: "90%",
  },
  modalContentMobile: {
    maxWidth: width - 40,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.primary,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOnlineIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  onlineText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  modalMechanicInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  modalAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modalInfoText: {
    flex: 1,
  },
  modalMechanicName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  modalRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalRatingText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginLeft: 6,
  },
  detailsGrid: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginLeft: 8,
    marginRight: 8,
    minWidth: 80,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
    fontWeight: "500",
  },
  specialtiesContainer: {
    marginBottom: 24,
  },
  specialtiesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 12,
  },
  specialtiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  appointmentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  appointmentButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.success,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: Colors.light.success,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
});
