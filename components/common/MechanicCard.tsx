import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import type { Mechanic } from '@/constants/mockData';

interface Props {
  mechanic: Mechanic & {
    serviceTitle?: string;
    distance?: string | number;
    experience?: string;
    completedJobs?: number;
  };
  onPress: () => void;
  onCall: () => void;
}

export default function MechanicCard({ mechanic, onPress, onCall }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8} accessible accessibilityLabel={`${mechanic.name} tamirci kartı`}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceTitle}>{mechanic.serviceTitle || 'Hizmet'}</Text>
        <View style={[styles.onlineIndicator, { backgroundColor: mechanic.isOnline ? Colors.light.success : Colors.light.tabIconDefault }]} />
      </View>

      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={28} color="white" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{mechanic.name}</Text>

          <TouchableOpacity style={styles.phoneRow} onPress={onCall} activeOpacity={0.7}>
            <Ionicons name="call" size={14} color={Colors.light.primary} />
            <Text style={styles.phoneText}>{mechanic.phone}</Text>
          </TouchableOpacity>

          <View style={styles.addressRow}>
            <Ionicons name="location" size={14} color={Colors.light.tabIconDefault} />
            <Text style={styles.addressText} numberOfLines={1}>{mechanic.location.address}</Text>
          </View>

          <View style={styles.workingHoursRow}>
            <Ionicons name="time" size={14} color={Colors.light.tabIconDefault} />
            <Text style={styles.workingHoursText}>{mechanic.workingHours}</Text>
          </View>
        </View>
      </View>

      <View style={styles.ratingPriceRow}>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{mechanic.rating}</Text>
          <Text style={styles.ratingCount}>({mechanic.reviewCount})</Text>
        </View>
        <Text style={styles.priceRange}>{mechanic.priceRange}</Text>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="location" size={12} color={Colors.light.tabIconDefault} />
            <Text style={styles.statText}>{mechanic.distance ?? ''} km</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="briefcase" size={12} color={Colors.light.tabIconDefault} />
            <Text style={styles.statText}>{mechanic.experience ?? ''}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={12} color={Colors.light.success} />
            <Text style={styles.statText}>{mechanic.completedJobs ?? 0} iş</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.contactButton} onPress={onCall} activeOpacity={0.8}>
          <Ionicons name="call" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.lightGray,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
    flex: 1,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 6,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 2,
  },
  phoneText: {
    fontSize: 14,
    color: Colors.light.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
  workingHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  workingHoursText: {
    fontSize: 13,
    color: Colors.light.tabIconDefault,
  },
  ratingPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginLeft: 6,
  },
  priceRange: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.secondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: Colors.light.tabIconDefault,
    marginLeft: 6,
  },
  contactButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
