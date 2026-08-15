import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard } from '@capacitor/keyboard';

export const isNativeAndroid = (): boolean => {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';
};

export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const initCapacitorUi = async (): Promise<void> => {
  if (!isNativePlatform()) return;

  try {
    // Configure Status Bar for Android
    if (Capacitor.isPluginAvailable('StatusBar')) {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#591423' });
      await StatusBar.setOverlaysWebView({ overlay: false });
    }
  } catch (err) {
    console.warn('StatusBar initialization warning:', err);
  }

  try {
    // Hide Native Splash Screen immediately so web splash takes over seamlessly
    if (Capacitor.isPluginAvailable('SplashScreen')) {
      await SplashScreen.hide().catch(() => {});
    }
  } catch (err) {
    console.warn('SplashScreen hide warning:', err);
  }

  try {
    // Configure Keyboard resize mode
    if (Capacitor.isPluginAvailable('Keyboard')) {
      Keyboard.setAccessoryBarVisible({ isVisible: false }).catch(() => {});
    }
  } catch (err) {
    console.warn('Keyboard configuration warning:', err);
  }
};
