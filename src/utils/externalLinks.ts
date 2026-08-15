import React from 'react';
import { Capacitor } from '@capacitor/core';

export const openExternalLink = (url: string, e?: React.MouseEvent): void => {
  if (e) {
    e.preventDefault();
  }

  if (!url) return;

  if (Capacitor.isNativePlatform()) {
    // On native Android, window.open with _system opens system browser / native app handler (WhatsApp, Phone dialer, Mail)
    window.open(url, '_system');
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
