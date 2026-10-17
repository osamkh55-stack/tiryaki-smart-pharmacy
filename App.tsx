/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — App Entry Point
 *  نقطة دخول التطبيق الرئيسية
 * ═══════════════════════════════════════════════════════
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { useTeryaqiFonts } from './src/hooks/useTeryaqiFonts';
import { RootNavigator }   from './src/navigation/RootNavigator';
import { Colors }          from './src/constants/colors';

export default function App() {
  const { fontsLoaded, fontError } = useTeryaqiFonts();

  // لا نعرض شيئاً حتى تكتمل الخطوط (Splash Screen مفعّل في الـ hook)
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <RootNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundBase,
  },
});
