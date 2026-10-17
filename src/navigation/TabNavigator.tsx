/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Navigation: Tab Navigator
 *  شريط التنقل السفلي الرئيسي
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, View } from 'react-native';
import { Home, Boxes, BrainCircuit, User } from 'lucide-react-native';

import { TabParamList } from './types';
import { Colors }       from '../constants/colors';
import { IconDefaults, IconSize } from '../constants/icons';
import { Spacing, Radius, ComponentHeight } from '../constants/spacing';
import { FontFamily }   from '../constants/typography';

// ─── الشاشات الحقيقية المكتملة ───────────────────────────────────────────
import { HomeScreen }      from '../features/home/HomeScreen';
import { CabinetScreen }   from '../features/cabinet/CabinetScreen';
import { AssistantScreen } from '../features/assistant/AssistantScreen';
import { ProfileScreen }   from '../features/profile/ProfileScreen';
// ─────────────────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_LABELS: Record<keyof TabParamList, string> = {
  Home:      'الرئيسية',
  Cabinet:   'الخزانة',
  Assistant: 'مساعدي',
  Profile:   'ملفي',
};

export function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<keyof TabParamList, React.ElementType> = {
            Home:      Home,
            Cabinet:   Boxes,
            Assistant: BrainCircuit,
            Profile:   User,
          };
          const IconComponent = icons[route.name as keyof TabParamList];
          return (
            <IconComponent
              size={IconSize.nav}
              color={color}
              strokeWidth={focused ? 2.5 : IconDefaults.strokeWidth}
            />
          );
        },
        tabBarLabel: TAB_LABELS[route.name as keyof TabParamList],
        tabBarActiveTintColor:   Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      })}
    >
      <Tab.Screen name="Home"      component={HomeScreen}     />
      <Tab.Screen name="Cabinet"   component={CabinetScreen}  />
      <Tab.Screen name="Assistant" component={AssistantScreen} />
      <Tab.Screen name="Profile"   component={ProfileScreen}  />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.backgroundCard,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: ComponentHeight.navBar + (Platform.OS === 'ios' ? 20 : 8),
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: Spacing.sm,
    // ظل علوي ناعم
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 11,
    marginTop: 2,
  },
  tabItem: {
    paddingTop: Spacing.xs,
  },
});
