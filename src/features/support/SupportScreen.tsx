/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  تِرياقي (Tiryāqi) — Feature: SupportScreen (الدعم الفني ومركز المساعدة)
 *  قنوات المساعدة، إرشادات العتاد، الأسئلة الشائعة، وفتح القفل اليدوي
 * ═══════════════════════════════════════════════════════════════════════════
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
  Headphones,
  MessageCircle,
  Mail,
  HelpCircle,
  Cpu,
  KeyRound,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Send,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const FAQS = [
  {
    q: 'كيف أفتح الخزانة في حال انقطاع الكهرباء أو شبكة الواي فاي؟',
    a: 'تحتوي الخزانة الذكية على قفل ميكانيكي احتياطي بمفتاح مادي تقليدي مرفق بالعلبة لضمان الوصول للأدوية الحيوية في أي ظرف طارئ.',
  },
  {
    q: 'هل يحل المساعد الذكي محل الطبيب المعالج؟',
    a: 'لا إطلاقاً. تِرياقي يوفر إرشاداً دوائياً أولياً مستمداً من مراجع سريرية معتمدة ورصد التداخلات الدوائية، ولا يقدم تشخيصاً طبياً نهائياً ولا يصف أدوية خاضعة لوصفة طبية.',
  },
  {
    q: 'هل تُشارك بيانات أدويتي أو حساسية عائلتي مع شركات التأمين؟',
    a: 'خصوصيتك مقدسة. تُشفر بيانات الملف الصحي محلياً ولا يتم بيع أو مشاركة أي سجلات صحية فردية لأي طرف خارجي.',
  },
  {
    q: 'ماذا أفعل إذا ارتفعت حرارة الخزانة عن الحد الآمن؟',
    a: 'يرسل التطبيق تنبيهاً فورياً. افحص مكان الخزانة وتأكد من عدم تعرضها لأشعة شمس مباشرة، وانقل الأدوية الحساسة كالأنسولين إلى الثلاجة فوراً.',
  },
];

export const SupportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [feedback, setFeedback] = useState('');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSendFeedback = () => {
    if (!feedback.trim()) {
      Alert.alert('تنبيه', 'يرجى كتابة رسالتك أو استفسارك');
      return;
    }
    Alert.alert('شكراً لتواصلك معنا 💚', 'تم استلام تذكرتك وسيقوم فريق الدعم الفني بالرد خلال 24 ساعة.');
    setFeedback('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowRight size={22} color={Colors.textPrimary} strokeWidth={IconDefaults.strokeWidth} />
        </TouchableOpacity>
        <Text variant="headingMD" color={Colors.textPrimary}>
          الدعم الفني والمساعدة
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── قنوات التواصل المباشر ─── */}
        <Card style={styles.contactCard} variant="soft">
          <View style={styles.contactHeader}>
            <View style={styles.headphoneBox}>
              <Headphones size={24} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            </View>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="headingSM" color={Colors.textPrimary}>
                فريق تِرياقي في خدمتك
              </Text>
              <Text variant="bodySM" color={Colors.textSecondary}>
                متاحون يومياً من 08:00 ص حتى 10:00 م
              </Text>
            </View>
          </View>

          <View style={styles.contactButtonsRow}>
            <TouchableOpacity
              style={styles.channelBtn}
              onPress={() => Alert.alert('واتساب الدعم', 'جاري فتح محادثة الدعم الفني عبر واتساب: +966500000000')}
            >
              <MessageCircle size={20} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="labelSM" color={Colors.primary}>
                واتساب فوري
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.channelBtn}
              onPress={() => Alert.alert('البريد الإلكتروني', 'يمكنك مراسلتنا على: support@teryaqi.com')}
            >
              <Mail size={20} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="labelSM" color={Colors.primary}>
                بريد الدعم
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* ─── دليل طوارئ العتاد الذكي ─── */}
        <Card style={styles.hardwareGuideCard}>
          <View style={styles.guideRow}>
            <KeyRound size={22} color={Colors.warning} strokeWidth={IconDefaults.strokeWidth} />
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="labelLG" color={Colors.textPrimary}>
                آلية فتح القفل اليدوي عند الطوارئ
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                استخدم المفتاح المعدني المرفق أسفل الخزانة لإلغاء القفل الكهرومغناطيسي فورياً دون حاجة للتطبيق.
              </Text>
            </View>
          </View>
        </Card>

        {/* ─── الأسئلة الشائعة ─── */}
        <View style={styles.sectionHeader}>
          <HelpCircle size={20} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
          <Text variant="headingMD" color={Colors.textPrimary}>
            الأسئلة الشائعة (FAQ)
          </Text>
        </View>

        <View style={styles.faqList}>
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <Card key={index} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqQuestionRow}
                  onPress={() => toggleFaq(index)}
                  activeOpacity={0.8}
                >
                  <Text variant="labelMD" color={Colors.textPrimary} style={{ flex: 1 }}>
                    {faq.q}
                  </Text>
                  {isOpen ? (
                    <ChevronUp size={20} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
                  ) : (
                    <ChevronDown size={20} color={Colors.textSecondary} strokeWidth={IconDefaults.strokeWidth} />
                  )}
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.faqAnswerBox}>
                    <Text variant="bodySM" color={Colors.textSecondary} style={{ lineHeight: 22 }}>
                      {faq.a}
                    </Text>
                  </View>
                )}
              </Card>
            );
          })}
        </View>

        {/* ─── نموذج إرسال استفسار أو بلاغ ─── */}
        <Card style={styles.feedbackCard}>
          <Text variant="headingSM" color={Colors.textPrimary}>
            أرسل بلاغاً أو اقتراحاً
          </Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="اكتب تفاصيل استفسارك أو مشكلتك الفنية هنا..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={setFeedback}
            textAlign="right"
          />
          <Button
            label="إرسال التذكرة"
            variant="primary"
            onPress={handleSendFeedback}
            leftIcon={Send}
            fullWidth
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
  contactCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  contactHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  headphoneBox: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonsRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.md,
  },
  channelBtn: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hardwareGuideCard: {
    padding: Spacing.md,
    backgroundColor: 'rgba(154, 91, 0, 0.08)',
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  guideRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  faqList: {
    gap: Spacing.sm,
  },
  faqCard: {
    padding: Spacing.md,
  },
  faqQuestionRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqAnswerBox: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  feedbackCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  feedbackInput: {
    backgroundColor: Colors.backgroundBase,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    height: 100,
    fontSize: 14,
    color: Colors.textPrimary,
    textAlignVertical: 'top',
  },
});
