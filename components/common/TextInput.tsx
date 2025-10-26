import React, { useState } from 'react';
import { 
  View, 
  TextInput as RNTextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  TouchableOpacity,
  TextInputProps as RNTextInputProps
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  multiline?: boolean;
  numberOfLines?: number;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
  secureTextEntry = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  variant = 'outlined',
  size = 'medium',
  multiline = false,
  numberOfLines = 1,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      marginBottom: 16,
    };

    return baseStyle;
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: multiline ? 'flex-start' : 'center',
      borderRadius: 8,
      backgroundColor: disabled ? '#F8F9FA' : '#FFFFFF',
      opacity: disabled ? 0.6 : 1,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = 12;
        baseStyle.paddingVertical = 8;
        baseStyle.minHeight = 36;
        break;
      case 'large':
        baseStyle.paddingHorizontal = 16;
        baseStyle.paddingVertical = 16;
        baseStyle.minHeight = 56;
        break;
      default: // medium
        baseStyle.paddingHorizontal = 14;
        baseStyle.paddingVertical = 12;
        baseStyle.minHeight = 48;
        break;
    }

    // Variant styles
    switch (variant) {
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = error ? '#DC3545' : isFocused ? '#007AFF' : '#E9ECEF';
        baseStyle.backgroundColor = '#FFFFFF';
        break;
      case 'filled':
        baseStyle.backgroundColor = error ? '#FFF5F5' : isFocused ? '#F0F8FF' : '#F8F9FA';
        baseStyle.borderWidth = 0;
        break;
      default: // default
        baseStyle.borderBottomWidth = 1;
        baseStyle.borderBottomColor = error ? '#DC3545' : isFocused ? '#007AFF' : '#E9ECEF';
        baseStyle.backgroundColor = 'transparent';
        break;
    }

    if (multiline) {
      baseStyle.paddingTop = size === 'small' ? 8 : size === 'large' ? 16 : 12;
      baseStyle.alignItems = 'flex-start';
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      color: '#212529',
      fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
      fontWeight: '400',
    };

    if (multiline) {
      baseStyle.textAlignVertical = 'top';
      baseStyle.minHeight = numberOfLines ? numberOfLines * 20 : 60;
    }

    return baseStyle;
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
      fontWeight: '600',
      color: '#495057',
      marginBottom: 6,
    };
  };

  const getErrorStyle = (): TextStyle => {
    return {
      fontSize: 12,
      color: '#DC3545',
      marginTop: 4,
      fontWeight: '400',
    };
  };

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setIsPasswordVisible(!isPasswordVisible);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIconName = (): keyof typeof Ionicons.glyphMap => {
    if (secureTextEntry) {
      return isPasswordVisible ? 'eye-off' : 'eye';
    }
    return rightIcon || 'chevron-forward';
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
            color={isFocused ? '#007AFF' : '#6C757D'}
            style={{ marginRight: 10 }}
          />
        )}
        
        <RNTextInput
          style={[getInputStyle(), inputStyle]}
          placeholder={placeholder}
          placeholderTextColor="#6C757D"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...props}
        />
        
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            onPress={handleRightIconPress}
            disabled={!secureTextEntry && !onRightIconPress}
            style={{ padding: 4 }}
          >
            <Ionicons
              name={getRightIconName()}
              size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
              color={isFocused ? '#007AFF' : '#6C757D'}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[getErrorStyle(), errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default TextInput;