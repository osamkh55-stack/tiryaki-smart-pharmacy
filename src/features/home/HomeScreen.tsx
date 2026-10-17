/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Feature: Home (الرئيسية)
 *  لوحة التحكم المنزلية: حالة IoT، جدول اليوم، وتنبيهات الأدوية
 * ═══════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {
  Lock,
  Unlock,
  Thermometer,
  Droplets,
  ScanLine,
  BrainCircuit,
  Pill,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  Clock,
  Plus,
  ShoppingCart,
  Cpu,
  FileText,
  Headphones,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { FontFamily } from '../../constants/typography';
import { IconDefaults, IconSize } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useNavigation } from '@react-navigation/native';
import { useMedicineStore } from '../../store/useMedicineStore';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isLocked, toggleLock, todayDoses, toggleDose, temperature, humidity } = useMedicineStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── الترويسة والترحيب ─── */}
        <View style={styles.header}>
          <View>
            <Text variant="headingLG" color={Colors.textPrimary}>
              مرحباً، عائلة أسامة 👋
            </Text>
            <Text variant="bodySM" color={Colors.textSecondary}>
              خزانتكم آمنة وجميع أفراد الأسرة بخير اليوم
            </Text>
          </View>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm }}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate('Support')}
              activeOpacity={0.8}
            >
              <Headphones size={20} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text variant="headingSM" color={Colors.primary}>
                أ
              </Text>
            </View>
          </View>
        </View>

        {/* ─── بطاقة حالة الخزانة الذكية (IoT Hub) ─── */}
        <Card style={styles.iotCard} variant="default">
          <View style={styles.iotTopRow}>
            <View style={styles.iotTitleGroup}>
              <View style={[styles.iotIconWrapper, { backgroundColor: isLocked ? Colors.primaryLight : Colors.dangerLight }]}>
                {isLocked ? (
                  <Lock size={IconSize.nav} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
                ) : (
                  <Unlock size={IconSize.nav} color={Colors.danger} strokeWidth={IconDefaults.strokeWidth} />
                )}
              </View>
              <View>
                <Text variant="headingSM" color={Colors.textPrimary}>
                  خزانة الأدوية الرئيسية
                </Text>
                <Text variant="bodySM" color={isLocked ? Colors.success : Colors.danger}>
                  {isLocked ? '● مقفلة وآمنة عن الأطفال' : '● مفتوحة الآن'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.lockToggleBtn, { backgroundColor: isLocked ? Colors.primary : Colors.danger }]}
              onPress={() => toggleLock('عائلة أسامة', 'APP')}
              activeOpacity={0.8}
            >
              <Text variant="labelSM" color={Colors.textOnPrimary}>
                {isLocked ? 'فتح القفل' : 'قفل'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* مستشعرات البيئة (الحرارة والرطوبة) */}
          <View style={styles.sensorsDivider} />
          <View style={styles.sensorsRow}>
            <View style={styles.sensorItem}>
              <Thermometer size={18} color={Colors.secondary} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="bodySM" color={Colors.textSecondary}>
                الحرارة: <Text variant="labelMD" color={Colors.textPrimary}>{temperature}° م</Text> (مثالية)
              </Text>
            </View>
            <View style={styles.sensorItem}>
              <Droplets size={18} color={Colors.secondary} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="bodySM" color={Colors.textSecondary}>
                الرطوبة: <Text variant="labelMD" color={Colors.textPrimary}>{humidity}%</Text> (آمنة)
              </Text>
            </View>
          </View>
        </Card>

        {/* ─── شبكة الإجراءات السريعة ─── */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AddMedicine')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: Colors.primaryLight }]}>
              <ScanLine size={22} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            </View>
            <Text variant="labelMD" color={Colors.textPrimary}>
              مسح باركود
            </Text>
            <Text variant="caption" color={Colors.textSecondary}>
              إضافة دواء
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ShoppingList')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: Colors.secondaryLight }]}>
              <ShoppingCart size={22} color={Colors.secondary} strokeWidth={IconDefaults.strokeWidth} />
            </View>
            <Text variant="labelMD" color={Colors.textPrimary}>
              المشتريات
            </Text>
            <Text variant="caption" color={Colors.textSecondary}>
              نواقص الصيدلية
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('IoTDashboard')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(154, 91, 0, 0.12)' }]}>
              <Cpu size={22} color={Colors.warning} strokeWidth={IconDefaults.strokeWidth} />
            </View>
            <Text variant="labelMD" color={Colors.textPrimary}>
              لوحة العتاد
            </Text>
            <Text variant="caption" color={Colors.textSecondary}>
              القفل والمستشعرات
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ExportReport')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: Colors.green100 }]}>
              <FileText size={22} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            </View>
            <Text variant="labelMD" color={Colors.textPrimary}>
              تقرير طبي
            </Text>
            <Text variant="caption" color={Colors.textSecondary}>
              تصدير وطباعة
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── تنبيهات السلامة والانتهاء ─── */}
        <View style={styles.sectionHeader}>
          <Text variant="headingMD" color={Colors.textPrimary}>
            تنبيهات استباقية
          </Text>
          <StatusBadge type="warning" label="دواء وشيك الانتهاء" />
        </View>

        <Card style={styles.alertCard} variant="soft">
          <View style={styles.alertContent}>
            <AlertTriangle size={24} color={Colors.warning} strokeWidth={IconDefaults.strokeWidth} />
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="labelMD" color={Colors.textPrimary}>
                شراب كافوسيد (سعال)
              </Text>
              <Text variant="bodySM" color={Colors.textSecondary}>
                ينتهي خلال 14 يوماً • مخصص للطفلة سارة
              </Text>
            </View>
            <TouchableOpacity
              style={styles.alertAction}
              onPress={() => navigation.navigate('Pharmacies')}
            >
              <Text variant="labelSM" color={Colors.primary}>
                إعادة طلب
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* ─── جدول أدوية اليوم ─── */}
        <View style={styles.sectionHeader}>
          <Text variant="headingMD" color={Colors.textPrimary}>
            جرعات اليوم
          </Text>
          <Text variant="bodySM" color={Colors.primary}>
            {todayDoses.filter(d => d.taken).length} من {todayDoses.length} تم تناولها
          </Text>
        </View>

        {todayDoses.map((dose) => (
          <Card key={dose.id} style={styles.medCard}>
            <TouchableOpacity
              style={styles.medRow}
              onPress={() => toggleDose(dose.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkCircle, dose.taken && styles.checkCircleActive]}>
                {dose.taken && (
                  <CheckCircle2 size={20} color={Colors.textOnPrimary} strokeWidth={IconDefaults.strokeWidth} />
                )}
              </View>
              <View style={styles.medInfo}>
                <Text
                  variant="labelLG"
                  color={dose.taken ? Colors.textSecondary : Colors.textPrimary}
                  style={dose.taken ? styles.strikethrough : undefined}
                >
                  {dose.name}
                </Text>
                <View style={styles.medMeta}>
                  <Clock size={14} color={Colors.textSecondary} strokeWidth={IconDefaults.strokeWidth} />
                  <Text variant="caption" color={Colors.textSecondary}>
                    {dose.time} • مخصص لـ {dose.user}
                  </Text>
                </View>
              </View>
              <StatusBadge
                type={dose.taken ? 'success' : 'info'}
                label={dose.taken ? 'تم أخذها' : 'قادمة'}
              />
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundBase,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['4xl'],
    gap: Spacing.xl,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  iotCard: {
    padding: Spacing.lg,
  },
  iotTopRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iotTitleGroup: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iotIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockToggleBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  sensorsDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  sensorsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
  },
  sensorItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionsGrid: {
    flexDirection: 'row-reverse',
    gap: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  actionIconBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  alertCard: {
    padding: Spacing.md,
  },
  alertContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  alertAction: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  medCard: {
    padding: Spacing.md,
  },
  medRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  medInfo: {
    flex: 1,
    gap: 2,
  },
  medMeta: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
});
