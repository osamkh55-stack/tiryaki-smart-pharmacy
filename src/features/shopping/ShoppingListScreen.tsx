/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  تِرياقي (Tiryāqi) — Feature: ShoppingListScreen (قوائم مشتريات الصيدلية)
 *  جدولة نواقص الخزانة، حساب التكلفة التقديرية، والفرز العاجل
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
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowRight,
  ShoppingCart,
  Plus,
  CheckCircle2,
  Circle,
  AlertCircle,
  Trash2,
  Share2,
  Sparkles,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useMedicineStore, ShoppingItem } from '../../store/useMedicineStore';

export const ShoppingListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { shoppingList, addShoppingItem, toggleShoppingItem, removeShoppingItem } =
    useMedicineStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('علبة');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  // حساب التكلفة الإجمالية للنواقص المتبقية
  const totalPendingCost = shoppingList
    .filter((item) => !item.isBought && item.estimatedPrice)
    .reduce((sum, item) => sum + (item.estimatedPrice || 0) * item.quantity, 0);

  const handleAddNewItem = () => {
    if (!itemName.trim()) {
      Alert.alert('تنبيه', 'يرجى كتابة اسم المنتج أو الدواء الناقص');
      return;
    }

    addShoppingItem({
      name: itemName,
      quantity: parseInt(quantity, 10) || 1,
      unit: unit || 'علبة',
      isUrgent,
      estimatedPrice: parseFloat(estimatedPrice) || undefined,
      notes: notes || undefined,
    });

    setItemName('');
    setQuantity('1');
    setEstimatedPrice('');
    setNotes('');
    setIsUrgent(false);
    setModalVisible(false);
  };

  const handleShareList = () => {
    const textList = shoppingList
      .map(
        (item, idx) =>
          `${idx + 1}. ${item.name} (${item.quantity} ${item.unit}) ${
            item.isUrgent ? '⚠️ عاجل' : ''
          } ${item.isBought ? '✅ تم الشراء' : '⏳ متبقي'}`
      )
      .join('\n');

    Alert.alert(
      'مشاركة قائمة المشتريات 📋',
      `تم تجهيز القائمة لإرسالها عبر واتساب أو الرسائل:\n\n${textList}`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ─── الشريط العلوي ─── */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowRight size={22} color={Colors.textPrimary} strokeWidth={IconDefaults.strokeWidth} />
        </TouchableOpacity>
        <Text variant="headingMD" color={Colors.textPrimary}>
          قوائم مشتريات الصيدلية
        </Text>
        <TouchableOpacity onPress={handleShareList} style={styles.iconBtn}>
          <Share2 size={20} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── بطاقة إحصائيات التكلفة والمشتريات ─── */}
        <Card style={styles.summaryCard} variant="soft">
          <View style={styles.summaryHeader}>
            <View style={styles.cartIconWrapper}>
              <ShoppingCart size={24} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
            </View>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <Text variant="labelLG" color={Colors.textPrimary}>
                نواقص الخزانة المنزلية
              </Text>
              <Text variant="caption" color={Colors.textSecondary}>
                {shoppingList.filter((i) => !i.isBought).length} منتجات متبقية للشراء
              </Text>
            </View>
            <View style={styles.priceBadge}>
              <Text variant="caption" color={Colors.textSecondary}>
                التكلفة التقديرية:
              </Text>
              <Text variant="headingMD" color={Colors.primary}>
                {totalPendingCost.toFixed(1)} ر.س
              </Text>
            </View>
          </View>
        </Card>

        {/* ─── زر الإضافة السريعة ─── */}
        <TouchableOpacity
          style={styles.addItemBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Plus size={20} color={Colors.textOnPrimary} strokeWidth={IconDefaults.strokeWidth} />
          <Text variant="labelLG" color={Colors.textOnPrimary}>
            إضافة منتج أو دواء إلى القائمة
          </Text>
        </TouchableOpacity>

        {/* ─── قائمة العناصر ─── */}
        <View style={styles.itemsList}>
          {shoppingList.map((item) => (
            <Card key={item.id} style={styles.itemCard}>
              <View style={styles.itemRow}>
                {/* زر تأكيد الشراء */}
                <TouchableOpacity
                  style={styles.checkTouch}
                  onPress={() => toggleShoppingItem(item.id)}
                  activeOpacity={0.7}
                >
                  {item.isBought ? (
                    <CheckCircle2 size={24} color={Colors.success} strokeWidth={IconDefaults.strokeWidth} />
                  ) : (
                    <Circle size={24} color={Colors.border} strokeWidth={IconDefaults.strokeWidth} />
                  )}
                </TouchableOpacity>

                {/* تفاصيل العنصر */}
                <View style={styles.itemDetails}>
                  <View style={styles.nameRow}>
                    <Text
                      variant="labelLG"
                      color={item.isBought ? Colors.textSecondary : Colors.textPrimary}
                      style={item.isBought ? styles.strikethrough : undefined}
                    >
                      {item.name}
                    </Text>
                    {item.isUrgent && !item.isBought && (
                      <StatusBadge type="danger" label="عاجل" />
                    )}
                  </View>

                  <Text variant="bodySM" color={Colors.textSecondary}>
                    الكمية: {item.quantity} {item.unit}
                    {item.estimatedPrice ? ` • السعر: ${item.estimatedPrice} ر.س` : ''}
                  </Text>

                  {item.notes && (
                    <Text variant="caption" color={Colors.primary} style={{ marginTop: 2 }}>
                      ملاحظة: {item.notes}
                    </Text>
                  )}
                </View>

                {/* زر الحذف */}
                <TouchableOpacity
                  onPress={() => removeShoppingItem(item.id)}
                  style={styles.deleteBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Trash2 size={18} color={Colors.danger} strokeWidth={IconDefaults.strokeWidth} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* ─── Modal إضافة عنصر جديد ─── */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="headingMD" color={Colors.textPrimary} style={{ marginBottom: Spacing.md }}>
              إضافة عنصر لقائمة المشتريات
            </Text>

            <View style={styles.fieldGroup}>
              <Text variant="labelSM" color={Colors.textPrimary}>
                اسم الدواء أو المنتج الطبي *
              </Text>
              <TextInput
                style={styles.input}
                placeholder="مثال: قطن طبي، بانادول، خافض حرارة..."
                placeholderTextColor={Colors.textSecondary}
                value={itemName}
                onChangeText={setItemName}
                textAlign="right"
              />
            </View>

            <View style={styles.rowFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text variant="labelSM" color={Colors.textPrimary}>
                  الكمية
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                  textAlign="right"
                />
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text variant="labelSM" color={Colors.textPrimary}>
                  السعر المقدر (ر.س)
                </Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="اختياري"
                  placeholderTextColor={Colors.textSecondary}
                  value={estimatedPrice}
                  onChangeText={setEstimatedPrice}
                  textAlign="right"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text variant="labelSM" color={Colors.textPrimary}>
                ملاحظات
              </Text>
              <TextInput
                style={styles.input}
                placeholder="مثال: للأطفال، بنكهة الفراولة..."
                placeholderTextColor={Colors.textSecondary}
                value={notes}
                onChangeText={setNotes}
                textAlign="right"
              />
            </View>

            {/* مفتاح عاجل */}
            <TouchableOpacity
              style={[styles.urgentToggle, isUrgent && styles.urgentToggleActive]}
              onPress={() => setIsUrgent(!isUrgent)}
            >
              <AlertCircle
                size={18}
                color={isUrgent ? Colors.danger : Colors.textSecondary}
                strokeWidth={IconDefaults.strokeWidth}
              />
              <Text variant="labelSM" color={isUrgent ? Colors.danger : Colors.textPrimary}>
                تصنيف كعنصر عاجل وطارئ
              </Text>
            </TouchableOpacity>

            {/* أزرار الإجراء */}
            <View style={styles.modalActions}>
              <Button
                label="إلغاء"
                variant="ghost"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1 }}
              />
              <Button
                label="إضافة للقائمة"
                variant="primary"
                onPress={handleAddNewItem}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  summaryCard: {
    padding: Spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  cartIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadge: {
    alignItems: 'flex-start',
  },
  addItemBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  itemsList: {
    gap: Spacing.md,
  },
  itemCard: {
    padding: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkTouch: {
    padding: 2,
  },
  itemDetails: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    padding: Spacing['2xl'],
    gap: Spacing.md,
  },
  fieldGroup: {
    gap: Spacing.xs,
  },
  rowFields: {
    flexDirection: 'row-reverse',
    gap: Spacing.md,
  },
  input: {
    backgroundColor: Colors.backgroundBase,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  urgentToggle: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundBase,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  urgentToggleActive: {
    backgroundColor: Colors.dangerLight,
    borderColor: Colors.danger,
  },
  modalActions: {
    flexDirection: 'row-reverse',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});
