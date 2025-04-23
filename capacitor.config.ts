
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cf516961303d481bb62161bab01570c3',
  appName: 'vibe-flow-android-music',
  webDir: 'dist',
  server: {
    url: 'https://cf516961-303d-481b-b621-61bab01570c3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
    }
  }
};

export default config;
