/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Screen: OnboardingScreen
 *  شاشة الترحيب المتعددة الصفحات
 * ═══════════════════════════════════════════════════════
 */

import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Pill, ShieldCheck, BrainCircuit, Bell } from 'lucide-react-native';

import { Colors }     from '../../constants/colors';
import { Spacing, Radius, ComponentHeight } from '../../constants/spacing';
import { FontFamily, TypeScale } from '../../constants/typography';
import { IconDefaults } from '../../constants/icons';
import { Text }   from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── بيانات صفحات الترحيب ────────────────────────────────────────────────────
interface OnboardingSlide {
  id:          string;
  icon:        React.ElementType;
  iconBg:      string;
  iconColor:   string;
  title:       string;
  subtitle:    string;
  accentColor: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    icon:        Pill,
    iconBg:      Colors.primaryLight,
    iconColor:   Colors.primary,
    title:       'خزانة أدوية ذكية\nلكل أسرتك',
    subtitle:    'أضف أدويتك بمسح الباركود في ثوانٍ، وتابع مخزون كل فرد من عائلتك في مكان واحد.',
    accentColor: Colors.primary,
  },
  {
    id: '2',
    icon:        Bell,
    iconBg:      'rgba(154, 91, 0, 0.10)',
    iconColor:   Colors.warning,
    title:       'لا تنسَ جرعة\nواحدة بعد اليوم',
    subtitle:    'تنبيهات دقيقة لمواعيد الأدوية، وتحذير مبكر قبل انتهاء صلاحية أي دواء في خزانتك.',
    accentColor: Colors.warning,
  },
  {
    id: '3',
    icon:        ShieldCheck,
    iconBg:      Colors.secondaryLight,
    iconColor:   Colors.secondary,
    title:       'حماية من التعارضات\nالدوائية الخطيرة',
    subtitle:    'يراقب تِرياقي قائمة أدويتك ويُنبّهك فوراً عند وجود تعارض أو حساسية قد تضرّك.',
    accentColor: Colors.secondary,
  },
  {
    id: '4',
    icon:        BrainCircuit,
    iconBg:      Colors.primaryLight,
    iconColor:   Colors.primary,
    title:       'مساعدك الصيدلاني\nالذكي',
    subtitle:    'اسأل عن أي دواء أو عرَض في أي وقت، وسيرشدك بإجابات دوائية دقيقة وموثوقة.',
    accentColor: Colors.primary,
  },
];

// ─── مكوّن نقطة المؤشر ───────────────────────────────────────────────────────
const Dot: React.FC<{ active: boolean; color: string }> = ({ active, color }) => (
  <View
    style={[
      styles.dot,
      active
        ? [styles.dotActive, { backgroundColor: color }]
        : styles.dotInactive,
    ]}
  />
);

// ─── مكوّن الصفحة الواحدة ────────────────────────────────────────────────────
const Slide: React.FC<{ item: OnboardingSlide }> = ({ item }) => {
  const IconComponent = item.icon;
  return (
    <View style={styles.slide}>
      {/* ─── منطقة الأيقونة التوضيحية ─── */}
      <View style={styles.illustrationArea}>
        {/* دائرة خلفية كبيرة */}
        <View style={[styles.outerCircle, { backgroundColor: item.iconBg }]}>
          {/* دائرة داخلية */}
          <View style={[styles.innerCircle, { backgroundColor: item.iconBg }]}>
            <IconComponent
              size={80}
              color={item.iconColor}
              strokeWidth={1.5}
            />
          </View>
        </View>

        {/* زخارف دائرية خلفية */}
        <View style={[styles.decorRing1, { borderColor: item.iconBg }]} />
        <View style={[styles.decorRing2, { borderColor: item.iconBg }]} />
      </View>

      {/* ─── منطقة النص ─── */}
      <View style={styles.textArea}>
        <Text
          variant="displayLG"
          align="center"
          style={styles.title}
        >
          {item.title}
        </Text>
        <Text
          variant="bodyLG"
          color={Colors.textSecondary}
          align="center"
          style={styles.subtitle}
        >
          {item.subtitle}
        </Text>
      </View>
    </View>
  );
};

