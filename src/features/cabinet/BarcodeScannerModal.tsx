/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Component: BarcodeScannerModal
 *  نافذة محاكاة ماسح الباركود التفاعلي مع خط الليزر المتحرك
 * ═══════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';
import { X, Flashlight, Camera, Check, Sparkles } from 'lucide-react-native';

import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from '../../components/ui/Text';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCAN_BOX_SIZE = SCREEN_WIDTH * 0.72;

interface BarcodeScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScanComplete: (scannedData: {
    barcode: string;
    name: string;
    ingredient: string;
    dosage: string;
    expiryDate: string;
  }) => void;
}

const PRESET_BARCODES = [
  {
    barcode: '6281001234567',
    name: 'أوجمنتين (Augmentin)',
    ingredient: 'أموكسيسيلين + كلافولانات',
    dosage: '1 g',
    expiryDate: '2027-04-30',
  },
  {
    barcode: '6281009876543',
    name: 'بانادول إكسترا (Panadol Extra)',
    ingredient: 'باراسيتامول + كافيين',
    dosage: '500 mg',
    expiryDate: '2028-01-10',
  },
  {
    barcode: '6281005554443',
    name: 'فيتامين د3 (Vit D3)',
    ingredient: 'كوليكالسيفيرول',
    dosage: '50,000 IU',
    expiryDate: '2027-09-15',
  },
];

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  visible,
  onClose,
  onScanComplete,
}) => {
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const [torchOn, setTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState('');

  // تحريك خط الليزر صعوداً وهبوطاً
  useEffect(() => {
    if (visible) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: SCAN_BOX_SIZE - 4,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [visible]);

  const handleSelectPreset = (item: typeof PRESET_BARCODES[0]) => {
    onScanComplete(item);
    onClose();
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return;
    onScanComplete({
      barcode: manualCode,
      name: 'دواء مسجل بالباركود #' + manualCode.slice(-4),
      ingredient: 'مادة مسجلة آلياً',
      dosage: '500 mg',
      expiryDate: '2027-12-31',
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        {/* شريط التحكم العلوي */}
        <View style={styles.topControls}>
          <TouchableOpacity onPress={onClose} style={styles.iconCircle}>
            <X size={22} color={Colors.textOnPrimary} strokeWidth={IconDefaults.strokeWidth} />
          </TouchableOpacity>
          <Text variant="headingSM" color={Colors.textOnPrimary}>
            وجّه الكاميرا نحو باركود الدواء
          </Text>
          <TouchableOpacity
            onPress={() => setTorchOn(!torchOn)}
            style={[styles.iconCircle, torchOn && styles.iconCircleActive]}
          >
            <Flashlight
              size={20}
              color={torchOn ? Colors.primary : Colors.textOnPrimary}
              strokeWidth={IconDefaults.strokeWidth}
            />
          </TouchableOpacity>
        </View>

        {/* صندوق إطار المسح الضوئي */}
        <View style={styles.scannerWrapper}>
          <View style={styles.scanBox}>
            {/* زوايا الإطار */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />

            {/* خط الليزر المتحرك */}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY: scanLineAnim }],
                },
              ]}
            />
          </View>
          <Text variant="bodySM" color="#E0E0E0" style={{ marginTop: Spacing.md }}>
            سيتم استخراج الاسم وتاريخ الانتهاء تلقائياً
          </Text>
        </View>

        {/* عينات سريعة لاختبار المسح الفوري */}
        <View style={styles.presetsArea}>
          <Text variant="caption" color="#BDBDBD" style={{ marginBottom: Spacing.xs }}>
            💡 محاكاة مسح دواء من الصيدلية:
          </Text>
          <View style={styles.presetButtonsRow}>
            {PRESET_BARCODES.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.presetChip}
                onPress={() => handleSelectPreset(item)}
              >
                <Sparkles size={12} color={Colors.secondary} strokeWidth={IconDefaults.strokeWidth} />
                <Text variant="caption" color={Colors.textOnPrimary}>
                  {item.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* إدخال يدوي للباركود إذا لم تعمل الكاميرا */}
        <View style={styles.manualEntryRow}>
          <TextInput
            placeholder="أو اكتب رقم الباركود يدوياً..."
            placeholderTextColor="#888"
            value={manualCode}
            onChangeText={setManualCode}
            style={styles.manualInput}
            keyboardType="numeric"
            textAlign="right"
          />
          <TouchableOpacity style={styles.manualSubmitBtn} onPress={handleManualSubmit}>
            <Check size={18} color={Colors.textOnPrimary} strokeWidth={IconDefaults.strokeWidth} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 20, 16, 0.94)',
    justifyContent: 'space-between',
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing['2xl'],
    alignItems: 'center',
  },
  topControls: {
    flexDirection: 'row-reverse',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: Colors.secondary,
  },
  scannerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Radius.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: 3,
    backgroundColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 6,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.secondary,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: Radius.sm,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: Radius.sm,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: Radius.sm,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: Radius.sm,
  },
  presetsArea: {
    width: '100%',
    alignItems: 'center',
  },
  presetButtonsRow: {
    flexDirection: 'row-reverse',
    gap: Spacing.sm,
  },
  presetChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  manualEntryRow: {
    flexDirection: 'row-reverse',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    height: 48,
    gap: Spacing.xs,
  },
  manualInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 13,
    paddingHorizontal: Spacing.sm,
  },
  manualSubmitBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
