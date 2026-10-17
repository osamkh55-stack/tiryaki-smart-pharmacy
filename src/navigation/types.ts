/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Navigation: Types
 *  أنواع وتعريفات شاشات التطبيق
 * ═══════════════════════════════════════════════════════
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// ─── شاشات الـ Tab الرئيسية ────────────────────────────────────────────────
export type TabParamList = {
  Home:     undefined;                      // الرئيسية
  Cabinet:  undefined;                      // الخزانة
  Assistant: undefined;                     // المساعد الذكي
  Profile:  undefined;                      // الملف الشخصي
};

// ─── شاشات الـ Stack الرئيسي ───────────────────────────────────────────────
export type RootStackParamList = {
  // شاشات الترحيب والمصادقة
  Splash:    undefined;
  Onboarding: undefined;
  Auth:      undefined;

  // التطبيق الرئيسي
  Main: NavigatorScreenParams<TabParamList>;

  // شاشات الأدوية
  MedicineDetail: { medicineId: string };
  AddMedicine:    { prefillBarcode?: string };
  EditMedicine:   { medicineId: string };
  ScanBarcode:    undefined;

  // شاشات الأسرة
  FamilyMember:   { memberId: string };
  AddFamilyMember: undefined;

  // شاشات الخدمات والتجارة الإلكترونية
  ShoppingList:   undefined;
  IoTDashboard:   undefined;
  ExportReport:   undefined;
  Support:        undefined;
  Pharmacies:     undefined;
  Subscription:   undefined;
};

// ─── اختصارات التنقل ──────────────────────────────────────────────────────
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
