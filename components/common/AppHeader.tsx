import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showSearchButton?: boolean;
  showNotificationButton?: boolean;
  showMenuButton?: boolean;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onMenuPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  variant?: 'default' | 'gradient' | 'transparent';
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  notificationBadge?: boolean;
  notificationCount?: number;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  showSearchButton = false,
  showNotificationButton = false,
  showMenuButton = false,
  onBackPress,
  onSearchPress,
  onNotificationPress,
  onMenuPress,
  rightComponent,
  leftComponent,
  backgroundColor = '#007AFF',
  textColor = '#FFFFFF',
  variant = 'gradient',
  style,
  titleStyle,
  subtitleStyle,
  notificationBadge = false,
  notificationCount = 0,
}) => {
  const insets = useSafeAreaInsets();

  const getHeaderStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingTop: insets.top,
      paddingHorizontal: 16,
      paddingBottom: 12,
      minHeight: 60 + insets.top,
    };

    if (variant === 'transparent') {
      baseStyle.backgroundColor = 'transparent';
    } else if (variant === 'default') {
      baseStyle.backgroundColor = backgroundColor;
    }

    return baseStyle;
  };

  const getContentStyle = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 8,
    };
  };

  const getTitleStyle = (): TextStyle => {
    return {
      fontSize: 20,
      fontWeight: '700',
      color: textColor,
      textAlign: 'center',
    };
  };

  const getSubtitleStyle = (): TextStyle => {
    return {
      fontSize: 14,
      fontWeight: '400',
      color: textColor,
      opacity: 0.8,
      textAlign: 'center',
      marginTop: 2,
    };
  };

  const renderLeftSection = () => {
    if (leftComponent) {
      return <View style={styles.sectionContainer}>{leftComponent}</View>;
    }

    return (
      <View style={styles.sectionContainer}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={textColor} />
          </TouchableOpacity>
        )}
        {showMenuButton && !showBackButton && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onMenuPress}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={24} color={textColor} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderCenterSection = () => {
    return (
      <View style={styles.centerContainer}>
        <Text style={[getTitleStyle(), titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[getSubtitleStyle(), subtitleStyle]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    );
  };

  const renderRightSection = () => {
    if (rightComponent) {
      return <View style={styles.sectionContainer}>{rightComponent}</View>;
    }

    return (
      <View style={[styles.sectionContainer, styles.rightSection]}>
        {showSearchButton && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onSearchPress}
            activeOpacity={0.7}
          >
            <Ionicons name="search" size={24} color={textColor} />
          </TouchableOpacity>
        )}
        {showNotificationButton && (
          <TouchableOpacity
            style={[styles.iconButton, { position: 'relative' }]}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications" size={24} color={textColor} />
            {notificationBadge && (
              <View style={styles.notificationBadge}>
                {notificationCount > 0 && notificationCount <= 99 && (
                  <Text style={styles.badgeText}>
                    {notificationCount > 99 ? '99+' : notificationCount.toString()}
                  </Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderHeader = () => {
    const headerStyle = getHeaderStyle();
    const contentStyle = getContentStyle();

    const content = (
      <View style={[headerStyle, style]}>
        <View style={contentStyle}>
          {renderLeftSection()}
          {renderCenterSection()}
          {renderRightSection()}
        </View>
      </View>
    );

    if (variant === 'gradient') {
      return (
        <LinearGradient
          colors={['#007AFF', '#0056CC']}
          style={[headerStyle, style]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={contentStyle}>
            {renderLeftSection()}
            {renderCenterSection()}
            {renderRightSection()}
          </View>
        </LinearGradient>
      );
    }

    return content;
  };

  return (
    <>
      <StatusBar
        barStyle={variant === 'transparent' ? 'dark-content' : 'light-content'}
        backgroundColor={variant === 'transparent' ? 'transparent' : backgroundColor}
        translucent={variant === 'transparent'}
      />
      {renderHeader()}
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  rightSection: {
    justifyContent: 'flex-end',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AppHeader;