/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Feature: PharmaciesScreen (الصيدليات وإعادة الطلب)
 *  التكامل التجاري: كتالوج الصيدليات الشريكة، مقارنة الأسعار، وإعادة الطلب
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
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowRight,
  Store,
  Clock,
  MapPin,
  Truck,
  CheckCircle2,
  FileText,
  AlertCircle,
  X,
  CreditCard,
  Building2,
  Info,
} from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useMedicineStore } from '../../store/useMedicineStore';

interface Pharmacy {
  id: string;
  name: string;
  branch: string;
  distance: string;
  deliveryTime: string;
  deliveryFee: number;
  isOpen: boolean;
  rating: number;
}

const PARTNER_PHARMACIES: Pharmacy[] = [
  {
    id: 'ph-1',
    name: 'صيدلية النّهدي (شريك معتمد)',
    branch: 'فرع طريق الملك فهد',
    distance: '1.2 كم',
    deliveryTime: '30-45 دقيقة',
    deliveryFee: 12,
    isOpen: true,
    rating: 4.9,
  },
  {
    id: 'ph-2',
    name: 'صيدلية الدّواء (شريك معتمد)',
    branch: 'فرع حي النرجس',
    distance: '2.5 كم',
    deliveryTime: '40-55 دقيقة',
    deliveryFee: 10,
    isOpen: true,
    rating: 4.8,
  },
  {
    id: 'ph-3',
    name: 'صيدليات المجتمع الطبية',
    branch: 'فرع الياسمين',
    distance: '3.1 كم',
    deliveryTime: '45-60 دقيقة',
    deliveryFee: 15,
    isOpen: true,
    rating: 4.7,
  },
];

