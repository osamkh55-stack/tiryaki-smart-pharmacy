/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Component: StatusBadge
 *  شارة الحالة الطبية (نجاح / تحذير / خطر)
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { CheckCircle2, AlertTriangle, ShieldAlert, Clock, Info } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Spacing, Radius } from '../../constants/spacing';
import { IconDefaults } from '../../constants/icons';
import { Text } from './Text';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'expiring';

interface StatusBadgeProps {
  type: StatusType;
  label: string;
  style?: ViewStyle;
}

const STATUS_CONFIG: Record<StatusType, {
  icon: React.ElementType;
  color: string;
  bg: string;
}> = {
  success:  { icon: CheckCircle2,  color: Colors.success,   bg: Colors.successLight  },
  warning:  { icon: AlertTriangle, color: Colors.warning,   bg: Colors.warningLight  },
  danger:   { icon: ShieldAlert,   color: Colors.danger,    bg: Colors.dangerLight   },
  expiring: { icon: Clock,         color: Colors.warning,   bg: Colors.warningLight  },
  info:     { icon: Info,          color: Colors.secondary, bg: Colors.secondaryLight },
};

/**
 * شارة حالة طبية موحّدة مع أيقونة ونص.
 * ⚠️ دائماً مصحوبة بنص واضح — لا تعتمد على اللون وحده.
 *
 * @example
 * <StatusBadge type="danger" label="تعارض دوائي" />
 * <StatusBadge type="expiring" label="تنتهي خلال 7 أيام" />
 * <StatusBadge type="success" label="المخزون كافٍ" />
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label, style }) => {
  const config = STATUS_CONFIG[type];
  const IconComponent = config.icon;

  return (
    <View style={[styles.container, { backgroundColor: config.bg }, style]}>
      <IconComponent
        size={14}
        color={config.color}
        strokeWidth={IconDefaults.strokeWidth}
      />
      <Text variant="labelSM" color={config.color} style={styles.label}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    lineHeight: 18,
  },
});
