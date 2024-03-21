import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.vercel.moegle',
  appName: 'Moegle',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
