import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ViewStyle, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Car } from '../types';
import Colors from '../constants/Colors';

export interface CarCardProps {
  car: Car;
  onPress?: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
  isSelected?: boolean;
  variant?: 'default' | 'compact';
  style?: ViewStyle;
}

const CarCard: React.FC<CarCardProps> = ({
  car,
  onPress,
  onEditPress,
  onDeletePress,
  isSelected = false,
  variant = 'default',
  style,
}) => {
  const isCompact = variant === 'compact';

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isCompact && styles.cardCompact,
        isSelected && styles.cardSelected,
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
             <Image 
                source={typeof car.image === 'string' ? { uri: car.image } : car.image} 
                style={styles.image} 
                resizeMode="cover"
             />
        </View>

        {/* Info Section */}
        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.brandModel}>
              {car.brand} {car.model}
            </Text>
            {onEditPress && (
              <TouchableOpacity onPress={onEditPress} style={styles.iconButton}>
                <Ionicons name="create-outline" size={20} color={Colors.light.tint} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{car.year}</Text>
            </View>
            <Text style={styles.plateText}>{car.plate}</Text>
          </View>
          
          {!isCompact && (
             <View style={styles.extraInfo}>
                 <Text style={styles.colorText}>{car.color}</Text>
             </View>
          )}
        </View>

        {/* Delete Action */}
        {onDeletePress && (
             <TouchableOpacity onPress={onDeletePress} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
             </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
  },
  cardCompact: {
    marginBottom: 8,
    borderRadius: 12,
  },
  cardSelected: {
    borderColor: Colors.light.tint,
    borderWidth: 2,
    backgroundColor: '#F8F9FF',
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  brandModel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  plateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },
  extraInfo: {
    marginTop: 4,
  },
  colorText: {
    fontSize: 12,
    color: '#888',
  },
  iconButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 4,
  }
});

import { Platform } from 'react-native';

export default CarCard;
