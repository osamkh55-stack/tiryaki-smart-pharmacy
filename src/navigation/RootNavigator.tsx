/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Navigation: Root Navigator
 *  المتحكم الجذري في تدفق التطبيق
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator }          from '@react-navigation/native-stack';

import { RootStackParamList }    from './types';
import { TabNavigator }          from './TabNavigator';
import { Colors }                from '../constants/colors';
import { OnboardingScreen }      from '../features/onboarding/OnboardingScreen';
import { AddMedicineScreen }     from '../features/cabinet/AddMedicineScreen';
import { MedicineDetailScreen }  from '../features/cabinet/MedicineDetailScreen';
import { ShoppingListScreen }    from '../features/shopping/ShoppingListScreen';
import { IoTDashboardScreen }    from '../features/iot/IoTDashboardScreen';
import { ExportReportScreen }    from '../features/profile/ExportReportScreen';
import { SupportScreen }         from '../features/support/SupportScreen';
import { SubscriptionScreen }    from '../features/commerce/SubscriptionScreen';
import { PharmaciesScreen }      from '../features/commerce/PharmaciesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// ─── Wrapper ليمرّر onFinish بشكل صحيح ──────────────────────────────────────
function OnboardingWrapper() {
  const navigation = useNavigation<any>();
  return (
    <OnboardingScreen onFinish={() => navigation.replace('Main')} />
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.backgroundBase },
          animation: 'slide_from_left',
        }}
      >
        {/* شاشة الترحيب */}
        <Stack.Screen name="Onboarding" component={OnboardingWrapper} />

        {/* التطبيق الرئيسي */}
        <Stack.Screen name="Main" component={TabNavigator} />

        {/* تفاصيل وإضافة الأدوية */}
        <Stack.Screen
          name="AddMedicine"
          component={AddMedicineScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="MedicineDetail"
          component={MedicineDetailScreen}
          options={{ animation: 'slide_from_left' }}
        />

        {/* شاشات الخدمات الجديدة */}
        <Stack.Screen
          name="ShoppingList"
          component={ShoppingListScreen}
          options={{ animation: 'slide_from_left' }}
        />
        <Stack.Screen
          name="IoTDashboard"
          component={IoTDashboardScreen}
          options={{ animation: 'slide_from_left' }}
        />
        <Stack.Screen
          name="ExportReport"
          component={ExportReportScreen}
          options={{ animation: 'slide_from_left' }}
        />
        <Stack.Screen
          name="Support"
          component={SupportScreen}
          options={{ animation: 'slide_from_left' }}
        />
        <Stack.Screen
          name="Pharmacies"
          component={PharmaciesScreen}
          options={{ animation: 'slide_from_left' }}
        />
        <Stack.Screen
          name="Subscription"
          component={SubscriptionScreen}
          options={{ animation: 'slide_from_left' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
