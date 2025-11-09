
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.476ad2f60f334d8a8bd739eb233f8ca2',
  appName: 'SuperNomad',
  webDir: 'dist',
  server: {
    url: 'https://476ad2f6-0f33-4d8a-8bd7-39eb233f8ca2.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      permissions: {
        backgroundLocation: true
      }
    }
  }
};

export default config;
