/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Feature: Profile (الملف الصحي العائلي)
 *  إدارة أفراد الأسرة، سجل الحساسية، والأجهزة المتصلة
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
  Users,
  ShieldAlert,
  HeartPulse,
  Cpu,
  Crown,
  ChevronLeft,
  Plus,
  CheckCircle2,
  FileText,
  Headphones,
  Store,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';

interface Member {
  id: string;
  name: string;
  relation: string;
  age: number;
  chronic: string[];
  allergies: string[];
  color: string;
}

const FAMILY_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'أبو أسامة (الوالد)',
    relation: 'رب الأسرة',
    age: 62,
    chronic: ['ضغط الدم', 'السكري النوع الثاني'],
    allergies: ['لا توجد'],
    color: Colors.primary,
  },
  {
    id: '2',
    name: 'أم أسامة (الوالدة)',
    relation: 'الزوجة',
    age: 58,
    chronic: ['الربو'],
    allergies: ['البنسلين (شديدة ⛔)', 'الأسبرين'],
    color: Colors.secondary,
  },
  {
    id: '3',
    name: 'سارة',
    relation: 'الابنة',
    age: 8,
    chronic: ['لا توجد'],
    allergies: ['الفول السوداني'],
    color: '#E07A5F',
  },
];

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [selectedMember, setSelectedMember] = useState(FAMILY_MEMBERS[0]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── الترويسة ─── */}
        <View style={styles.header}>
          <Text variant="headingLG" color={Colors.textPrimary}>
            الملف الصحي للأسرة
          </Text>
          <TouchableOpacity style={styles.addMemberBtn} activeOpacity={0.8}>
            <Plus size={18} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            <Text variant="labelSM" color={Colors.primary}>
              إضافة فرد
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── محوّل أفراد العائلة (Family Switcher) ─── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.membersRow}
        >
          {FAMILY_MEMBERS.map(member => {
            const isSelected = selectedMember.id === member.id;
            return (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberCard,
                  isSelected && styles.memberCardActive,
                ]}
                onPress={() => setSelectedMember(member)}
                activeOpacity={0.85}
              >
                <View style={[styles.avatarCircle, { backgroundColor: member.color }]}>
                  <Text variant="labelLG" color={Colors.textOnPrimary}>
                    {member.name.charAt(0)}
                  </Text>
                </View>
                <Text
                  variant="labelMD"
                  color={isSelected ? Colors.primary : Colors.textPrimary}
                  numberOfLines={1}
                >
                  {member.name}
                </Text>
                <Text variant="caption" color={Colors.textSecondary}>
                  {member.age} سنة
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ─── بطاقة الملف الصحي للفرد المحدد ─── */}
        <Card style={styles.profileCard}>
          <View style={styles.profileTitleRow}>
            <View>
              <Text variant="headingMD" color={Colors.textPrimary}>
                {selectedMember.name}
              </Text>
              <Text variant="bodySM" color={Colors.textSecondary}>
                العمر: {selectedMember.age} سنة • {selectedMember.relation}
              </Text>
            </View>
            <View style={styles.statusPill}>
              <Text variant="caption" color={Colors.primary}>
                الملف نشط
              </Text>
            </View>
          </View>

          {/* الأمراض المزمنة */}
          <View style={styles.sectionDivider} />
          <View style={styles.infoGroup}>
            <View style={styles.labelRow}>
              <HeartPulse size={18} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="labelMD" color={Colors.textPrimary}>
                الأمراض المزمنة المسجلة
              </Text>
            </View>
            <View style={styles.tagsContainer}>
              {selectedMember.chronic.map((item, idx) => (
                <View key={idx} style={styles.tagBadge}>
                  <Text variant="bodySM" color={Colors.textPrimary}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* قائمة الحساسية المعيارية */}
          <View style={styles.sectionDivider} />
          <View style={styles.infoGroup}>
            <View style={styles.labelRow}>
              <ShieldAlert size={18} color={Colors.danger} strokeWidth={IconDefaults.strokeWidth} />
              <Text variant="labelMD" color={Colors.danger}>
                الحساسية الدوائية (نظام الحظر التلقائي)
              </Text>
            </View>
            <View style={styles.tagsContainer}>
              {selectedMember.allergies.map((allergy, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.tagBadge,
                    allergy.includes('شديدة') && styles.allergyDanger,
                  ]}
                >
                  <Text
                    variant="bodySM"
                    color={allergy.includes('شديدة') ? Colors.danger : Colors.textPrimary}
                  >
                    {allergy}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Card>

        {/* ─── الأجهزة الذكية المتصلة (IoT) ─── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('IoTDashboard')}
          activeOpacity={0.85}
        >
          <Card style={styles.iotStatusCard} variant="soft">
            <View style={styles.iotCardHeader}>
              <Cpu size={22} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <Text variant="labelLG" color={Colors.textPrimary}>
                  إدارة خزانة الأدوية الذكية (IoT Hub)
                </Text>
                <Text variant="caption" color={Colors.textSecondary}>
                  التحكم بالقفل، درجات الحرارة، وسجل الاستخدام
                </Text>
              </View>
              <ChevronLeft size={18} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            </View>
          </Card>
        </TouchableOpacity>

        {/* ─── تصدير وطباعة التقرير الصحي ─── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ExportReport')}
          activeOpacity={0.85}
        >
          <Card style={styles.actionCardRow}>
            <FileText size={22} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="labelLG" color={Colors.textPrimary}>
                تصدير وطباعة التقرير الطبي
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                مشاركة تقرير موثق للأدوية والحساسية مع الطبيب المعالج
              </Text>
            </View>
            <ChevronLeft size={18} color={Colors.textSecondary} strokeWidth={IconDefaults.strokeWidth} />
          </Card>
        </TouchableOpacity>

        {/* ─── مركز الدعم الفني ─── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Support')}
          activeOpacity={0.85}
        >
          <Card style={styles.actionCardRow}>
            <Headphones size={22} color={Colors.secondary} strokeWidth={IconDefaults.strokeWidth} />
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="labelLG" color={Colors.textPrimary}>
                الدعم الفني ومركز المساعدة
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                الأسئلة الشائعة، قنوات التواصل، وإرشادات العتاد
              </Text>
            </View>
            <ChevronLeft size={18} color={Colors.textSecondary} strokeWidth={IconDefaults.strokeWidth} />
          </Card>
        </TouchableOpacity>

        {/* ─── شبكة الصيدليات الشريكة وإعادة الطلب ─── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Pharmacies')}
          activeOpacity={0.85}
        >
          <Card style={styles.actionCardRow}>
            <Store size={22} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="labelLG" color={Colors.textPrimary}>
                شبكة الصيدليات الشريكة
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                مقارنة الأسعار، إعادة تعبئة الأدوية، والتوصيل المنزلي
              </Text>
            </View>
            <ChevronLeft size={18} color={Colors.textSecondary} strokeWidth={IconDefaults.strokeWidth} />
          </Card>
        </TouchableOpacity>

        {/* ─── الاشتراك والترقية (B2B / Freemium) ─── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Subscription')}
          activeOpacity={0.85}
        >
          <Card style={styles.planCard}>
            <View style={styles.planContent}>
              <View style={styles.crownIconBox}>
                <Crown size={22} color="#D4A373" strokeWidth={IconDefaults.strokeWidth} />
              </View>
              <View style={{ flex: 1, marginRight: Spacing.sm }}>
                <Text variant="labelLG" color={Colors.textPrimary}>
                  باقة تِرياقي بلس (Premium)
                </Text>
                <Text variant="caption" color={Colors.textSecondary}>
                  تحكم غير محدود بأجهزة IoT واستشارات صيدلانية فورية
                </Text>
              </View>
              <ChevronLeft size={18} color="#D4A373" strokeWidth={IconDefaults.strokeWidth} />
            </View>
          </Card>
        </TouchableOpacity>
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
  addMemberBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  membersRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  memberCard: {
    backgroundColor: Colors.backgroundCard,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
    width: 110,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.xs,
  },
  memberCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.green50,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  profileTitleRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusPill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  infoGroup: {
    gap: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tagBadge: {
    backgroundColor: Colors.backgroundBase,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  allergyDanger: {
    backgroundColor: Colors.dangerLight,
    borderColor: Colors.danger,
  },
  iotStatusCard: {
    padding: Spacing.md,
  },
  iotCardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  planCard: {
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#D4A373',
  },
  planContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  crownIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(212, 163, 115, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCardRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: Spacing.md,
  },
});