// ─── شاشة الترحيب الرئيسية ───────────────────────────────────────────────────
interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const isLast = currentIndex === SLIDES.length - 1;
  const currentSlide = SLIDES[currentIndex];

  const goNext = () => {
    if (isLast) {
      onFinish();
      return;
    }
    const nextIndex = currentIndex + 1;
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    setCurrentIndex(nextIndex);
  };

  const goPrev = () => {
    if (currentIndex === 0) return;
    const prevIndex = currentIndex - 1;
    flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    setCurrentIndex(prevIndex);
  };

  const onMomentumScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* ─── شريط التخطي العلوي ─── */}
        <View style={styles.topBar}>
          {/* شعار تِرياقي الأصلي */}
          <View style={styles.logoArea}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* زر تخطي */}
          {!isLast && (
            <TouchableOpacity onPress={onFinish} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text variant="labelMD" color={Colors.textSecondary}>
                تخطي
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ─── الصفحات ─── */}
        <Animated.FlatList
          ref={flatListRef}
          data={SLIDES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Slide item={item} />}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          inverted={false} // الترتيب من اليسار لليمين، والتمرير كذلك
        />
      </SafeAreaView>

      {/* ─── الجزء السفلي الثابت ─── */}
      <SafeAreaView style={styles.bottomArea} edges={['bottom']}>
        {/* مؤشرات الصفحات */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, idx) => (
            <Dot
              key={idx}
              active={idx === currentIndex}
              color={currentSlide.accentColor}
            />
          ))}
        </View>

        {/* أزرار التنقل */}
        <View style={styles.navRow}>
          {/* زر السابق */}
          <TouchableOpacity
            style={[
              styles.navBtn,
              { opacity: currentIndex === 0 ? 0 : 1 },
            ]}
            onPress={goPrev}
            disabled={currentIndex === 0}
          >
            <ArrowRight
              size={22}
              color={Colors.primary}
              strokeWidth={IconDefaults.strokeWidth}
            />
          </TouchableOpacity>

          {/* الزر الرئيسي */}
          <TouchableOpacity
            style={[
              styles.mainBtn,
              { backgroundColor: currentSlide.accentColor },
            ]}
            onPress={goNext}
            activeOpacity={0.85}
          >
            <Text variant="labelLG" color={Colors.textOnPrimary}>
              {isLast ? 'ابدأ الآن' : 'التالي'}
            </Text>
            {!isLast && (
              <ArrowLeft
                size={20}
                color={Colors.textOnPrimary}
                strokeWidth={IconDefaults.strokeWidth}
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ─── الأنماط ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundBase,
  },
  safeArea: {
    flex: 1,
  },

  // ─── الشريط العلوي ───────────────────────────────────
  topBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  logoArea: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  logoImage: {
    width: 95,
    height: 38,
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: FontFamily.displayBold,
    fontSize: 18,
  },

  // ─── الصفحة الواحدة ──────────────────────────────────
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },

  // ─── منطقة الأيقونة ──────────────────────────────────
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  outerCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    // ظل داخلي بسيط
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    backgroundColor: Colors.backgroundCard,
  },
  decorRing1: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 135,
    borderWidth: 1,
    opacity: 0.4,
  },
  decorRing2: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    opacity: 0.2,
  },

  // ─── منطقة النص ──────────────────────────────────────
  textArea: {
    paddingBottom: Spacing['2xl'],
    gap: Spacing.md,
    width: '100%',
  },
  title: {
    fontFamily: FontFamily.displayBold,
    textAlign: 'center',
    lineHeight: 46,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: Spacing.md,
  },

  // ─── الجزء السفلي ────────────────────────────────────
  bottomArea: {
    backgroundColor: Colors.backgroundBase,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: Radius.full,
  },
  dotActive: {
    width: 28,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.border,
  },
  navRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  navBtn: {
    width: ComponentHeight.buttonSM,
    height: ComponentHeight.buttonSM,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundCard,
  },
  mainBtn: {
    flex: 1,
    height: ComponentHeight.button,
    borderRadius: Radius.full,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    // ظل ناعم
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
});
