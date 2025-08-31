import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONT_SIZES, DIMENSIONS, SPACING } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'premium';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
}) => {
  const buttonStyle = [
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    style,
  ];

  const buttonTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? COLORS.PRIMARY : COLORS.CARD_BACKGROUND} />
      ) : (
        <Text style={buttonTextStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: DIMENSIONS.BUTTON_HEIGHT,
    borderRadius: DIMENSIONS.BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LARGE,
  },
  text: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: '600',
  },
  primary: {
    backgroundColor: COLORS.PRIMARY,
  },
  primaryText: {
    color: COLORS.CARD_BACKGROUND,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  secondaryText: {
    color: COLORS.PRIMARY,
  },
  premium: {
    backgroundColor: COLORS.PREMIUM,
  },
  premiumText: {
    color: COLORS.CARD_BACKGROUND,
  },
  disabled: {
    backgroundColor: COLORS.TEXT_LIGHT,
  },
  disabledText: {
    color: COLORS.TEXT_SECONDARY,
  },
});