/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Feature: Cabinet (خزانة الأدوية)
 *  إدارة المخزون، تتبع الصلاحية، والتصنيفات
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
  Search,
  Filter,
  Pill,
  Calendar,
  AlertCircle,
  Plus,
  QrCode,
  ShieldAlert,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults, IconSize } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useNavigation } from '@react-navigation/native';
import { useMedicineStore, Medicine } from '../../store/useMedicineStore';

const CATEGORIES = ['الكل', 'مزمنة', 'مسكنات', 'مضادات', 'فيتامينات ومكملات', 'طوارئ'];

export const CabinetScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const medicines = useMedicineStore((state) => state.medicines);

  const [selectedCat, setSelectedCat] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMeds = medicines.filter((med) => {
    const matchCat = selectedCat === 'الكل' || med.category === selectedCat;
    const matchQuery =
      med.name.includes(searchQuery) || med.activeIngredient.includes(searchQuery);
    return matchCat && matchQuery;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ─── الترويسة ─── */}
        <View style={styles.header}>
          <View>
            <Text variant="headingLG" color={Colors.textPrimary}>
              خزانة الأدوية
            </Text>
            <Text variant="bodySM" color={Colors.textSecondary}>
              إجمالي {medicines.length} أدوية مسجلة في النظام
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('AddMedicine')}
          >
            <Plus size={20} color={Colors.textOnPrimary} strokeWidth={IconDefaults.strokeWidth} />
            <Text variant="labelSM" color={Colors.textOnPrimary}>
              إضافة
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── شريط البحث ─── */}
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textSecondary} strokeWidth={IconDefaults.strokeWidth} />
          <TextInput
            placeholder="ابحث بالاسم التجاري أو المادة الفعالة..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            textAlign="right"
          />
        </View>

        {/* ─── الفلاتر ─── */}
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, selectedCat === cat && styles.catChipActive]}
                onPress={() => setSelectedCat(cat)}
              >
                <Text
                  variant="labelSM"
                  color={selectedCat === cat ? Colors.textOnPrimary : Colors.textPrimary}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ─── قائمة الأدوية ─── */}
        <ScrollView
          style={styles.medsList}
          contentContainerStyle={styles.medsListContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredMeds.map((med) => (
            <Card
              key={med.id}
              style={styles.cardItem}
              onPress={() => navigation.navigate('MedicineDetail', { medicineId: med.id })}
            >
              <View style={styles.cardHeader}>
                <View style={styles.medTitleBox}>
                  <Text variant="headingSM" color={Colors.textPrimary}>
                    {med.name}
                  </Text>
                  <Text variant="caption" color={Colors.textSecondary}>
                    المادة: {med.activeIngredient}
                  </Text>
                </View>

                {med.isAllergyRisk ? (
                  <StatusBadge type="danger" label="حظر حساسية" />
                ) : (
                  <StatusBadge type="success" label="صالح وآمن" />
                )}
              </View>

              {med.allergyWarning && (
                <View style={[styles.warningBanner, { backgroundColor: Colors.dangerLight }]}>
                  <ShieldAlert size={16} color={Colors.danger} strokeWidth={IconDefaults.strokeWidth} />
                  <Text variant="bodySM" color={Colors.danger}>
                    {med.allergyWarning}
                  </Text>
                </View>
              )}

              <View style={styles.cardFooter}>
                <View style={styles.footerInfo}>
                  <Pill size={16} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
                  <Text variant="bodySM" color={Colors.textPrimary}>
                    الكمية: {med.quantity} {med.unit}
                  </Text>
                </View>
                <View style={styles.footerInfo}>
                  <Calendar size={16} color={Colors.textSecondary} strokeWidth={IconDefaults.strokeWidth} />
                  <Text variant="bodySM" color={Colors.textSecondary}>
                    الصلاحية: {med.expiryDate}
                  </Text>
                </View>
                <View style={styles.assignedTag}>
                  <Text variant="caption" color={Colors.primary}>
                    👤 {med.assignedTo}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </ScrollView>
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
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  searchBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  categoryRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  catChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  medsList: {
    flex: 1,
  },
  medsListContent: {
    gap: Spacing.md,
    paddingBottom: Spacing['4xl'],
  },
  cardItem: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  medTitleBox: {
    flex: 1,
    gap: 2,
    marginLeft: Spacing.sm,
  },
  warningBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  footerInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  assignedTag: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
});
