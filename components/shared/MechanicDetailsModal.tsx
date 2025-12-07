import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Platform, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import type { Mechanic } from '@/constants/mockData';

interface Props {
  visible: boolean;
  mechanic: Mechanic | null;
  onClose: () => void;
  onAppointment: () => void;
  onCall: (phone: string) => void;
}

export default function MechanicDetailsModal({ visible, mechanic, onClose, onAppointment, onCall }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            Platform.OS === 'web' ? styles.modalContentWeb : styles.modalContentMobile,
            {
              transform: [
                {
                  scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }),
                },
              ],
              opacity: anim,
            },
          ]}
        >
          {mechanic && (
            <>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Text style={styles.modalTitle}>{(mechanic as any).serviceTitle || 'Detay'}</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose} accessible accessibilityLabel="Kapat">
                    <Ionicons name="close" size={24} color={Colors.light.tabIconDefault} />
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    styles.modalOnlineIndicator,
                    { backgroundColor: mechanic.isOnline ? Colors.light.success : Colors.light.tabIconDefault },
                  ]}
                >
                  <Text style={styles.onlineText}>{mechanic.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}</Text>
                </View>
              </View>

              <View style={styles.modalMechanicInfo}>
                <View style={styles.modalAvatar}>
                  <Ionicons name="person" size={32} color="white" />
                </View>
                <View style={styles.modalInfoText}>
                  <Text style={styles.modalMechanicName}>{mechanic.name}</Text>
                  <View style={styles.modalRating}>
                    <Ionicons name="star" size={18} color="#FFD700" />
                    <Text style={styles.modalRatingText}>
                      {mechanic.rating} ({mechanic.reviewCount} değerlendirme)
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Ionicons name="call" size={16} color={Colors.light.primary} />
                  <Text style={styles.detailLabel}>Telefon</Text>
                  <Text style={styles.detailValue}>{mechanic.phone}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="location" size={16} color={Colors.light.primary} />
                  <Text style={styles.detailLabel}>Adres</Text>
                  <Text style={styles.detailValue}>{mechanic.location.address}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="time" size={16} color={Colors.light.primary} />
                  <Text style={styles.detailLabel}>Çalışma Saatleri</Text>
                  <Text style={styles.detailValue}>{mechanic.workingHours}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="cash" size={16} color={Colors.light.primary} />
                  <Text style={styles.detailLabel}>Fiyat Aralığı</Text>
                  <Text style={styles.detailValue}>{mechanic.priceRange}</Text>
                </View>
              </View>

              <View style={styles.specialtiesContainer}>
                <Text style={styles.specialtiesTitle}>Uzmanlık Alanları</Text>
                <View style={styles.specialtiesGrid}>
                  {mechanic.specialties.map((specialty, index) => (
                    <View key={index} style={styles.specialtyChip}>
                      <Text style={styles.specialtyText}>{specialty}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.appointmentButton} onPress={onAppointment} activeOpacity={0.8} accessible accessibilityLabel="Randevu al">
                  <Ionicons name="calendar" size={20} color="white" />
                  <Text style={styles.appointmentButtonText}>Randevu Al</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.callButton} onPress={() => onCall(mechanic.phone)} activeOpacity={0.8} accessible accessibilityLabel="Ara">
                  <Ionicons name="call" size={20} color="white" />
                  <Text style={styles.callButtonText}>Ara</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    maxWidth: 540,
  },
  modalContentWeb: {
    maxWidth: 720,
  },
  modalContentMobile: {
    width: '100%',
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  closeButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
  },
  modalOnlineIndicator: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlineText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
  },
  modalMechanicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalInfoText: {
    flex: 1,
  },
  modalMechanicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 6,
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRatingText: {
    fontSize: 14,
    color: Colors.light.tabIconDefault,
    marginLeft: 6,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    width: '48%',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    padding: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.light.text,
    fontWeight: '600',
    marginTop: 4,
  },
  specialtiesContainer: {
    marginBottom: 16,
  },
  specialtiesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 8,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyChip: {
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  specialtyText: {
    fontSize: 12,
    color: Colors.light.text,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  appointmentButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  appointmentButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    backgroundColor: Colors.light.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  callButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
