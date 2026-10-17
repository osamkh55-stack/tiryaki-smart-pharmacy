/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  تِرياقي (Tiryāqi) — State Management: useMedicineStore
 *  إدارة البيانات الشاملة: الأدوية، الفيتامينات، قوائم المشتريات، سجلات IoT
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── 1. نماذج البيانات (Data Models) ───────────────────────────────────────
export interface Medicine {
  id: string;
  name: string;
  activeIngredient: string;
  dosage: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  batchNumber?: string;
  storageLocation?: string; // e.g. "الرف العلوي", "الثلاجة"
  category: 'مزمنة' | 'مسكنات' | 'مضادات' | 'فيتامينات ومكملات' | 'طوارئ' | 'أخرى';
  assignedTo: string;
  instructions: string;
  isAllergyRisk?: boolean;
  allergyWarning?: string;
  isRefillNeeded?: boolean;
  price?: number;
  isPrescriptionRequired?: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  isUrgent: boolean;
  isBought: boolean;
  estimatedPrice?: number;
  notes?: string;
  addedForUser?: string;
}

export interface LockEventLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'LOCKED' | 'UNLOCKED' | 'UNAUTHORIZED_ATTEMPT' | 'MANUAL_BACKUP_OPEN';
  method: 'APP' | 'FINGERPRINT' | 'MANUAL_KEY';
  details: string;
}

export interface ClimateReadingLog {
  id: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  status: 'OPTIMAL' | 'WARNING' | 'ALERT';
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  chronicConditions: string[];
  allergies: string[]; // e.g. "بنسلين (شديدة)", "أسبرين"
  isPregnantOrLactating?: boolean;
  color: string;
}

interface MedicineStore {
  // ─── حالة الأدوية والمخزون ───
  medicines: Medicine[];
  todayDoses: { id: string; medId: string; name: string; time: string; taken: boolean; user: string }[];
  shoppingList: ShoppingItem[];
  familyMembers: FamilyMember[];

  // ─── حالة خزانة IoT ومستشعراتها ───
  isSimulationMode: boolean; // تمييز واضح بين المحاكاة والعتاد الحقيقي
  isLocked: boolean;
  temperature: number;
  humidity: number;
  tempMinThreshold: number; // الافتراضي: 15°C
  tempMaxThreshold: number; // الافتراضي: 25°C
  humidityMaxThreshold: number; // الافتراضي: 60%
  lockLogs: LockEventLog[];
  climateHistory: ClimateReadingLog[];

  // ─── الإجراءات (Actions) ───
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  removeMedicine: (id: string) => void;
  updateMedicineQuantity: (id: string, delta: number) => void;

  toggleDose: (doseId: string) => void;

  // إدارة قوائم المشتريات
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'isBought'>) => void;
  toggleShoppingItem: (id: string) => void;
  removeShoppingItem: (id: string) => void;

  // تحكم وإدارة أجهزة IoT
  toggleLock: (byUser?: string, method?: 'APP' | 'FINGERPRINT') => void;
  setSimulationMode: (enabled: boolean) => void;
  recordClimateReading: (temp: number, humidity: number) => void;
}

