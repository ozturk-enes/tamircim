import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: disabled ? 0.6 : 1,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 16;
        baseStyle.minHeight = 36;
        break;
      case 'large':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 24;
        baseStyle.minHeight = 56;
        break;
      default: // medium
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 20;
        baseStyle.minHeight = 48;
        break;
    }

    // Full width
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    // Size text styles
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = 14;
        break;
      case 'large':
        baseTextStyle.fontSize = 18;
        break;
      default: // medium
        baseTextStyle.fontSize = 16;
        break;
    }

    // Variant text styles
    switch (variant) {
      case 'primary':
        baseTextStyle.color = '#FFFFFF';
        break;
      case 'secondary':
        baseTextStyle.color = '#FFFFFF';
        break;
      case 'outline':
        baseTextStyle.color = '#007AFF';
        break;
      case 'danger':
        baseTextStyle.color = '#FFFFFF';
        break;
    }

    return baseTextStyle;
  };

  const renderButton = () => {
    const buttonStyle = getButtonStyle();
    const textStyleCombined = [getTextStyle(), textStyle];

    const content = (
      <>
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' ? '#007AFF' : '#FFFFFF'} 
            style={{ marginRight: icon || title ? 8 : 0 }} 
          />
        )}
        {!loading && icon && <>{icon}</>}
        {title && !loading && (
          <Text style={[textStyleCombined, icon && { marginLeft: 8 }]}>
            {title}
          </Text>
        )}
        {title && loading && (
          <Text style={[textStyleCombined, { marginLeft: 8 }]}>
            {title}
          </Text>
        )}
      </>
    );

    if (variant === 'primary') {
      return (
        <TouchableOpacity
          style={[buttonStyle, style]}
          onPress={onPress}
          disabled={disabled || loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#007AFF', '#0056CC']}
            style={[buttonStyle, { margin: 0, padding: 0 }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {content}
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    const variantStyles = {
      secondary: {
        backgroundColor: '#6C757D',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#007AFF',
      },
      danger: {
        backgroundColor: '#DC3545',
      },
    };

    return (
      <TouchableOpacity
        style={[buttonStyle, variantStyles[variant], style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {content}
      </TouchableOpacity>
    );
  };

  return renderButton();
};

export default Button;