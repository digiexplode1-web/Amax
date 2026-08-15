import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.amaxcraft.app',
  appName: 'AMAX CRAFT',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#120F0E',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#120F0E'
    }
  }
};

export default config;
