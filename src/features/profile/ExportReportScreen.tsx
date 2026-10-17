/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  تِرياقي (Tiryāqi) — Feature: ExportReportScreen (تصدير وطباعة التقرير الصحي)
 *  تجهيز تقرير شامل للأدوية والحساسية لعرضه على الطبيب أو أقسام الطوارئ
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
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowRight,
  Printer,
  Share2,
  FileText,
  ShieldAlert,
  HeartPulse,
  Pill,
  CheckCircle2,
  User,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useMedicineStore } from '../../store/useMedicineStore';

export const ExportReportScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { familyMembers, medicines } = useMedicineStore();

  const [selectedMemberId, setSelectedMemberId] = useState<string>(familyMembers[0]?.id || '1');
  const selectedMember = familyMembers.find((m) => m.id === selectedMemberId) || familyMembers[0];

  // الأدوية المخصصة لهذا الفرد أو الأدوية العامة
  const memberMeds = medicines.filter(
    (m) => m.assignedTo.includes(selectedMember.name) || m.assignedTo.includes('عام')
  );

  const handlePrint = () => {
    Alert.alert(
      'طباعة التقرير الطبي 🖨️',
      `تم إرسال أمر الطباعة للتقرير الصحي الخاص بـ (${selectedMember.name}) ويتضمن كافة الأدوية والحساسية المسجلة.`
    );
  };

  const handleShare = async () => {
    const reportText = `
═══════════════════════════════════════
  تقرير الصيدلية المنزلية — تِرياقي (Tiryāqi)
═══════════════════════════════════════
المريض: ${selectedMember.name} (${selectedMember.age} سنة)
صلة القرابة: ${selectedMember.relation}
الأمراض المزمنة: ${selectedMember.chronicConditions.join('، ') || 'لا توجد'}
الحساسية المسجلة: ${selectedMember.allergies.join('، ') || 'لا توجد'}
───────────────────────────────────────
قائمة الأدوية المعتمدة حالياً:
${memberMeds
  .map(
    (m, idx) =>
      `${idx + 1}. ${m.name}\n   المادة: ${m.activeIngredient}\n   الجرعة: ${m.dosage}\n   الإرشادات: ${m.instructions}`
  )
  .join('\n\n')}
───────────────────────────────────────
تاريخ إصدار التقرير: ${new Date().toLocaleDateString('ar-SA')}
تطبيق تِرياقي — ذكاء يرعى عافيتك
    `;

    try {
      await Share.share({
        message: reportText,
        title: `تقرير أدوية ${selectedMember.name} - تِرياقي`,
      });
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowRight size={22} color={Colors.textPrimary} strokeWidth={IconDefaults.strokeWidth} />
        </TouchableOpacity>
        <Text variant="headingMD" color={Colors.textPrimary}>
          تصدير وطباعة التقرير الطبي
        </Text>
        <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
          <Share2 size={20} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── اختيار فرد الأسرة ─── */}
        <Text variant="labelLG" color={Colors.textPrimary}>
          اختر الفرد لتصدير تقريره الصحي:
        </Text>
        <View style={styles.membersRow}>
          {familyMembers.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={[
                styles.memberTab,
                selectedMemberId === member.id && styles.memberTabActive,
              ]}
              onPress={() => setSelectedMemberId(member.id)}
            >
              <Text
                variant="labelSM"
                color={selectedMemberId === member.id ? Colors.textOnPrimary : Colors.textPrimary}
              >
                {member.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── معاينة التقرير القابل للطباعة (Print Preview Card) ─── */}
        <Card style={styles.reportPreviewCard}>
          {/* ترويسة التقرير الرسمية */}
          <View style={styles.reportHeader}>
            <View>
              <Text variant="headingSM" color={Colors.primary}>
                تِرياقي — التقرير السريري المنزلي
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                تاريخ التقرير: {new Date().toLocaleDateString('ar-EG')}
              </Text>
            </View>
            <View style={styles.verifiedStamp}>
              <CheckCircle2 size={16} color={Colors.success} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="caption" color={Colors.success}>
                سجل موثق
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* بيانات الفرد */}
          <View style={styles.patientInfoBox}>
            <Text variant="labelLG" color={Colors.textPrimary}>
              الاسم: {selectedMember.name}
            </Text>
            <Text variant="bodySM" color={Colors.textSecondary}>
              العمر: {selectedMember.age} سنة • {selectedMember.relation}
            </Text>
          </View>

          {/* الحساسية وموانع الاستعمال */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionTitleRow}>
              <ShieldAlert size={16} color={Colors.danger} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="labelMD" color={Colors.danger}>
                الحساسية الدوائية والغذائية المحظورة
              </Text>
            </View>
            <Text variant="bodySM" color={Colors.textPrimary} style={{ marginTop: 2 }}>
              {selectedMember.allergies.join(' ، ') || 'لا توجد حساسية مسجلة'}
            </Text>
          </View>

          {/* الأمراض المزمنة */}
          <View style={styles.sectionBox}>
            <View style={styles.sectionTitleRow}>
              <HeartPulse size={16} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="labelMD" color={Colors.textPrimary}>
                الأمراض والحالات الصحية المزمنة
              </Text>
            </View>
            <Text variant="bodySM" color={Colors.textSecondary} style={{ marginTop: 2 }}>
              {selectedMember.chronicConditions.join(' ، ') || 'لا توجد أمراض مزمنة'}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* جدول الأدوية الحالية */}
          <View style={styles.sectionTitleRow}>
            <Pill size={16} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            <Text variant="labelMD" color={Colors.textPrimary}>
              الأدوية والمكملات المستخدمة ({memberMeds.length})
            </Text>
          </View>

          <View style={styles.medsTable}>
            {memberMeds.map((med, idx) => (
              <View key={med.id} style={styles.tableRow}>
                <Text variant="labelSM" color={Colors.textPrimary}>
                  {idx + 1}. {med.name} ({med.dosage})
                </Text>
                <Text variant="caption" color={Colors.textSecondary}>
                  المادة: {med.activeIngredient} • {med.instructions}
                </Text>
              </View>
            ))}
          </View>

          {/* توقيع وإخلاء مسؤولية */}
          <View style={styles.disclaimerBox}>
            <Text variant="caption" color={Colors.textSecondary} style={{ textAlign: 'center' }}>
              هذا التقرير مُستخرج من منظومة تِرياقي للمساعدة في الرعاية الطبية، ولا يُعد بديلاً عن الوصفة المعتمدة.
            </Text>
          </View>
        </Card>

        {/* ─── أزرار الإجراءات (طباعة ومشاركة) ─── */}
        <View style={styles.actionButtonsRow}>
          <Button
            label="طباعة التقرير"
            variant="outline"
            onPress={handlePrint}
            leftIcon={Printer}
            style={{ flex: 1 }}
          />
          <Button
            label="مشاركة ملف PDF"
            variant="primary"
            onPress={handleShare}
            leftIcon={Share2}
            style={{ flex: 1 }}
          />
        </View>
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
  membersRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.sm,
  },
  memberTab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  memberTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  reportPreviewCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reportHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verifiedStamp: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  patientInfoBox: {
    gap: 2,
  },
  sectionBox: {
    backgroundColor: Colors.backgroundBase,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  sectionTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  medsTable: {
    gap: Spacing.sm,
  },
  tableRow: {
    paddingVertical: Spacing.xs,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    gap: 2,
  },
  disclaimerBox: {
    paddingTop: Spacing.sm,
  },
  actionButtonsRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.md,
  },
});
