/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Component: Icon
 *  غلاف موحّد لأيقونات Lucide بإعدادات تِرياقي الرسمية
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import { LucideIcon } from 'lucide-react-native';
import { IconDefaults, IconSize, IconColors, IconSizeKey, IconColorKey } from '../../constants/icons';

interface IconProps {
  /** مكوّن الأيقونة من مكتبة lucide-react-native */
  icon: LucideIcon;
  /** الحجم من نظام الحجم المعتمد أو رقم مخصص */
  size?: IconSizeKey | number;
  /** اللون من نظام الألوان المعتمد أو كود hex مخصص */
  color?: IconColorKey | string;
  /** سُمك الخط — الافتراضي 2.25 (المعتمد رسمياً) */
  strokeWidth?: number;
}

/**
 * مكوّن الأيقونة الموحّد لتطبيق تِرياقي.
 *
 * يُطبّق تلقائياً الإعدادات الرسمية:
 * - strokeWidth: 2.25
 * - stroke-linecap & linejoin: round
 *
 * @example
 * <Icon icon={Pill} size="lg" color="primary" />
 * <Icon icon={ShieldAlert} size={40} color="danger" />
 */
export const Icon: React.FC<IconProps> = ({
  icon: LucideIconComponent,
  size = 'md',
  color = 'primary',
  strokeWidth = IconDefaults.strokeWidth,
}) => {
  // تحليل الحجم: إذا كان مفتاحاً من النظام أو رقماً مباشراً
  const resolvedSize =
    typeof size === 'number' ? size : IconSize[size as IconSizeKey];

  // تحليل اللون: إذا كان مفتاحاً من النظام أو كود hex مباشراً
  const resolvedColor =
    color in IconColors
      ? IconColors[color as IconColorKey]
      : color;

  return (
    <LucideIconComponent
      size={resolvedSize}
      color={resolvedColor}
      strokeWidth={strokeWidth}
    />
  );
};
