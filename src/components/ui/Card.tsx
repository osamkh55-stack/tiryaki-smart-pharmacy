/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Component: Card
 *  بطاقة المحتوى الأساسية
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';

interface CardProps {
  children: React.ReactNode;
  /** تفعيل الضغط على البطاقة */
  onPress?: () => void;
  /** أنماط إضافية */
  style?: StyleProp<ViewStyle>;
  /** نمط البطاقة */
  variant?: 'default' | 'soft' | 'outlined';
  /** إزالة الـ padding الداخلي */
  noPadding?: boolean;
}

/**
 * بطاقة المحتوى الموحّدة لتطبيق تِرياقي.
 *
 * @example
 * <Card onPress={() => navigation.navigate('MedicineDetail', { id })}>
 *   <Text variant="headingSM">أموكسيسيلين</Text>
 *   <Text variant="bodyMD" color={Colors.textSecondary}>500 mg — كبسولات</Text>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'default',
  noPadding = false,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    noPadding ? styles.noPadding : styles.withPadding,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
  },
  withPadding: {
    padding: Spacing.lg,
  },
  noPadding: {},

  // ─── الأنماط ─────────────────────────────────────────
  default: {
    backgroundColor: Colors.backgroundCard,
    // ظل ناعم
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  soft: {
    backgroundColor: Colors.backgroundSoft,
  },
  outlined: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
