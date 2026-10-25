import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.priyanshh.jarvis',
  appName: 'JARVIS AI',
  webDir: 'dist',
  server: {
    url: 'http://127.0.0.1:3000',
    cleartext: true,
  }
};

export default config;
