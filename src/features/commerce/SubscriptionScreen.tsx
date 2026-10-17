/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Feature: SubscriptionScreen (الاشتراكات والعتاد)
 *  نموذج Freemium: الباقة المجانية، Premium، ومتجر أجهزة الخزانة الذكية
 * ═══════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Cpu,
  Lock,
  Thermometer,
  Bot,
  Package,
  Layers,
  HeartHandshake,
  HelpCircle,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeTier, setActiveTier] = useState<'free' | 'premium'>('free');

  const handleSelectTier = (tier: 'free' | 'premium') => {
    if (tier === activeTier) return;
    if (tier === 'premium') {
      Alert.alert(
        'ترقية الحساب التجريبي إلى تِرياقي بلس ⭐',
        'هل ترغب في تجربة باقة Premium مجاناً لمدة 30 يوماً؟ (لا يلزم إدخال بطاقة ائتمانية).',
        [
          { text: 'إلغاء', style: 'cancel' },
          {
            text: 'تفعيل التجربة الآن',
            onPress: () => {
              setActiveTier('premium');
              Alert.alert('تهانينا!', 'تم تفعيل باقة تِرياقي بلس بنجاح. استمتع بكامل ميزات التحكم والأمان.');
            },
          },
        ]
      );
    } else {
      setActiveTier('free');
      Alert.alert('تم التغيير', 'تم التحويل للباقة الأساسية المجانية. بياناتك محفوظة بالكامل.');
    }
  };

  const handleOrderHardware = (deviceTitle: string, price: string) => {
    Alert.alert(
      `طلب شراء: ${deviceTitle}`,
      `السعر التقديري: ${price}\nسيتم إشعارك فور توفر الشحنات في منطقتك وتوفير شريك الدفع المعتمد.`,
      [{ text: 'فهمت ذلك', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ─── الشريط العلوي ─── */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowRight size={22} color={Colors.textPrimary} strokeWidth={IconDefaults.strokeWidth} />
        </TouchableOpacity>
        <Text variant="headingMD" color={Colors.textPrimary}>
          الباقات والاشتراكات
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── شارة الباقة الحالية ─── */}
        <View style={[styles.statusBanner, activeTier === 'premium' ? styles.premiumBanner : styles.freeBanner]}>
          <View style={styles.statusRow}>
            {activeTier === 'premium' ? (
              <Sparkles size={24} color={Colors.secondary} strokeWidth={IconDefaults.strokeWidth} />
            ) : (
              <Layers size={24} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            )}
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="labelLG" color={activeTier === 'premium' ? Colors.textOnPrimary : Colors.textPrimary}>
                {activeTier === 'premium' ? 'أنت مشترك في باقة تِرياقي بلس (Premium)' : 'أنت على باقة تِرياقي الأساسية المجانية'}
              </Text>
              <Text variant="caption" color={activeTier === 'premium' ? Colors.green100 : Colors.textSecondary}>
                {activeTier === 'premium'
                  ? 'جميع ميزات الذكاء الاصطناعي وإنترنت الأشياء مفعّلة'
                  : 'تغطي حتى 5 أفراد من الأسرة وإدارة الأدوية والمخزون'}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── تبديل الدورة الشهرية / السنوية ─── */}
        <View style={styles.cycleToggleContainer}>
          <TouchableOpacity
            style={[styles.cycleBtn, billingCycle === 'monthly' && styles.cycleBtnActive]}
            onPress={() => setBillingCycle('monthly')}
          >
            <Text
              variant="labelMD"
              color={billingCycle === 'monthly' ? Colors.textOnPrimary : Colors.textPrimary}
            >
              شهري (19 ر.س)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cycleBtn, billingCycle === 'yearly' && styles.cycleBtnActive]}
            onPress={() => setBillingCycle('yearly')}
          >
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 6 }}>
              <Text
                variant="labelMD"
                color={billingCycle === 'yearly' ? Colors.textOnPrimary : Colors.textPrimary}
              >
                سنوي (180 ر.س)
              </Text>
              <View style={styles.discountBadge}>
                <Text variant="caption" color={Colors.textOnPrimary} style={{ fontSize: 10 }}>
                  وفّر 20%
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* ─── بطاقة الباقة المجانية ─── */}
        <Card style={styles.planCard}>
          <View style={styles.planHeader}>
            <View>
              <Text variant="headingMD" color={Colors.textPrimary}>
                الباقة الأساسية
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                للأسر التي تبدأ في تنظيم صيدليتها المنزلية
              </Text>
            </View>
            <Text variant="headingLG" color={Colors.primary}>
              مجاناً
            </Text>
          </View>

          <View style={styles.featuresList}>
            <FeatureItem text="إدارة خزانة أدوية منزلية واحدة" />
            <FeatureItem text="إضافة حتى 5 أفراد من أفراد الأسرة" />
            <FeatureItem text="تسجيل الأدوية، الفيتامينات، والكميات" />
            <FeatureItem text="تتبع تواريخ الصلاحية والتنبيهات المسبقة" />
            <FeatureItem text="قوائم المشتريات ومشاركتها مع العائلة" />
            <FeatureItem text="كتالوج المنتجات والبحث السريع" />
          </View>

          {activeTier === 'free' ? (
            <View style={styles.currentPlanBadge}>
              <Text variant="labelMD" color={Colors.primary}>
                باقتك الحالية
              </Text>
            </View>
          ) : (
            <Button
              label="التحويل إلى الباقة المجانية"
              variant="outline"
              onPress={() => handleSelectTier('free')}
              size="md"
            />
          )}
        </Card>

        {/* ─── بطاقة باقة تِرياقي بلس (Premium) ─── */}
        <Card style={[styles.planCard, styles.premiumPlanCard]}>
          <View style={styles.recommendedBadge}>
            <Sparkles size={14} color={Colors.textOnPrimary} strokeWidth={IconDefaults.strokeWidth} />
            <Text variant="caption" color={Colors.textOnPrimary} style={{ fontWeight: '700' }}>
              الباقة الموصى بها للمنازل الذكية
            </Text>
          </View>

          <View style={styles.planHeader}>
            <View>
              <Text variant="headingLG" color={Colors.primary}>
                تِرياقي بلس (Premium)
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                حماية أمان الأطفال والتحكم المتقدم ومساعد شخّصني
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text variant="headingXL" color={Colors.primary}>
                {billingCycle === 'monthly' ? '19' : '180'}
                <Text variant="bodySM" color={Colors.textSecondary}>
                  {billingCycle === 'monthly' ? ' ر.س/شهر' : ' ر.س/سنة'}
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.featuresList}>
            <FeatureItem text="كافة ميزات الباقة المجانية بالكامل" isBold />
            <FeatureItem text="التحكم بالقفل الذكي إلكترونياً وسجل وصول آمن" icon={Lock} />
            <FeatureItem text="مراقبة الحرارة والرطوبة مع تنبيهات تلف الدواء" icon={Thermometer} />
            <FeatureItem text="المساعد الصحي الذكي «شخّصني» وقاعدة المعرفة" icon={Bot} />
            <FeatureItem text="تصدير التقارير الطبية المعتمدة للأسرة والطباعة" icon={ShieldCheck} />
            <FeatureItem text="أولوية إعادة الطلب من الصيدليات الشريكة" icon={Package} />
          </View>

          {activeTier === 'premium' ? (
            <View style={[styles.currentPlanBadge, { backgroundColor: Colors.green100 }]}>
              <Text variant="labelMD" color={Colors.primary}>
                ✓ باقتك النشطة حالياً
              </Text>
            </View>
          ) : (
            <Button
              label="ترقية وتجربة مجانية 30 يوماً"
              variant="primary"
              onPress={() => handleSelectTier('premium')}
              size="lg"
              fullWidth
              leftIcon={Sparkles}
            />
          )}
        </Card>

        {/* ─── قسم متجر عتاد الخزانة الذكية ─── */}
        <View style={styles.hardwareSectionHeader}>
          <Cpu size={22} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
          <Text variant="headingMD" color={Colors.textPrimary}>
            عتاد وأجهزة تِرياقي الذكية (IoT)
          </Text>
        </View>

        <Card style={styles.hardwareCard}>
          <View style={styles.hardwareRow}>
            <View style={styles.hardwareIconBox}>
              <Lock size={24} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            </View>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="labelLG" color={Colors.textPrimary}>
                خزانة تِرياقي الذكية المتصلة
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                خزانة جدارية مع قفل كهرومغناطيسي، مستشعر بيئة، واتصال WiFi/BLE
              </Text>
              <Text variant="labelMD" color={Colors.primary} style={{ marginTop: 4 }}>
                499 ر.س (شامل التركيب)
              </Text>
            </View>
            <Button
              label="طلب مسبق"
              variant="outline"
              size="sm"
              onPress={() => handleOrderHardware('خزانة تِرياقي الذكية', '499 ر.س')}
            />
          </View>
        </Card>

        <Card style={styles.hardwareCard}>
          <View style={styles.hardwareRow}>
            <View style={styles.hardwareIconBox}>
              <Thermometer size={24} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            </View>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="labelLG" color={Colors.textPrimary}>
                وحدة مراقبة المناخ الدوائي (ESP32)
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                مستشعر دقيق لحرارة ورطوبة الثلاجة أو الخزانة العادية
              </Text>
              <Text variant="labelMD" color={Colors.primary} style={{ marginTop: 4 }}>
                149 ر.س
              </Text>
            </View>
            <Button
              label="طلب مسبق"
              variant="outline"
              size="sm"
              onPress={() => handleOrderHardware('وحدة مراقبة المناخ', '149 ر.س')}
            />
          </View>
        </Card>

        {/* ─── ميثاق الخصوصية والشفافية الطبية ─── */}
        <View style={styles.privacyNote}>
          <HeartHandshake size={20} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
          <View style={{ flex: 1, marginRight: Spacing.xs }}>
            <Text variant="labelSM" color={Colors.primary}>
              ميثاق خصوصية البيانات الطبية:
            </Text>
            <Text variant="caption" color={Colors.textSecondary} style={{ lineHeight: 18 }}>
              بياناتك الصحية ملك لك دائماً. حتى في حال إلغاء الاشتراك، يظل بإمكانك الوصول الكامل إلى أدوية أسرتك وتصدير ملفاتك مجاناً. لا نبيع بياناتك الطبية لأي طرف خارجي.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FeatureItem = ({
  text,
  isBold = false,
  icon: IconComponent,
}: {
  text: string;
  isBold?: boolean;
  icon?: any;
}) => (
  <View style={styles.featureItemRow}>
    <CheckCircle2 size={18} color={Colors.secondary} strokeWidth={IconDefaults.strokeWidth} />
    <Text
      variant="bodySM"
      color={Colors.textPrimary}
      style={[styles.featureText, isBold && { fontWeight: '700' }]}
    >
      {text}
    </Text>
  </View>
);

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
    padding: Spacing['2xl'],
    paddingBottom: Spacing['4xl'],
  },
  statusBanner: {
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  freeBanner: {
    backgroundColor: Colors.green100,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  premiumBanner: {
    backgroundColor: Colors.primary,
  },
  statusRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  cycleToggleContainer: {
    flexDirection: 'row-reverse',
    backgroundColor: Colors.backgroundSoft,
    borderRadius: Radius.full,
    padding: 4,
    marginBottom: Spacing.xl,
  },
  cycleBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  cycleBtnActive: {
    backgroundColor: Colors.primary,
  },
  discountBadge: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  planCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  premiumPlanCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
    position: 'relative',
    backgroundColor: Colors.backgroundCard,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -14,
    right: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.full,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  planHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xs,
  },
  featuresList: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  featureItemRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    flex: 1,
    textAlign: 'right',
  },
  currentPlanBadge: {
    backgroundColor: Colors.backgroundSoft,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  hardwareSectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  hardwareCard: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
  },
  hardwareRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  hardwareIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyNote: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundSoft,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
});
