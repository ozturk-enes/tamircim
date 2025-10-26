import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Job } from '../../constants/mockData';

export interface JobCardProps {
  job: Job;
  onPress?: () => void;
  onAcceptPress?: () => void;
  onRejectPress?: () => void;
  onCompletePress?: () => void;
  onCallCustomerPress?: () => void;
  onMessageCustomerPress?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  style?: ViewStyle;
  progress?: number; // 0-100 for in_progress jobs
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onPress,
  onAcceptPress,
  onRejectPress,
  onCompletePress,
  onCallCustomerPress,
  onMessageCustomerPress,
  variant = 'default',
  showActions = true,
  style,
  progress = 0,
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

  const getStatusColor = (status: Job['status']): string => {
    switch (status) {
      case 'pending':
        return '#FF9500';
      case 'accepted':
        return '#007AFF';
      case 'in_progress':
        return '#34C759';
      case 'completed':
        return '#28A745';
      case 'rejected':
        return '#DC3545';
      default:
        return '#6C757D';
    }
  };

  const getStatusText = (status: Job['status']): string => {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'accepted':
        return 'Kabul Edildi';
      case 'in_progress':
        return 'Devam Ediyor';
      case 'completed':
        return 'Tamamlandı';
      case 'rejected':
        return 'Reddedildi';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: Job['status']): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case 'pending':
        return 'time';
      case 'accepted':
        return 'checkmark-circle';
      case 'in_progress':
        return 'build';
      case 'completed':
        return 'checkmark-done-circle';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[
            styles.jobTitle,
            variant === 'compact' && styles.jobTitleCompact
          ]} numberOfLines={1}>
            {job.title}
          </Text>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(job.status) }
            ]}>
              <Ionicons 
                name={getStatusIcon(job.status)} 
                size={12} 
                color="#FFFFFF" 
              />
              <Text style={styles.statusText}>
                {getStatusText(job.status)}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          <Text style={styles.priceText}>
            {job.actualPrice || job.estimatedPrice} TL
          </Text>
          {job.actualPrice && job.actualPrice !== job.estimatedPrice && (
            <Text style={styles.estimatedPriceText}>
              (Tahmini: {job.estimatedPrice} TL)
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderCustomerInfo = () => {
    if (variant === 'compact') return null;

    return (
      <View style={styles.customerContainer}>
        <View style={styles.customerRow}>
          <Ionicons name="person" size={16} color="#6C757D" />
          <Text style={styles.customerText}>
            {job.customerName || 'Müşteri Bilgisi Yok'}
          </Text>
        </View>
        
        <View style={styles.customerRow}>
          <Ionicons name="car" size={16} color="#6C757D" />
          <Text style={styles.customerText}>
            {job.carInfo || 'Araç Bilgisi Yok'}
          </Text>
        </View>
        
        <View style={styles.customerRow}>
          <Ionicons name="calendar" size={16} color="#6C757D" />
          <Text style={styles.customerText}>
            {formatDate(job.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const renderDescription = () => {
    if (variant === 'compact') return null;

    return (
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionLabel}>Açıklama:</Text>
        <Text style={styles.descriptionText} numberOfLines={3}>
          {job.description}
        </Text>
      </View>
    );
  };

  const renderProgress = () => {
    if (job.status !== 'in_progress' || variant === 'compact') return null;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>İlerleme</Text>
          <Text style={styles.progressPercentage}>{progress}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            { width: `${progress}%` }
          ]} />
        </View>
      </View>
    );
  };

  const renderActions = () => {
    if (!showActions || variant === 'compact') return null;

    const renderPendingActions = () => (
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rejectButton]}
          onPress={onRejectPress}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Reddet</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={onAcceptPress}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Kabul Et</Text>
        </TouchableOpacity>
      </View>
    );

    const renderActiveActions = () => (
      <View style={styles.actionsContainer}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={onCallCustomerPress}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Ara</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.messageButton]}
            onPress={onMessageCustomerPress}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubble" size={16} color="#007AFF" />
            <Text style={[styles.actionButtonText, { color: '#007AFF' }]}>
              Mesaj
            </Text>
          </TouchableOpacity>
        </View>
        
        {job.status === 'in_progress' && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={onCompletePress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#34C759', '#28A745']}
              style={styles.completeButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
              <Text style={styles.completeButtonText}>Tamamla</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );

    switch (job.status) {
      case 'pending':
        return renderPendingActions();
      case 'accepted':
      case 'in_progress':
        return renderActiveActions();
      default:
        return null;
    }
  };

  const renderCard = () => {
    const cardStyle = getCardStyle();
    const contentStyle = getContentStyle();

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <View style={[cardStyle, style]}>
          <View style={contentStyle}>
            {renderHeader()}
            {renderCustomerInfo()}
            {renderDescription()}
            {renderProgress()}
            {renderActions()}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return renderCard();
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 6,
  },
  jobTitleCompact: {
    fontSize: 16,
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007AFF',
  },
  estimatedPriceText: {
    fontSize: 12,
    color: '#6C757D',
    textDecorationLine: 'line-through',
  },
  customerContainer: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  customerText: {
    fontSize: 14,
    color: '#6C757D',
    marginLeft: 8,
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 3,
  },
  actionsContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  acceptButton: {
    backgroundColor: '#34C759',
  },
  rejectButton: {
    backgroundColor: '#DC3545',
  },
  callButton: {
    backgroundColor: '#007AFF',
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
  completeButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  completeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default JobCard;