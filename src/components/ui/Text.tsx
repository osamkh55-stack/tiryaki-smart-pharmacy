/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Component: Text
 *  مكوّن النص الموحّد بنظام الطباعة الرسمي
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { TypeScale, TypeScaleKey } from '../../constants/typography';
import { Colors } from '../../constants/colors';

interface TextProps extends RNTextProps {
  /** الحجم الطباعي من الهرم الرسمي */
  variant?: TypeScaleKey;
  /** اللون — كود hex أو من ثوابت Colors */
  color?: string;
  /** محاذاة النص */
  align?: 'left' | 'center' | 'right' | 'auto';
}

/**
 * مكوّن النص الموحّد لتطبيق تِرياقي.
 * يُطبّق تلقائياً:
 * - خط Thmanyah Sans Regular
 * - اتجاه RTL (writingDirection: rtl)
 * - اللون الافتراضي: #24352F (فحمي مائل للأخضر)
 *
 * @example
 * <Text variant="headingLG">خزانة الأدوية</Text>
 * <Text variant="bodyMD" color={Colors.textSecondary}>آخر تحديث: اليوم</Text>
 * <Text variant="dosage" color={Colors.danger}>500 mg</Text>
 */
export const Text: React.FC<TextProps> = ({
  variant = 'bodyMD',
  color = Colors.textPrimary,
  align = 'right',
  style,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.base,
        TypeScale[variant],
        { color, textAlign: align },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    writingDirection: 'rtl',
  },
});
