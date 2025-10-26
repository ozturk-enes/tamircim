import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Car } from '../../constants/mockData';

export interface CarCardProps {
  car: Car;
  onPress?: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
  onServicePress?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  showServiceButton?: boolean;
  isSelected?: boolean;
  style?: ViewStyle;
  lastServiceDate?: string;
  nextServiceDate?: string;
  mileage?: number;
}

const CarCard: React.FC<CarCardProps> = ({
  car,
  onPress,
  onEditPress,
  onDeletePress,
  onServicePress,
  variant = 'default',
  showActions = true,
  showServiceButton = false,
  isSelected = false,
  style,
  lastServiceDate,
  nextServiceDate,
  mileage,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      marginVertical: 6,
      marginHorizontal: 16,
      overflow: 'hidden',
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    };

    if (variant === 'compact') {
      baseStyle.marginVertical = 4;
      baseStyle.marginHorizontal = 8;
    }

    if (isSelected) {
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = '#007AFF';
    }

    return baseStyle;
  };

  const getContentStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: '#FFFFFF',
      padding: variant === 'compact' ? 12 : 16,
    };

    return baseStyle;
  };

  const getCarBrandColor = (brand: string): string => {
    const colors: { [key: string]: string } = {
      'Toyota': '#FF6B6B',
      'BMW': '#4ECDC4',
      'Mercedes': '#45B7D1',
      'Volkswagen': '#96CEB4',
      'Ford': '#FFEAA7',
      'Renault': '#DDA0DD',
      'Hyundai': '#98D8C8',
      'Kia': '#F7DC6F',
    };
    return colors[brand] || '#6C757D';
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.carImageContainer}>
          <Image
            source={car.image || require('../../assets/images/favicon.png')}
            style={[
              styles.carImage,
              variant === 'compact' && styles.carImageCompact
            ]}
          />
          <View style={[
            styles.brandIndicator,
            { backgroundColor: getCarBrandColor(car.brand) }
          ]} />
        </View>
        
        <View style={styles.headerInfo}>
          <Text style={[
            styles.carName,
            variant === 'compact' && styles.carNameCompact
          ]} numberOfLines={1}>
            {car.brand} {car.model}
          </Text>
          
          <View style={styles.carDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={14} color="#6C757D" />
              <Text style={styles.detailText}>{car.year}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="color-palette" size={14} color="#6C757D" />
              <Text style={styles.detailText}>{car.color}</Text>
            </View>
          </View>
          
          <View style={styles.plateContainer}>
            <Text style={styles.plateText}>{car.plate}</Text>
          </View>
        </View>
        
        {variant !== 'compact' && showActions && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={onEditPress}
              activeOpacity={0.7}
            >
              <Ionicons name="create" size={20} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionIcon}
              onPress={onDeletePress}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={20} color="#DC3545" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderServiceInfo = () => {
    if (variant === 'compact' || (!lastServiceDate && !nextServiceDate && !mileage)) {
      return null;
    }

    return (
      <View style={styles.serviceContainer}>
        <Text style={styles.serviceLabel}>Servis Bilgileri</Text>
        
        {mileage && (
          <View style={styles.serviceRow}>
            <Ionicons name="speedometer" size={16} color="#6C757D" />
            <Text style={styles.serviceText}>
              {mileage.toLocaleString()} km
            </Text>
          </View>
        )}
        
        {lastServiceDate && (
          <View style={styles.serviceRow}>
            <Ionicons name="checkmark-circle" size={16} color="#34C759" />
            <Text style={styles.serviceText}>
              Son Servis: {lastServiceDate}
            </Text>
          </View>
        )}
        
        {nextServiceDate && (
          <View style={styles.serviceRow}>
            <Ionicons name="time" size={16} color="#FF9500" />
            <Text style={styles.serviceText}>
              Sonraki Servis: {nextServiceDate}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderActions = () => {
    if (!showServiceButton || variant === 'compact') return null;

    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.serviceButton}
          onPress={onServicePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#007AFF', '#0056CC']}
            style={styles.serviceButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="build" size={18} color="#FFFFFF" />
            <Text style={styles.serviceButtonText}>Servis Talep Et</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSelectedBadge = () => {
    if (!isSelected) return null;

    return (
      <View style={styles.selectedBadge}>
        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
      </View>
    );
  };

  const renderCard = () => {
    const cardStyle = getCardStyle();
    const contentStyle = getContentStyle();

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={[cardStyle, style]}>
          <View style={contentStyle}>
            {renderHeader()}
            {renderServiceInfo()}
            {renderActions()}
          </View>
          {renderSelectedBadge()}
        </View>
      </TouchableOpacity>
    );
  };

  return renderCard();
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  carImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  carImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  carImageCompact: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  brandIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  carName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 6,
  },
  carNameCompact: {
    fontSize: 16,
    marginBottom: 4,
  },
  carDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 4,
  },
  plateContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  plateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginLeft: 8,
  },
  serviceContainer: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  serviceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  serviceText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 8,
  },
  actionsContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  serviceButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  serviceButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  serviceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default CarCard;