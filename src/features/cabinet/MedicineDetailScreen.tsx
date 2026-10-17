/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Feature: MedicineDetailScreen (تفاصيل الدواء والطلب المباشر)
 *  عرض كامل لمعلومات الدواء، فحص التعارضات، وإعادة التعبئة (Auto-Refill)
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  ArrowRight,
  Pill,
  Calendar,
  Clock,
  User,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  Share2,
  ExternalLink,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useMedicineStore } from '../../store/useMedicineStore';

export const MedicineDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { medicineId } = route.params || { medicineId: '1' };

  const { medicines, removeMedicine } = useMedicineStore();
  const medicine = medicines.find((m) => m.id === medicineId) || medicines[0];

  const handleDelete = () => {
    Alert.alert('حذف الدواء', 'هل أنت متأكد من رغبتك في حذف هذا الدواء من الخزانة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تأكيد الحذف',
        style: 'destructive',
        onPress: () => {
          removeMedicine(medicine.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleRefillOrder = () => {
    navigation.navigate('Pharmacies');
  };

  if (!medicine) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFound}>
          <Text variant="headingMD">لم يتم العثور على الدواء</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ─── شريط التنقل العلوي ─── */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowRight size={22} color={Colors.textPrimary} strokeWidth={IconDefaults.strokeWidth} />
        </TouchableOpacity>
        <Text variant="headingMD" color={Colors.textPrimary}>
          تفاصيل الدواء
        </Text>
        <TouchableOpacity onPress={handleDelete} style={styles.backBtn}>
          <Trash2 size={20} color={Colors.danger} strokeWidth={IconDefaults.strokeWidth} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── بطاقة الرأس والاسم ─── */}
        <Card style={styles.headerCard}>
          <View style={styles.titleRow}>
            <View style={styles.iconBox}>
              <Pill size={32} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            </View>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="headingLG" color={Colors.textPrimary}>
                {medicine.name}
              </Text>
              <Text variant="bodySM" color={Colors.textSecondary}>
                المادة الفعالة: {medicine.activeIngredient}
              </Text>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.badge}>
              <Text variant="labelSM" color={Colors.primary}>
                {medicine.category}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text variant="labelSM" color={Colors.textSecondary}>
                👤 {medicine.assignedTo}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text variant="labelSM" color={Colors.textPrimary}>
                التركيز: {medicine.dosage}
              </Text>
            </View>
            {medicine.storageLocation ? (
              <View style={[styles.badge, { backgroundColor: Colors.green100 }]}>
                <Text variant="labelSM" color={Colors.primary}>
                  📍 {medicine.storageLocation}
                </Text>
              </View>
            ) : null}
            {medicine.batchNumber ? (
              <View style={styles.badge}>
                <Text variant="labelSM" color={Colors.textSecondary}>
                  🔖 تشغيلة: {medicine.batchNumber}
                </Text>
              </View>
            ) : null}
          </View>
        </Card>

        {/* ─── تنبيه الحساسية إذا وجد ─── */}
        {medicine.isAllergyRisk ? (
          <View style={styles.dangerCard}>
            <ShieldAlert size={24} color={Colors.danger} strokeWidth={IconDefaults.strokeWidth} />
            <View style={{ flex: 1, marginRight: Spacing.xs }}>
              <Text variant="labelMD" color={Colors.danger}>
                تحذير تعارض دوائي أو حساسية مسجلة!
              </Text>
              <Text variant="caption" color={Colors.danger}>
                {medicine.allergyWarning || 'يمنع استخدامه لبعض أفراد العائلة المسجلين.'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.safeCard}>
            <ShieldCheck size={22} color={Colors.success} strokeWidth={IconDefaults.strokeWidth} />
            <Text variant="labelSM" color={Colors.success}>
              تم الفحص آلياً: آمن للاستخدام ولا يتعارض مع الأدوية المسجلة
            </Text>
          </View>
        )}

        {/* ─── المخزون والصلاحية ─── */}
        <View style={styles.statsRow}>
          <Card style={styles.statBox}>
            <Text variant="caption" color={Colors.textSecondary}>
              الكمية المتوفرة
            </Text>
            <Text variant="headingXL" color={Colors.primary}>
              {medicine.quantity}
            </Text>
            <Text variant="caption" color={Colors.textSecondary}>
              {medicine.unit} في الخزانة
            </Text>
          </Card>

          <Card style={styles.statBox}>
            <Text variant="caption" color={Colors.textSecondary}>
              تاريخ الصلاحية
            </Text>
            <Text variant="headingMD" color={Colors.textPrimary} style={{ marginTop: 6 }}>
              {medicine.expiryDate}
            </Text>
            <StatusBadge type="success" label="صالح للاستخدام" style={{ marginTop: 6 }} />
          </Card>
        </View>

        {/* ─── إرشادات الاستخدام والجرعات ─── */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Clock size={20} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            <Text variant="labelLG" color={Colors.textPrimary}>
              إرشادات الاستخدام والجرعة
            </Text>
          </View>
          <Text variant="bodyMD" color={Colors.textPrimary} style={{ lineHeight: 24 }}>
            {medicine.instructions}
          </Text>
        </Card>

        {/* ─── بطاقة الشراء وإعادة التعبئة (B2B E-commerce) ─── */}
        <Card style={styles.refillCard} variant="soft">
          <View style={styles.refillHeader}>
            <ShoppingCart size={22} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="labelLG" color={Colors.textPrimary}>
                إعادة التعبئة الذكية (Auto-Refill)
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                طلب فوري وتوصيل من الصيدليات الشريكة بضغطة زر
              </Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <Text variant="bodySM" color={Colors.textSecondary}>
              السعر المقدر للعبوة الجديدة:
            </Text>
            <Text variant="headingMD" color={Colors.primary}>
              {medicine.price || 24} ر.س
            </Text>
          </View>

          <Button
            label="طلب الدواء والتوصيل للمنزل الآن"
            variant="primary"
            onPress={handleRefillOrder}
            fullWidth
            leftIcon={ShoppingCart}
          />
        </Card>
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
  headerCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.xs,
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  badge: {
    backgroundColor: Colors.backgroundBase,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dangerCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.dangerLight,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  safeCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.successLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.md,
  },
  statBox: {
    flex: 1,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  infoCard: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  refillCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  refillHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
