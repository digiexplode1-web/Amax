import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export const useAndroidBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const backButtonListener = CapacitorApp.addListener('backButton', () => {
      const currentPath = location.pathname;

      // If at root path '/' or '/home', minimize/exit app
      if (currentPath === '/' || currentPath === '/home') {
        CapacitorApp.minimizeApp();
      } else {
        // Safe navigation back to previous screen
        navigate(-1);
      }
    });

    return () => {
      backButtonListener.then((handler) => handler.remove()).catch(() => {});
    };
  }, [location.pathname, navigate]);
};
