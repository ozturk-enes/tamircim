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
import { Mechanic } from '../../constants/mockData';

export interface MechanicCardProps {
  mechanic: Mechanic;
  onPress?: () => void;
  onCallPress?: () => void;
  onMessagePress?: () => void;
  onLocationPress?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  showDistance?: boolean;
  distance?: number;
  isCurrentMechanic?: boolean;
  style?: ViewStyle;
}

const MechanicCard: React.FC<MechanicCardProps> = ({
  mechanic,
  onPress,
  onCallPress,
  onMessagePress,
  onLocationPress,
  variant = 'default',
  showActions = true,
  showDistance = false,
  distance,
  isCurrentMechanic = false,
  style,
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

    return baseStyle;
  };

  const getContentStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: '#FFFFFF',
      padding: variant === 'compact' ? 12 : 16,
    };

    return baseStyle;
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={mechanic.avatar || require('../../assets/images/favicon.png')}
            style={[
              styles.avatar,
              variant === 'compact' && styles.avatarCompact
            ]}
          />
          <View style={[
            styles.onlineIndicator,
            { backgroundColor: mechanic.isOnline ? '#34C759' : '#8E8E93' }
          ]} />
        </View>
        
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={[
              styles.name,
              variant === 'compact' && styles.nameCompact
            ]} numberOfLines={1}>
              {mechanic.name}
            </Text>
            {isCurrentMechanic && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Sen</Text>
              </View>
            )}
          </View>
          
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>
              {mechanic.rating.toFixed(1)}
            </Text>
            <Text style={styles.reviewCount}>
              ({mechanic.reviewCount} değerlendirme)
            </Text>
          </View>
          
          {showDistance && distance !== undefined && (
            <View style={styles.distanceRow}>
              <Ionicons name="location" size={12} color="#6C757D" />
              <Text style={styles.distance}>
                {distance.toFixed(1)} km uzaklıkta
              </Text>
            </View>
          )}
        </View>
        
        {variant !== 'compact' && (
          <TouchableOpacity
            style={styles.locationButton}
            onPress={onLocationPress}
            activeOpacity={0.7}
          >
            <Ionicons name="location" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSpecialties = () => {
    if (variant === 'compact') return null;

    return (
      <View style={styles.specialtiesContainer}>
        <Text style={styles.specialtiesLabel}>Uzmanlık Alanları:</Text>
        <View style={styles.specialtiesRow}>
          {mechanic.specialties.slice(0, 3).map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
          {mechanic.specialties.length > 3 && (
            <View style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>
                +{mechanic.specialties.length - 3}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderDetails = () => {
    if (variant === 'compact') return null;

    return (
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color="#6C757D" />
          <Text style={styles.detailText}>{mechanic.priceRange}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color="#6C757D" />
          <Text style={styles.detailText}>{mechanic.workingHours}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color="#6C757D" />
          <Text style={styles.detailText} numberOfLines={1}>
            {mechanic.location.address}
          </Text>
        </View>
      </View>
    );
  };

  const renderActions = () => {
    if (!showActions || variant === 'compact') return null;

    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={onCallPress}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={18} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Ara</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton]}
          onPress={onMessagePress}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubble" size={18} color="#007AFF" />
          <Text style={[styles.actionButtonText, { color: '#007AFF' }]}>
            Mesaj
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCard = () => {
    const cardStyle = getCardStyle();
    const contentStyle = getContentStyle();

    const content = (
      <View style={[cardStyle, style]}>
        <View style={contentStyle}>
          {renderHeader()}
          {renderSpecialties()}
          {renderDetails()}
          {renderActions()}
        </View>
      </View>
    );

    if (isCurrentMechanic) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <LinearGradient
            colors={['#007AFF', '#0056CC']}
            style={[cardStyle, style]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={[contentStyle, { backgroundColor: 'rgba(255,255,255,0.95)' }]}>
              {renderHeader()}
              {renderSpecialties()}
              {renderDetails()}
              {renderActions()}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        {content}
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
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
  },
  avatarCompact: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    flex: 1,
  },
  nameCompact: {
    fontSize: 16,
  },
  currentBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#6C757D',
    marginLeft: 4,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: '#6C757D',
    marginLeft: 4,
  },
  locationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  specialtiesContainer: {
    marginBottom: 12,
  },
  specialtiesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 6,
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 8,
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  callButton: {
    backgroundColor: '#34C759',
  },
  messageButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});

export default MechanicCard;