export const PharmaciesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const medicines = useMedicineStore((state) => state.medicines);

  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy>(PARTNER_PHARMACIES[0]);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [selectedMed, setSelectedMed] = useState(medicines[0] || null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // حساب التكلفة والعمولة الشفافة
  const basePrice = (selectedMed?.price || 24) * orderQuantity;
  const deliveryFee = selectedPharmacy.deliveryFee;
  const platformCommission = 2.5; // عمولة المنصة التقنية
  const totalPrice = basePrice + deliveryFee + platformCommission;

  const handleOpenOrder = (med: typeof medicines[0]) => {
    setSelectedMed(med);
    setOrderQuantity(1);
    setOrderPlaced(false);
    setOrderModalVisible(true);
  };

  const handleConfirmOrder = () => {
    // فحص ضوابط الوصفة الطبية (Rx requirement check)
    if (selectedMed?.isPrescriptionRequired) {
      Alert.alert(
        '⚠️ يتطلب وصفة طبية صالحة',
        `دواء (${selectedMed.name}) خاضع للوصفة الطبية المعتمدة وفق لوائح هيئة الغذاء والدواء. يجب إرفاق وصفة إلكترونية قبل اعتماد الصرف من الصيدلي.`,
        [{ text: 'فهمت ذلك', style: 'default' }]
      );
      return;
    }

    setOrderPlaced(true);
    setTimeout(() => {
      Alert.alert(
        'تم إرسال الطلب بنجاح إلى الصيدلية! 📦',
        `تم إشعار (${selectedPharmacy.name}) بالطلب. ستصلك الأدوية خلال ${selectedPharmacy.deliveryTime}.\n(وضع المحاكاة التجريبي: لا يتم خصم فعلي من حسابك).`,
        [
          {
            text: 'حسناً',
            onPress: () => {
              setOrderModalVisible(false);
              setOrderPlaced(false);
            },
          },
        ]
      );
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ─── الشريط العلوي ─── */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowRight size={22} color={Colors.textPrimary} strokeWidth={IconDefaults.strokeWidth} />
        </TouchableOpacity>
        <Text variant="headingMD" color={Colors.textPrimary}>
          الصيدليات وإعادة الطلب
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── بطاقة التنبيه التجريبي ─── */}
        <View style={styles.simulationBanner}>
          <Building2 size={22} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <Text variant="labelMD" color={Colors.primary}>
              شبكة الصيدليات الشريكة المعتمدة
            </Text>
            <Text variant="caption" color={Colors.textSecondary}>
              إعادة طلب الأدوية ومقارنة أسعار وتوفر المخزون لحظياً من الصيدليات الأقرب لمنزلك.
            </Text>
          </View>
        </View>

        {/* ─── قائمة الصيدليات الشريكة ─── */}
        <Text variant="labelLG" color={Colors.textPrimary} style={styles.sectionTitle}>
          الصيدليات الأقرب إليك
        </Text>

        {PARTNER_PHARMACIES.map((pharmacy) => {
          const isSelected = selectedPharmacy.id === pharmacy.id;
          return (
            <TouchableOpacity
              key={pharmacy.id}
              activeOpacity={0.85}
              onPress={() => setSelectedPharmacy(pharmacy)}
            >
              <Card
                style={[
                  styles.pharmacyCard,
                  isSelected && styles.pharmacyCardSelected,
                ]}
              >
                <View style={styles.pharmacyHeader}>
                  <View style={styles.pharmacyIconBox}>
                    <Store size={24} color={isSelected ? Colors.textOnPrimary : Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
                  </View>
                  <View style={{ flex: 1, marginRight: Spacing.sm }}>
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text variant="labelLG" color={Colors.textPrimary}>
                        {pharmacy.name}
                      </Text>
                      <View style={styles.ratingBadge}>
                        <Text variant="caption" color={Colors.primary} style={{ fontWeight: '700' }}>
                          ★ {pharmacy.rating}
                        </Text>
                      </View>
                    </View>
                    <Text variant="bodySM" color={Colors.textSecondary}>
                      {pharmacy.branch}
                    </Text>
                  </View>
                </View>

                <View style={styles.pharmacyDetailsRow}>
                  <View style={styles.detailItem}>
                    <MapPin size={14} color={Colors.textSecondary} strokeWidth={IconDefaults.strokeWidth} />
                    <Text variant="caption" color={Colors.textSecondary}>
                      {pharmacy.distance}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={14} color={Colors.textSecondary} strokeWidth={IconDefaults.strokeWidth} />
                    <Text variant="caption" color={Colors.textSecondary}>
                      {pharmacy.deliveryTime}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Truck size={14} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
                    <Text variant="caption" color={Colors.primary} style={{ fontWeight: '700' }}>
                      توصيل {pharmacy.deliveryFee} ر.س
                    </Text>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}

        {/* ─── الأدوية القابلة لإعادة التعبئة في صيدليتك ─── */}
        <Text variant="labelLG" color={Colors.textPrimary} style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>
          أدوية الخزانة المتوفرة لإعادة الطلب
        </Text>

        {medicines.map((med) => (
          <Card key={med.id} style={styles.medicineRefillCard}>
            <View style={styles.medCardRow}>
              <View style={{ flex: 1 }}>
                <Text variant="labelLG" color={Colors.textPrimary}>
                  {med.name}
                </Text>
                <Text variant="bodySM" color={Colors.textSecondary}>
                  {med.activeIngredient} • {med.dosage}
                </Text>
                <Text variant="caption" color={med.quantity <= 5 ? Colors.danger : Colors.primary} style={{ marginTop: 2 }}>
                  المتبقي في الخزانة: {med.quantity} {med.unit}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <Text variant="labelMD" color={Colors.primary} style={{ fontWeight: '700' }}>
                  {med.price || 24} ر.س
                </Text>
                <Button
                  label="إعادة الطلب"
                  variant="primary"
                  size="sm"
                  onPress={() => handleOpenOrder(med)}
                />
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* ─── نافذة إتمام الطلب ومراجعة الأسعار ─── */}
      <Modal
        visible={orderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text variant="headingMD" color={Colors.textPrimary}>
                مراجعة وتأكيد طلب الدواء
              </Text>
              <TouchableOpacity onPress={() => setOrderModalVisible(false)}>
                <X size={24} color={Colors.textSecondary} strokeWidth={IconDefaults.strokeWidth} />
              </TouchableOpacity>
            </View>

            {selectedMed && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* الصيدلية المنفذة */}
                <View style={styles.orderPharmacyBox}>
                  <Store size={20} color={Colors.primary} strokeWidth={IconDefaults.strokeWidth} />
                  <View style={{ flex: 1, marginRight: Spacing.xs }}>
                    <Text variant="labelMD" color={Colors.textPrimary}>
                      {selectedPharmacy.name}
                    </Text>
                    <Text variant="caption" color={Colors.textSecondary}>
                      توصيل متوقع خلال: {selectedPharmacy.deliveryTime}
                    </Text>
                  </View>
                </View>

                {/* تفاصيل الدواء والكمية */}
                <View style={styles.orderMedicineBox}>
                  <Text variant="labelLG" color={Colors.textPrimary}>
                    {selectedMed.name}
                  </Text>
                  <Text variant="bodySM" color={Colors.textSecondary}>
                    {selectedMed.dosage} • مخصص لـ ({selectedMed.assignedTo})
                  </Text>

                  <View style={styles.quantityPickerRow}>
                    <Text variant="labelMD" color={Colors.textPrimary}>
                      الكمية المطلوبة:
                    </Text>
                    <View style={styles.counterRow}>
                      <TouchableOpacity
                        style={styles.counterBtn}
                        onPress={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                      >
                        <Text variant="labelLG">-</Text>
                      </TouchableOpacity>
                      <Text variant="headingMD" style={{ marginHorizontal: Spacing.md }}>
                        {orderQuantity}
                      </Text>
                      <TouchableOpacity
                        style={styles.counterBtn}
                        onPress={() => setOrderQuantity(orderQuantity + 1)}
                      >
                        <Text variant="labelLG">+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* تفصيل الفاتورة والعمولة */}
                <View style={styles.billBox}>
                  <View style={styles.billRow}>
                    <Text variant="bodySM" color={Colors.textSecondary}>
                      سعر الدواء ({orderQuantity} عبوة)
                    </Text>
                    <Text variant="labelMD" color={Colors.textPrimary}>
                      {basePrice} ر.س
                    </Text>
                  </View>

                  <View style={styles.billRow}>
                    <Text variant="bodySM" color={Colors.textSecondary}>
                      رسوم التوصيل السريع
                    </Text>
                    <Text variant="labelMD" color={Colors.textPrimary}>
                      {deliveryFee} ر.س
                    </Text>
                  </View>

                  <View style={styles.billRow}>
                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4 }}>
                      <Text variant="bodySM" color={Colors.textSecondary}>
                        رسوم المنصة والتحقق الصيدلي
                      </Text>
                      <Info size={14} color={Colors.textSecondary} strokeWidth={IconDefaults.strokeWidth} />
                    </View>
                    <Text variant="labelMD" color={Colors.textPrimary}>
                      {platformCommission} ر.س
                    </Text>
                  </View>

                  <View style={styles.billDivider} />

                  <View style={styles.billRow}>
                    <Text variant="headingMD" color={Colors.primary}>
                      المجموع الإجمالي
                    </Text>
                    <Text variant="headingLG" color={Colors.primary}>
                      {totalPrice} ر.س
                    </Text>
                  </View>
                </View>

                <Button
                  label={orderPlaced ? 'جاري تجهيز الطلب...' : 'تأكيد الطلب والدفع عند الاستلام'}
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={handleConfirmOrder}
                  disabled={orderPlaced}
                  leftIcon={Truck}
                  style={{ marginTop: Spacing.lg }}
                />
              </ScrollView>
            )}
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
  simulationBanner: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.green100,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.secondary,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    textAlign: 'right',
  },
  pharmacyCard: {
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pharmacyCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundCard,
  },
  pharmacyHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  pharmacyIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    backgroundColor: Colors.green100,
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pharmacyDetailsRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  detailItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  medicineRefillCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  medCardRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: Radius['2xl'],
    borderTopRightRadius: Radius['2xl'],
    padding: Spacing['2xl'],
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderPharmacyBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: Colors.green100,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  orderMedicineBox: {
    backgroundColor: Colors.backgroundSoft,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  quantityPickerRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  billBox: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  billRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  billDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
});