export const useMedicineStore = create<MedicineStore>()(
  persist(
    (set, get) => ({
      isSimulationMode: true, // محاكاة افتراضية لحين توفر العتاد
      isLocked: true,
      temperature: 22,
      humidity: 45,
      tempMinThreshold: 15,
      tempMaxThreshold: 25,
      humidityMaxThreshold: 60,

      // أفراد العائلة الافتراضيون
      familyMembers: [
        {
          id: '1',
          name: 'أبو أسامة (الوالد)',
          relation: 'رب الأسرة',
          age: 62,
          chronicConditions: ['ضغط الدم', 'السكري النوع الثاني'],
          allergies: ['لا توجد'],
          color: '#176B57',
        },
        {
          id: '2',
          name: 'أم أسامة (الوالدة)',
          relation: 'الزوجة',
          age: 58,
          chronicConditions: ['الربو'],
          allergies: ['بنسلين (شديدة ⛔)', 'أسبرين'],
          color: '#55B8A5',
        },
        {
          id: '3',
          name: 'سارة',
          relation: 'الابنة',
          age: 8,
          chronicConditions: [],
          allergies: ['الفول السوداني'],
          color: '#E07A5F',
        },
      ],

      // المخزون الأولي المحدث شاملاً الفيتامينات
      medicines: [
        {
          id: '1',
          name: 'بانادول إكسترا (Panadol Extra)',
          activeIngredient: 'باراسيتامول + كافيين',
          dosage: '500 mg',
          quantity: 18,
          unit: 'قرص',
          expiryDate: '2027-12-30',
          batchNumber: 'BCH-8921',
          storageLocation: 'الرف الأوسط',
          category: 'مسكنات',
          assignedTo: 'عام للأسرة',
          instructions: 'قرص أو قرصين كل 6-8 ساعات عند اللزوم بعد الأكل',
          price: 14.5,
        },
        {
          id: '2',
          name: 'أوجمنتين (Augmentin)',
          activeIngredient: 'أموكسيسيلين + كلافولانات',
          dosage: '1 g',
          quantity: 4,
          unit: 'أقراص',
          expiryDate: '2027-01-15',
          batchNumber: 'AUG-4011',
          storageLocation: 'الرف العلوي',
          category: 'مضادات',
          assignedTo: 'الأب فقط',
          instructions: 'قرص كل 12 ساعة بعد الأكل حتى إكمال الكورس المقرر',
          isAllergyRisk: true,
          allergyWarning: 'خطر طبي: الوالدة لديها حساسية بنسلين شديدة ⛔',
          price: 68.0,
          isPrescriptionRequired: true,
        },
        {
          id: '3',
          name: 'جلوكوفاج (Glucophage)',
          activeIngredient: 'ميتفورمين',
          dosage: '500 mg',
          quantity: 60,
          unit: 'قرص',
          expiryDate: '2028-08-20',
          batchNumber: 'GLU-9902',
          storageLocation: 'الرف السفلي',
          category: 'مزمنة',
          assignedTo: 'أبو أسامة (الوالد)',
          instructions: 'قرص مع وجبة الإفطار وقرص مع العشاء بانتظام',
          price: 22.0,
          isPrescriptionRequired: true,
        },
        {
          id: '4',
          name: 'فيتامين د3 (Vit D3 50,000 IU)',
          activeIngredient: 'كوليكالسيفيرول (Cholecalciferol)',
          dosage: '50,000 IU',
          quantity: 8,
          unit: 'كبسولة',
          expiryDate: '2028-04-10',
          batchNumber: 'VIT-3312',
          storageLocation: 'الرف الأوسط',
          category: 'فيتامينات ومكملات',
          assignedTo: 'أم أسامة (الوالدة)',
          instructions: 'كبسولة واحدة أسبوعياً بعد وجبة رئيسية دسمة',
          price: 38.0,
        },
        {
          id: '5',
          name: 'أوميغا 3 زيت سمك نقي (Omega-3 1000mg)',
          activeIngredient: 'EPA + DHA Fish Oil',
          dosage: '1000 mg',
          quantity: 45,
          unit: 'كبسولة جيلاتينية',
          expiryDate: '2027-11-20',
          batchNumber: 'OMG-771',
          storageLocation: 'الرف الأوسط',
          category: 'فيتامينات ومكملات',
          assignedTo: 'عام للأسرة',
          instructions: 'كبسولة واحدة يومياً لتعزيز صحة القلب والمناعة',
          price: 52.0,
        },
        {
          id: '6',
          name: 'كافوسيد شراب (Kafosed)',
          activeIngredient: 'ديكستروميثورفان',
          dosage: '100 ml',
          quantity: 1,
          unit: 'عبوة',
          expiryDate: '2026-11-01',
          batchNumber: 'KAF-109',
          storageLocation: 'الرف السفلي',
          category: 'طوارئ',
          assignedTo: 'سارة',
          instructions: '5 مل ثلاث مرات يومياً لتهدئة السعال الجاف قبل النوم',
          price: 18.5,
        },
      ],

      todayDoses: [
        { id: 'd1', medId: '3', name: 'جلوكوفاج 500 mg', time: '08:00 ص', taken: true, user: 'أبو أسامة (الوالد)' },
        { id: 'd2', medId: '4', name: 'فيتامين د3 50,000 IU', time: '01:00 م', taken: false, user: 'أم أسامة (الوالدة)' },
        { id: 'd3', medId: '3', name: 'جلوكوفاج 500 mg', time: '08:30 م', taken: false, user: 'أبو أسامة (الوالد)' },
      ],

      // قائمة مشتريات الصيدلية الافتراضية
      shoppingList: [
        {
          id: 's1',
          name: 'مسحات طبية كحولية (Alcohol Swabs)',
          quantity: 1,
          unit: 'علبة (100 مسحة)',
          isUrgent: true,
          isBought: false,
          estimatedPrice: 12.0,
          notes: 'ضروري لتعقيم قياس السكر المنزلي',
        },
        {
          id: 's2',
          name: 'شراب خافض حرارة للأطفال (فيفادول 145 مل)',
          quantity: 1,
          unit: 'عبوة',
          isUrgent: false,
          isBought: false,
          estimatedPrice: 9.5,
          notes: 'للطفلة سارة كاحتياط طوارئ',
        },
        {
          id: 's3',
          name: 'لاصق جروح معقم مقاوم للماء',
          quantity: 2,
          unit: 'علبة',
          isUrgent: false,
          isBought: true,
          estimatedPrice: 16.0,
        },
      ],

      // سجل أحداث القفل الذكي (Audit Logs)
      lockLogs: [
        {
          id: 'l1',
          timestamp: 'اليوم، 08:02 ص',
          user: 'أبو أسامة (الوالد)',
          action: 'UNLOCKED',
          method: 'FINGERPRINT',
          details: 'فتح بالبصمة الحيوية لتناول جرعة الجلوكوفاج الصباحية',
        },
        {
          id: 'l2',
          timestamp: 'اليوم، 08:04 ص',
          user: 'النظام الآلي',
          action: 'LOCKED',
          method: 'APP',
          details: 'إعادة القفل التلقائي لحماية الأطفال',
        },
        {
          id: 'l3',
          timestamp: 'أمس، 09:15 م',
          user: 'أم أسامة (الوالدة)',
          action: 'UNLOCKED',
          method: 'APP',
          details: 'فتح عبر تطبيق تِرياقي',
        },
      ],

      // سجل قراءات المستشعرات
      climateHistory: [
        { id: 'c1', timestamp: '12:00 م', temperature: 22.4, humidity: 44, status: 'OPTIMAL' },
        { id: 'c2', timestamp: '01:00 م', temperature: 22.8, humidity: 45, status: 'OPTIMAL' },
        { id: 'c3', timestamp: '02:00 م', temperature: 23.1, humidity: 46, status: 'OPTIMAL' },
        { id: 'c4', timestamp: '03:00 م', temperature: 22.9, humidity: 45, status: 'OPTIMAL' },
      ],

      addMedicine: (medData) =>
        set((state) => ({
          medicines: [
            {
              ...medData,
              id: Date.now().toString(),
            },
            ...state.medicines,
          ],
        })),

      removeMedicine: (id) =>
        set((state) => ({
          medicines: state.medicines.filter((m) => m.id !== id),
        })),

      updateMedicineQuantity: (id, delta) =>
        set((state) => ({
          medicines: state.medicines.map((m) =>
            m.id === id ? { ...m, quantity: Math.max(0, m.quantity + delta) } : m
          ),
        })),

      toggleDose: (doseId) =>
        set((state) => ({
          todayDoses: state.todayDoses.map((d) =>
            d.id === doseId ? { ...d, taken: !d.taken } : d
          ),
        })),

      addShoppingItem: (item) =>
        set((state) => ({
          shoppingList: [
            {
              ...item,
              id: Date.now().toString(),
              isBought: false,
            },
            ...state.shoppingList,
          ],
        })),

      toggleShoppingItem: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((item) =>
            item.id === id ? { ...item, isBought: !item.isBought } : item
          ),
        })),

      removeShoppingItem: (id) =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((item) => item.id !== id),
        })),

      toggleLock: (byUser = 'المستخدم', method = 'APP') => {
        const nextState = !get().isLocked;
        const newLog: LockEventLog = {
          id: Date.now().toString(),
          timestamp: 'الآن',
          user: byUser,
          action: nextState ? 'LOCKED' : 'UNLOCKED',
          method,
          details: nextState ? 'تم قفل الخزانة وتأمين الأدوية' : 'تم فتح قفل الخزانة عبر التطبيق',
        };

        set((state) => ({
          isLocked: nextState,
          lockLogs: [newLog, ...state.lockLogs],
        }));
      },

      setSimulationMode: (enabled) => set({ isSimulationMode: enabled }),

      recordClimateReading: (temp, humidity) => {
        const { tempMaxThreshold, tempMinThreshold, humidityMaxThreshold } = get();
        const isAlert =
          temp > tempMaxThreshold || temp < tempMinThreshold || humidity > humidityMaxThreshold;

        const newReading: ClimateReadingLog = {
          id: Date.now().toString(),
          timestamp: 'الآن',
          temperature: temp,
          humidity,
          status: isAlert ? 'ALERT' : 'OPTIMAL',
        };

        set((state) => ({
          temperature: temp,
          humidity,
          climateHistory: [newReading, ...state.climateHistory.slice(0, 20)],
        }));
      },
    }),
    {
      name: 'teryaqi-master-storage-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
