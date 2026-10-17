/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Design Tokens: Icons (Lucide)
 *  إعدادات الأيقونات المعتمدة من مكتبة Lucide
 * ═══════════════════════════════════════════════════════
 */

import { Colors } from './colors';

// ─── الإعدادات الافتراضية المعتمدة ───────────────────────────────────────────
export const IconDefaults = {
  strokeWidth: 2.25,          // سُمك الخط المعتمد رسمياً
  color: Colors.primary,      // اللون الافتراضي: الأخضر الطبي العميق
} as const;

// ─── الأحجام القياسية ─────────────────────────────────────────────────────────
export const IconSize = {
  /** أيقونات شريط التنقل والأزرار الرئيسية */
  nav:   24,
  /** الأيقونات العامة داخل البطاقات والقوائم */
  md:    24,
  /** أيقونات داخل حقول الإدخال والنصوص */
  sm:    20,
  /** أيقونات حالة كبيرة (بطاقات الترحيب / التحذيرات) */
  lg:    32,
  /** أيقونات ضخمة لشاشات الطوارئ أو العرض */
  xl:    40,
} as const;

// ─── ألوان الأيقونات حسب الحالة الوظيفية ────────────────────────────────────
export const IconColors = {
  primary:   Colors.primary,
  secondary: Colors.secondary,
  muted:     Colors.textSecondary,
  success:   Colors.success,
  warning:   Colors.warning,
  danger:    Colors.danger,
  white:     '#FFFFFF',
} as const;

export type IconSizeKey   = keyof typeof IconSize;
export type IconColorKey  = keyof typeof IconColors;
