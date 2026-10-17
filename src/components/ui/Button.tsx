/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Component: Button
 *  زر الإجراء الرئيسي بأنواعه الثلاثة
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Radius, ComponentHeight } from '../../constants/spacing';
import { IconDefaults, IconSize } from '../../constants/icons';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonProps {
  /** نص الزر */
  label: string;
  /** الإجراء عند الضغط */
  onPress: () => void;
  /** نمط الزر */
  variant?: ButtonVariant;
  /** حجم الزر */
  size?: ButtonSize;
  /** أيقونة يسار النص */
  leftIcon?: LucideIcon;
  /** أيقونة يمين النص */
  rightIcon?: LucideIcon;
  /** تعطيل الزر */
  disabled?: boolean;
  /** حالة التحميل */
  loading?: boolean;
  /** أنماط إضافية للحاوية */
  style?: ViewStyle;
  /** زر كامل العرض */
  fullWidth?: boolean;
}

/**
 * زر الإجراء الموحّد لتطبيق تِرياقي.
 *
 * @example
 * <Button label="حفظ الدواء" onPress={handleSave} variant="primary" leftIcon={Pill} />
 * <Button label="إلغاء" onPress={handleCancel} variant="ghost" />
 * <Button label="حذف" onPress={handleDelete} variant="danger" loading={isDeleting} />
 */
export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled = false,
  loading = false,
  style,
  fullWidth = false,
}) => {
  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth ? styles.fullWidth : undefined,
    isDisabled ? styles.disabled : undefined,
    style,
  ];

  const textColor = getTextColor(variant, isDisabled);
  const iconColor = textColor;
  const iconSize  = size === 'sm' ? IconSize.sm : IconSize.nav;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? Colors.textOnPrimary : Colors.primary}
        />
      ) : (
        <View style={styles.content}>
          {RightIcon && (
            <RightIcon
              size={iconSize}
              color={iconColor}
              strokeWidth={IconDefaults.strokeWidth}
              style={styles.iconRight}
            />
          )}
          <Text
            variant={size === 'sm' ? 'labelMD' : 'labelLG'}
            color={textColor}
            align="center"
          >
            {label}
          </Text>
          {LeftIcon && (
            <LeftIcon
              size={iconSize}
              color={iconColor}
              strokeWidth={IconDefaults.strokeWidth}
              style={styles.iconLeft}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── حساب لون النص حسب نوع الزر ─────────────────────────────────────────────
function getTextColor(variant: ButtonVariant, disabled: boolean): string {
  if (disabled) return Colors.textSecondary;
  switch (variant) {
    case 'primary':   return Colors.textOnPrimary;
    case 'danger':    return Colors.textOnPrimary;
    case 'secondary': return Colors.primary;
    case 'outline':   return Colors.primary;
    case 'ghost':     return Colors.primary;
  }
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row-reverse', // RTL: أيقونة اليمين أولاً
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },

  // ─── الأنماط ─────────────────────────────────────────
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.primaryLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.danger,
  },

  // ─── الأحجام ─────────────────────────────────────────
  size_sm: {
    height: ComponentHeight.buttonSM,
    paddingHorizontal: Spacing.lg,
  },
  size_md: {
    height: ComponentHeight.button,
    paddingHorizontal: Spacing['2xl'],
  },
  size_lg: {
    height: ComponentHeight.buttonLG,
    paddingHorizontal: Spacing['3xl'],
  },

  iconLeft: {
    marginLeft: Spacing.xs,
  },
  iconRight: {
    marginRight: Spacing.xs,
  },
});
