import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.bioauthuser',
  appName: 'bio-auth',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
