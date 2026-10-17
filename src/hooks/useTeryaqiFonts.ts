/**
 * ═══════════════════════════════════════════════════════
 *  تِرياقي — Hook: useFonts
 *  تحميل خطوط ثمانية وإدارة حالة Splash Screen
 * ═══════════════════════════════════════════════════════
 */

import { useEffect } from 'react';
import { useFonts as useExpoFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// منع إخفاء Splash Screen تلقائياً حتى يكتمل التحميل
SplashScreen.preventAutoHideAsync();

/**
 * Hook لتحميل جميع خطوط ثمانية المعتمدة.
 * يُستخدم في _layout.tsx أو App.tsx مرة واحدة على مستوى التطبيق.
 *
 * @returns {{ fontsLoaded: boolean, fontError: Error | null }}
 */
export function useTeryaqiFonts() {
  const [fontsLoaded, fontError] = useExpoFonts({
    // ─── Thmanyah Sans ─────────────────────────────────
    'ThmanyahSans-Light':   require('../../thmanyah typeface/thmanyahsans/otf/thmanyahsans-Light.otf'),
    'ThmanyahSans-Regular': require('../../thmanyah typeface/thmanyahsans/otf/thmanyahsans-Regular.otf'),
    'ThmanyahSans-Medium':  require('../../thmanyah typeface/thmanyahsans/otf/thmanyahsans-Medium.otf'),
    'ThmanyahSans-Bold':    require('../../thmanyah typeface/thmanyahsans/otf/thmanyahsans-Bold.otf'),
    'ThmanyahSans-Black':   require('../../thmanyah typeface/thmanyahsans/otf/thmanyahsans-Black.otf'),

    // ─── Thmanyah Serif Display ─────────────────────────
    'ThmanyahSerifDisplay-Light':   require('../../thmanyah typeface/thmanyahserifdisplay/otf/thmanyahserifdisplay-Light.otf'),
    'ThmanyahSerifDisplay-Regular': require('../../thmanyah typeface/thmanyahserifdisplay/otf/thmanyahserifdisplay-Regular.otf'),
    'ThmanyahSerifDisplay-Medium':  require('../../thmanyah typeface/thmanyahserifdisplay/otf/thmanyahserifdisplay-Medium.otf'),
    'ThmanyahSerifDisplay-Bold':    require('../../thmanyah typeface/thmanyahserifdisplay/otf/thmanyahserifdisplay-Bold.otf'),
    'ThmanyahSerifDisplay-Black':   require('../../thmanyah typeface/thmanyahserifdisplay/otf/thmanyahserifdisplay-Black.otf'),

    // ─── Thmanyah Serif Text ────────────────────────────
    'ThmanyahSerifText-Light':   require('../../thmanyah typeface/thmanyahseriftext/otf/thmanyahseriftext-Light.otf'),
    'ThmanyahSerifText-Regular': require('../../thmanyah typeface/thmanyahseriftext/otf/thmanyahseriftext-Regular.otf'),
    'ThmanyahSerifText-Medium':  require('../../thmanyah typeface/thmanyahseriftext/otf/thmanyahseriftext-Medium.otf'),
    'ThmanyahSerifText-Bold':    require('../../thmanyah typeface/thmanyahseriftext/otf/thmanyahseriftext-Bold.otf'),
    'ThmanyahSerifText-Black':   require('../../thmanyah typeface/thmanyahseriftext/otf/thmanyahseriftext-Black.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // إخفاء Splash Screen فور اكتمال تحميل الخطوط
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return { fontsLoaded, fontError };
}
