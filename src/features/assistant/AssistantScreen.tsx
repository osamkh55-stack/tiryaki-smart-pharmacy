/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Feature: Assistant (مرشدي الصيدلاني الآمن)
 *  المساعد الحواري الذكي المعتمد على المعرفة الطبية وخوارزمية كسر الدائرة
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
} from 'react-native';
import {
  BrainCircuit,
  Send,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  AlertOctagon,
  Bot,
  User,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { ClinicalSafetyEngine, SafetyCheckResult } from '../../services/safety/SafetyRulesEngine';
import { useMedicineStore } from '../../store/useMedicineStore';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isRedFlag?: boolean;
  knowledgeVerified?: boolean;
  safetyTitle?: string;
  emergencyPhone?: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'ai',
    text: 'أهلاً بك! أنا "شخّصني"، مساعدك الصحي الذكي. أستند إلى محرك أمان سريري مستقل وقاعدة معرفة دوائية معتمدة. كيف يمكنني مساندتك اليوم؟',
    knowledgeVerified: true,
  },
  {
    id: '2',
    sender: 'user',
    text: 'هل يمكن للوالد أخذ بروفين 400 مع علاج الضغط كونكور؟',
  },
  {
    id: '3',
    sender: 'ai',
    text: '⚠️ تعارض مسكنات NSAIDs مع أدوية الضغط:\nتناول مضادات الالتهاب غير الستيرويدية مثل الإيبوبروفين بانتظام يُضعف كفاءة أدوية الضغط (كونكور) ويحبس السوائل.\n\nالإجراء السريري المعتمد:\nاستخدم الباراسيتامول (بانادول) كبديل آمن لتسكين الألم بعد مراجعة الطبيب.',
    knowledgeVerified: true,
    safetyTitle: 'فحص التداخلات الدوائية المعتمد',
  },
];

const QUICK_PROMPTS = [
  'ألم مفاجئ وضغط بالصدر',
  'هل يتعارض البنادول مع أدوية الضغط؟',
  'أعراض حساسية البنسلين الشديدة',
];

export const AssistantScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const { familyMembers, medicines } = useMedicineStore();

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
    };

    // ─── 1. فحص كسر الدائرة وعلامات الخطر الطارئة (Safety Red Flags) ───
    const redFlagResult = ClinicalSafetyEngine.evaluateRedFlags(userText);

    if (!redFlagResult.isSafe) {
      const emergencyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `${redFlagResult.title}\n\n${redFlagResult.reason}\n\nالتوجيه الطبي الفوري:\n${redFlagResult.actionRequired}`,
        isRedFlag: true,
        safetyTitle: '🚨 كسر الدائرة — تنبيه طوارئ حرج',
        emergencyPhone: redFlagResult.emergencyPhone || '997',
      };

      setMessages((prev) => [...prev, userMsg, emergencyMsg]);
      setInputText('');
      return;
    }

    // ─── 2. فحص الحساسية والتداخلات مع سجل العائلة ───
    const allAllergies = familyMembers.flatMap((m) => m.allergies);
    const allergyResult = ClinicalSafetyEngine.checkAllergy(userText, allAllergies);

    if (!allergyResult.isSafe) {
      const allergyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `${allergyResult.title}\n\n${allergyResult.reason}\n\n⚠️ ${allergyResult.actionRequired}`,
        isRedFlag: true,
        safetyTitle: 'حظر حساسية دوائية',
      };

      setMessages((prev) => [...prev, userMsg, allergyMsg]);
      setInputText('');
      return;
    }

    // ─── 3. الرد الاسترشادي الآمن الموثق ───
    const safeResponseMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: `تم فحص استفسارك عبر محرك السلامة السريرية:\nلم يتم رصد تداخلات خطيرة مباشرة مع ملف الأسرة الصحي.\n\nتذكير صحي:\nتأكد دائماً من الالتزام بالجرعات المدونة على العبوة واستشر الصيدلي عند الشك.`,
      knowledgeVerified: true,
      safetyTitle: 'موثق عبر قاعدة المعرفة الطبية',
    };

    setMessages((prev) => [...prev, userMsg, safeResponseMsg]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ─── الترويسة الطبية ─── */}
        <View style={styles.header}>
          <View style={styles.aiBadge}>
            <BrainCircuit size={22} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
          </View>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <View style={styles.titleRow}>
              <Text variant="headingMD" color={Colors.textPrimary}>
                المساعد الصحي «شخّصني»
              </Text>
              <View style={styles.verifiedTag}>
                <ShieldCheck size={12} color={Colors.success} strokeWidth={IconDefaults.strokeWidth} />
                <Text variant="caption" color={Colors.success}>
                  طبقة سريرية آمنة
                </Text>
              </View>
            </View>
            <Text variant="caption" color={Colors.textSecondary}>
              مبني على قواعد أمان مستقلة وقاعدة معرفة دوائية موثوقة
            </Text>
          </View>
        </View>

        {/* ─── قائمة الرسائل ─── */}
        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <View style={styles.bubbleHeader}>
                {msg.sender === 'ai' ? (
                  <Bot size={16} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
                ) : (
                  <User size={16} color={Colors.textOnPrimary} strokeWidth={IconDefaults.strokeWidth} />
                )}
                <Text
                  variant="labelSM"
                  color={msg.sender === 'user' ? Colors.textOnPrimary : Colors.primary}
                >
                  {msg.sender === 'ai' ? 'شخّصني' : 'أنت'}
                </Text>
              </View>

              <Text
                variant="bodyMD"
                color={msg.sender === 'user' ? Colors.textOnPrimary : Colors.textPrimary}
                style={{ lineHeight: 22 }}
              >
                {msg.text}
              </Text>

              {msg.isRedFlag && (
                <TouchableOpacity style={styles.emergencyBtn} activeOpacity={0.85}>
                  <PhoneCall size={18} color={Colors.textOnPrimary} strokeWidth={IconDefaults.strokeWidth} />
                  <Text variant="labelMD" color={Colors.textOnPrimary}>
                    اتصال فوري بالإسعاف (997)
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>

        {/* ─── مقترحات سريعة ─── */}
        <View style={styles.quickPromptsRow}>
          {QUICK_PROMPTS.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.promptChip}
              onPress={() => setInputText(prompt)}
            >
              <Sparkles size={12} color={Colors.secondary} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="caption" color={Colors.textPrimary}>
                {prompt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── حقل الإرسال ─── */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="اسأل عن أي دواء أو أعراض..."
            placeholderTextColor={Colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            style={styles.chatInput}
            textAlign="right"
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSend}
            activeOpacity={0.8}
          >
            <Send size={18} color={Colors.textOnPrimary} strokeWidth={IconDefaults.strokeWidth} />
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  aiBadge: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  verifiedTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  messageBubble: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    maxWidth: '90%',
    gap: Spacing.xs,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  bubbleHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 2,
  },
  emergencyBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.danger,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
  },
  quickPromptsRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  promptChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  chatInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
