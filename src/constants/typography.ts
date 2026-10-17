/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Design Tokens: Typography
 *  الطباعة وعائلة خطوط ثمانية
 * ═══════════════════════════════════════════════════════
 */

import { TextStyle } from 'react-native';

// ─── أسماء الخطوط المسجّلة (Registered Font Names) ───────────────────────────
export const FontFamily = {
  // Thmanyah Sans — واجهة المستخدم الرقمية
  sansLight:    'ThmanyahSans-Light',
  sansRegular:  'ThmanyahSans-Regular',
  sansMedium:   'ThmanyahSans-Medium',
  sansBold:     'ThmanyahSans-Bold',
  sansBlack:    'ThmanyahSans-Black',

  // Thmanyah Serif Display — العناوين الكبرى وشاشات الترحيب
  displayLight:   'ThmanyahSerifDisplay-Light',
  displayRegular: 'ThmanyahSerifDisplay-Regular',
  displayMedium:  'ThmanyahSerifDisplay-Medium',
  displayBold:    'ThmanyahSerifDisplay-Bold',
  displayBlack:   'ThmanyahSerifDisplay-Black',

  // Thmanyah Serif Text — المحتوى التحريري والنصوص الطويلة
  textLight:   'ThmanyahSerifText-Light',
  textRegular: 'ThmanyahSerifText-Regular',
  textMedium:  'ThmanyahSerifText-Medium',
  textBold:    'ThmanyahSerifText-Bold',
  textBlack:   'ThmanyahSerifText-Black',
} as const;

// ─── الهرم الطباعي (Type Scale) ──────────────────────────────────────────────
export const TypeScale = {
  /** شاشات العرض الكبرى (Hero / Splash) */
  displayXL: {
    fontFamily: FontFamily.displayBold,
    fontSize: 40,
    lineHeight: 56,
    letterSpacing: 0.5,
  } satisfies TextStyle,

  displayLG: {
    fontFamily: FontFamily.displayBold,
    fontSize: 32,
    lineHeight: 44,
    letterSpacing: 0.3,
  } satisfies TextStyle,

  /** عناوين الشاشات (Screen Titles) */
  headingXL: {
    fontFamily: FontFamily.displayMedium,
    fontSize: 28,
    lineHeight: 38,
  } satisfies TextStyle,

  headingLG: {
    fontFamily: FontFamily.sansBold,
    fontSize: 22,
    lineHeight: 30,
  } satisfies TextStyle,

  headingMD: {
    fontFamily: FontFamily.sansBold,
    fontSize: 18,
    lineHeight: 26,
  } satisfies TextStyle,

  headingSM: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 16,
    lineHeight: 22,
  } satisfies TextStyle,

  /** نصوص الجسم (Body Text) */
  bodyLG: {
    fontFamily: FontFamily.sansRegular,
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,

  bodyMD: {
    fontFamily: FontFamily.sansRegular,
    fontSize: 14,
    lineHeight: 22,
  } satisfies TextStyle,

  bodySM: {
    fontFamily: FontFamily.sansRegular,
    fontSize: 12,
    lineHeight: 18,
  } satisfies TextStyle,

  /** المحتوى التحريري (Editorial / Long-form) */
  editorialLG: {
    fontFamily: FontFamily.textRegular,
    fontSize: 16,
    lineHeight: 28,
  } satisfies TextStyle,

  editorialMD: {
    fontFamily: FontFamily.textRegular,
    fontSize: 14,
    lineHeight: 24,
  } satisfies TextStyle,

  /** تسميات وأزرار (Labels & Buttons) */
  labelLG: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.1,
  } satisfies TextStyle,

  labelMD: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 14,
    lineHeight: 18,
  } satisfies TextStyle,

  labelSM: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 12,
    lineHeight: 16,
  } satisfies TextStyle,

  /** الأرقام والجرعات الدوائية (Medical Numbers) */
  dosage: {
    fontFamily: FontFamily.sansBold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0.2,
  } satisfies TextStyle,

  caption: {
    fontFamily: FontFamily.sansLight,
    fontSize: 11,
    lineHeight: 16,
  } satisfies TextStyle,
} as const;

export type TypeScaleKey = keyof typeof TypeScale;
