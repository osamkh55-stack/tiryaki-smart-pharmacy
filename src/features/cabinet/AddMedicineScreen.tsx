/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Feature: AddMedicineScreen (إضافة دواء جديد)
 *  مسح الباركود، ملء البيانات آلياً، والتحقق الاستباقي من الحساسية
 * ═══════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowRight,
  ScanLine,
  Pill,
  Calendar,
  User,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useMedicineStore } from '../../store/useMedicineStore';
import { BarcodeScannerModal } from './BarcodeScannerModal';

const FAMILY_MEMBERS = ['عام للأسرة', 'الوالد (أبو أسامة)', 'الوالدة (أم أسامة)', 'سارة (8 سنوات)'];
const CATEGORIES: ('مزمنة' | 'مسكنات' | 'مضادات' | 'فيتامينات ومكملات' | 'طوارئ' | 'أخرى')[] = [
  'مسكنات',
  'مزمنة',
  'مضادات',
  'فيتامينات ومكملات',
  'طوارئ',
  'أخرى',
];
const STORAGE_LOCATIONS = ['الرف العلوي', 'الرف الأوسط', 'درج الأطفال الآمن', 'الثلاجة الدوائية'];

export const AddMedicineScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const addMedicine = useMedicineStore((state) => state.addMedicine);

  const [name, setName] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [dosage, setDosage] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [storageLocation, setStorageLocation] = useState(STORAGE_LOCATIONS[0]);
  const [category, setCategory] = useState<'مزمنة' | 'مسكنات' | 'مضادات' | 'فيتامينات ومكملات' | 'طوارئ' | 'أخرى'>('مسكنات');
  const [assignedTo, setAssignedTo] = useState(FAMILY_MEMBERS[0]);
  const [instructions, setInstructions] = useState('');
  const [scannerVisible, setScannerVisible] = useState(false);

  // كشف تعارض الحساسية التلقائي
  const hasAllergyConflict =
    (name.toLowerCase().includes('بنسلين') ||
      name.toLowerCase().includes('أوجمنتين') ||
      name.toLowerCase().includes('augmentin') ||
      activeIngredient.toLowerCase().includes('amoxicillin') ||
      activeIngredient.toLowerCase().includes('أموكسيسيلين')) &&
    assignedTo.includes('الوالدة');

  // استلام نتائج المسح من نافذة الكاميرا
  const handleScanResult = (data: {
    barcode: string;
    name: string;
    ingredient: string;
    dosage: string;
    expiryDate: string;
  }) => {
    setName(data.name);
    setActiveIngredient(data.ingredient);
    setDosage(data.dosage);
    setExpiryDate(data.expiryDate);
    setQuantity('20');
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('تنبيه', 'يرجى كتابة اسم الدواء');
      return;
    }

    if (hasAllergyConflict) {
      Alert.alert(
        '⛔ تحذير خطير - تعارض حساسية!',
        'هذا الدواء يحتوي على مشتقات البنسلين والوالدة مسجلة بحساسية مفرطة. هل أنت متأكد من حفظه؟',
        [
          { text: 'إلغاء وتعديل', style: 'cancel' },
          {
            text: 'متابعة على مسؤوليتي',
            style: 'destructive',
            onPress: () => saveRecord(),
          },
        ]
      );
      return;
    }

    saveRecord();
  };

  const saveRecord = () => {
    addMedicine({
      name,
      activeIngredient: activeIngredient || 'غير محدد',
      dosage: dosage || 'جرعة قياسية',
      quantity: parseInt(quantity, 10) || 1,
      unit: 'عبوة',
      expiryDate: expiryDate || '2027-12-30',
      batchNumber: batchNumber || undefined,
      storageLocation: storageLocation || 'الرف العلوي',
      category,
      assignedTo,
      instructions: instructions || 'حسب إرشادات الطبيب والصيدلي',
      isAllergyRisk: hasAllergyConflict,
      allergyWarning: hasAllergyConflict
        ? 'تحذير: يتعارض مع حساسية مسجلة في ملف الأسرة ⛔'
        : undefined,
    });

    Alert.alert('تم الحفظ بنجاح', 'تمت إضافة الدواء إلى خزانة الأدوية ومزامنة التنبيهات.');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowRight size={22} color={Colors.textPrimary} strokeWidth={IconDefaults.strokeWidth} />
        </TouchableOpacity>
        <Text variant="headingMD" color={Colors.textPrimary}>
          إضافة دواء جديد
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── زر مسح الباركود التفاعلي ─── */}
        <TouchableOpacity
          style={styles.scanBanner}
          onPress={() => setScannerVisible(true)}
          activeOpacity={0.85}
        >
          <View style={styles.scanIconBox}>
            <ScanLine size={28} color={Colors.textOnPrimary} strokeWidth={IconDefaults.strokeWidth} />
          </View>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4 }}>
              <Text variant="labelLG" color={Colors.textOnPrimary}>
                مسح الباركود بالكاميرا
              </Text>
              <Sparkles size={16} color={Colors.secondary} strokeWidth={IconDefaults.strokeWidth} />
            </View>
            <Text variant="caption" color={Colors.green100}>
              يجلب الاسم التجاري والمادة الفعالة والصلاحية تلقائياً
            </Text>
          </View>
        </TouchableOpacity>

        {/* ─── نافذة كاميرا الباركود التفاعلية ─── */}
        <BarcodeScannerModal
          visible={scannerVisible}
          onClose={() => setScannerVisible(false)}
          onScanComplete={handleScanResult}
        />

        {/* ─── تنبيه كشف الحساسية المباشر ─── */}
        {hasAllergyConflict && (
          <View style={styles.alertBanner}>
            <ShieldAlert size={22} color={Colors.danger} strokeWidth={IconDefaults.strokeWidth} />
            <View style={{ flex: 1, marginRight: Spacing.xs }}>
              <Text variant="labelMD" color={Colors.danger}>
                تحذير تعارض طبي حرج!
              </Text>
              <Text variant="caption" color={Colors.danger}>
                المادة الفعالة تتعارض مع حساسية البنسلين المسجلة للوالدة (أم أسامة).
              </Text>
            </View>
          </View>
        )}

        {/* ─── حقول الإدخال ─── */}
        <Card style={styles.formCard}>
          {/* اسم الدواء */}
          <View style={styles.fieldGroup}>
            <Text variant="labelMD" color={Colors.textPrimary}>
              الاسم التجاري للدواء *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: بانادول، أوجمنتين، كونكور..."
              placeholderTextColor={Colors.textSecondary}
              value={name}
              onChangeText={setName}
              textAlign="right"
            />
          </View>

          {/* المادة الفعالة */}
          <View style={styles.fieldGroup}>
            <Text variant="labelMD" color={Colors.textPrimary}>
              المادة الفعالة (العلمية)
            </Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: باراسيتامول، أموكسيسيلين..."
              placeholderTextColor={Colors.textSecondary}
              value={activeIngredient}
              onChangeText={setActiveIngredient}
              textAlign="right"
            />
          </View>

          {/* صف الجرعة والكمية */}
          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text variant="labelMD" color={Colors.textPrimary}>
                الجرعة / التركيز
              </Text>
              <TextInput
                style={styles.input}
                placeholder="مثال: 500 mg"
                placeholderTextColor={Colors.textSecondary}
                value={dosage}
                onChangeText={setDosage}
                textAlign="right"
              />
            </View>

            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text variant="labelMD" color={Colors.textPrimary}>
                الكمية في الخزانة
              </Text>
              <TextInput
                style={styles.input}
                placeholder="عدد الأقراص / العبوات"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
                textAlign="right"
              />
            </View>
          </View>

          {/* تاريخ الصلاحية */}
          <View style={styles.fieldGroup}>
            <Text variant="labelMD" color={Colors.textPrimary}>
              تاريخ انتهاء الصلاحية
            </Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD (مثال: 2027-12-31)"
              placeholderTextColor={Colors.textSecondary}
              value={expiryDate}
              onChangeText={setExpiryDate}
              textAlign="right"
            />
          </View>

          {/* رقم التشغيلة ومكان التخزين */}
          <View style={styles.fieldGroup}>
            <Text variant="labelMD" color={Colors.textPrimary}>
              رقم التشغيلة (Batch/Lot Number) - اختياري
            </Text>
            <TextInput
              style={styles.input}
              placeholder="مثال: LOT-94827"
              placeholderTextColor={Colors.textSecondary}
              value={batchNumber}
              onChangeText={setBatchNumber}
              textAlign="right"
            />
          </View>

          {/* مكان التخزين في الخزانة الذكية */}
          <View style={styles.fieldGroup}>
            <Text variant="labelMD" color={Colors.textPrimary}>
              مكان التخزين داخل الخزانة
            </Text>
            <View style={styles.chipsContainer}>
              {STORAGE_LOCATIONS.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={[
                    styles.chip,
                    storageLocation === loc && styles.chipActive,
                  ]}
                  onPress={() => setStorageLocation(loc)}
                >
                  <Text
                    variant="caption"
                    color={storageLocation === loc ? Colors.textOnPrimary : Colors.textPrimary}
                  >
                    {loc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* مخصص لمن في الأسرة */}
          <View style={styles.fieldGroup}>
            <Text variant="labelMD" color={Colors.textPrimary}>
              تخصيص لمَن من أفراد الأسرة؟
            </Text>
            <View style={styles.chipsContainer}>
              {FAMILY_MEMBERS.map((member) => (
                <TouchableOpacity
                  key={member}
                  style={[
                    styles.chip,
                    assignedTo === member && styles.chipActive,
                  ]}
                  onPress={() => setAssignedTo(member)}
                >
                  <Text
                    variant="caption"
                    color={assignedTo === member ? Colors.textOnPrimary : Colors.textPrimary}
                  >
                    {member}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* التصنيف */}
          <View style={styles.fieldGroup}>
            <Text variant="labelMD" color={Colors.textPrimary}>
              تصنيف الدواء
            </Text>
            <View style={styles.chipsContainer}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.chip,
                    category === cat && styles.chipActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    variant="caption"
                    color={category === cat ? Colors.textOnPrimary : Colors.textPrimary}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* إرشادات الاستخدام */}
          <View style={styles.fieldGroup}>
            <Text variant="labelMD" color={Colors.textPrimary}>
              إرشادات الاستخدام
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="مثال: حبة واحدة يومياً بعد وجبة الإفطار مع كأس ماء كامل..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={3}
              value={instructions}
              onChangeText={setInstructions}
              textAlign="right"
            />
          </View>
        </Card>

        {/* ─── زر الحفظ النهائي ─── */}
        <Button
          label="حفظ في خزانتي وتفعيل الحماية"
          variant="primary"
          onPress={handleSave}
          fullWidth
          size="lg"
          leftIcon={CheckCircle2}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundBase,
  },
  topNav: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.backgroundCard,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.lg,
  },
  scanBanner: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.md,
  },
  scanIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  formCard: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  fieldGroup: {
    gap: Spacing.xs,
  },
  rowFields: {
    flexDirection: 'row-reverse',
    gap: Spacing.md,
  },
  input: {
    backgroundColor: Colors.backgroundBase,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 48,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 80,
    paddingTop: Spacing.sm,
    textAlignVertical: 'top',
  },
  chipsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.backgroundBase,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
