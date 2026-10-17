/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  تِرياقي (Tiryāqi) — Feature: IoTDashboardScreen (لوحة تحكم العتاد والمحاكاة)
 *  إدارة القفل الذكي، مراقبة درجات الحرارة، سجلات الوصول، وضبط عتبات التنبيه
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowRight,
  Lock,
  Unlock,
  Thermometer,
  Droplets,
  Fingerprint,
  Cpu,
  History,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useMedicineStore } from '../../store/useMedicineStore';

export const IoTDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    isLocked,
    toggleLock,
    temperature,
    humidity,
    isSimulationMode,
    setSimulationMode,
    lockLogs,
    climateHistory,
    recordClimateReading,
  } = useMedicineStore();

  const [coldChainMode, setColdChainMode] = useState(false);

  // محاكاة تنبيه بيئي خطير
  const simulateHeatAlert = () => {
    recordClimateReading(28.5, 65);
    Alert.alert(
      '⚠️ تنبيه بيئي عاجل (محاكاة)',
      'ارتفعت درجة حرارة الخزانة إلى 28.5°م وتجاوزت الحد الآمن (25°م)! يُرجى نقل الأدوية الحساسة كالأنسولين والقطرات فوراً.'
    );
  };

  // محاكاة عودة الحرارة للوضع الطبيعي
  const resetNormalClimate = () => {
    recordClimateReading(22.0, 45);
    Alert.alert('✅ تم تصحيح البيئة', 'عادت درجة حرارة الخزانة إلى 22.0°م والرطوبة إلى 45% (نطاق مثالي).');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowRight size={22} color={Colors.textPrimary} strokeWidth={IconDefaults.strokeWidth} />
        </TouchableOpacity>
        <Text variant="headingMD" color={Colors.textPrimary}>
          خزانة إنترنت الأشياء (IoT Hub)
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── لافتة وضع المحاكاة ─── */}
        <Card style={styles.modeCard}>
          <View style={styles.modeRow}>
            <View style={styles.cpuIconBox}>
              <Cpu size={24} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            </View>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}>
                <Text variant="labelLG" color={Colors.textPrimary}>
                  {isSimulationMode ? 'وضع المحاكاة الافتراضية' : 'متصل بالعتاد الفعلي (ESP32)'}
                </Text>
                <View
                  style={[
                    styles.modeBadge,
                    { backgroundColor: isSimulationMode ? 'rgba(154, 91, 0, 0.12)' : Colors.successLight },
                  ]}
                >
                  <Text
                    variant="caption"
                    color={isSimulationMode ? Colors.warning : Colors.success}
                  >
                    {isSimulationMode ? 'محاكاة برمجية' : 'عتاد مباشر'}
                  </Text>
                </View>
              </View>
              <Text variant="caption" color={Colors.textSecondary}>
                يتيح هذا الوضع اختبار استجابة القفل والمستشعرات والتنبيهات برمجياً قبل ربط الأجهزة المادية.
              </Text>
            </View>
          </View>
        </Card>

        {/* ─── بطاقة التحكم بالقفل الذكي ─── */}
        <Card style={styles.lockControlCard}>
          <View style={styles.lockHeader}>
            <View
              style={[
                styles.lockIconLarge,
                { backgroundColor: isLocked ? Colors.primaryLight : Colors.dangerLight },
              ]}
            >
              {isLocked ? (
                <Lock size={36} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
              ) : (
                <Unlock size={36} color={Colors.danger} strokeWidth={IconDefaults.strokeWidth} />
              )}
            </View>

            <View style={{ alignItems: 'center', gap: 2 }}>
              <Text variant="headingMD" color={Colors.textPrimary}>
                القفل الكهرومغناطيسي الذكي
              </Text>
              <Text variant="labelSM" color={isLocked ? Colors.success : Colors.danger}>
                {isLocked ? '● مؤمّن ومغلق بنجاح' : '● الخزانة مفتوحة الآن'}
              </Text>
            </View>

            <Button
              label={isLocked ? 'فتح قفل الخزانة' : 'إعادة إغلاق وتأمين الخزانة'}
              variant={isLocked ? 'primary' : 'danger'}
              onPress={() => toggleLock('أبو أسامة', 'APP')}
              leftIcon={isLocked ? Unlock : Lock}
              fullWidth
              size="lg"
            />
          </View>
        </Card>

        {/* ─── لوحة المستشعرات البيئية ─── */}
        <Card style={styles.sensorsCard}>
          <View style={styles.sensorsTitleRow}>
            <Text variant="headingSM" color={Colors.textPrimary}>
              مستشعرات البيئة الحية (Climate Sensors)
            </Text>
            <StatusBadge
              type={temperature > 25 ? 'danger' : 'success'}
              label={temperature > 25 ? 'تجاوز الحرارة' : 'بيئة ممتازة'}
            />
          </View>

          <View style={styles.readingsRow}>
            <View style={styles.readingBox}>
              <Thermometer size={26} color={temperature > 25 ? Colors.danger : Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="headingLG" color={temperature > 25 ? Colors.danger : Colors.primary}>
                {temperature.toFixed(1)}° م
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                النطاق الآمن: 15° - 25° م
              </Text>
            </View>

            <View style={styles.readingBox}>
              <Droplets size={26} color={Colors.secondary} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="headingLG" color={Colors.secondary}>
                {humidity.toFixed(0)}%
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                الرطوبة النسبية (الحد: 60%)
              </Text>
            </View>
          </View>

          {/* أزرار اختبار ومحاكاة التنبيهات البيئية */}
          <View style={styles.simButtonsRow}>
            <Button
              label="محاكاة ارتفاع الحرارة (28.5°م)"
              variant="outline"
              size="sm"
              onPress={simulateHeatAlert}
              style={{ flex: 1 }}
            />
            <Button
              label="إرجاع للطبيعي (22°م)"
              variant="ghost"
              size="sm"
              onPress={resetNormalClimate}
              style={{ flex: 1 }}
            />
          </View>
        </Card>

        {/* ─── سجل أحداث القفل والأمان (Audit Log) ─── */}
        <View style={styles.sectionHeader}>
          <History size={18} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
          <Text variant="headingMD" color={Colors.textPrimary}>
            سجل استخدام الخزانة (Audit Log)
          </Text>
        </View>

        <Card style={styles.logsCard}>
          {lockLogs.slice(0, 5).map((log) => (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.logIcon}>
                {log.action === 'UNLOCKED' ? (
                  <Unlock size={18} color={Colors.secondary} strokeWidth={IconDefaults.strokeWidth} />
                ) : (
                  <Lock size={18} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="labelSM" color={Colors.textPrimary}>
                  {log.details}
                </Text>
                <Text variant="caption" color={Colors.textSecondary}>
                  بواسطة: {log.user} • عبر: {log.method === 'FINGERPRINT' ? 'بصمة الإصبع' : 'تطبيق الموبايل'}
                </Text>
              </View>
              <Text variant="caption" color={Colors.textSecondary}>
                {log.timestamp}
              </Text>
            </View>
          ))}
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
  iconBtn: {
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
  modeCard: {
    padding: Spacing.md,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  cpuIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  lockControlCard: {
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  lockHeader: {
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
  },
  lockIconLarge: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorsCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  sensorsTitleRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readingsRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.md,
  },
  readingBox: {
    flex: 1,
    backgroundColor: Colors.backgroundBase,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    gap: 4,
  },
  simButtonsRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  logsCard: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  logItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  logIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.backgroundBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
