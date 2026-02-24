import { useEffect, useState, useCallback } from 'react';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

// ⚠️ KEEP YOUR URL HERE
const VERSION_JSON_URL = 'https://raw.githubusercontent.com/Shakzz890/Shakzz_Play/refs/heads/main/version.json';

export const useVersionCheck = () => {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // Helper: Check if version A is newer than version B
  const isVersionNewer = (latest, current) => {
    const l = latest.split('.').map(Number);
    const c = current.split('.').map(Number);
    for (let i = 0; i < Math.max(l.length, c.length); i++) {
      if ((l[i] || 0) > (c[i] || 0)) return true;
      if ((l[i] || 0) < (c[i] || 0)) return false;
    }
    return false;
  };

  const checkVersion = useCallback(async () => {
    // Only check on native devices (Android/iOS)
    if (!Capacitor.isNativePlatform()) return;

    try {
      // 1. Get current installed app version
      const appInfo = await App.getInfo();
      const currentVersion = appInfo.version;

      // 2. Fetch the latest info from GitHub
      // We add ?t=... to prevent the phone from caching the old JSON file
      const response = await fetch(`${VERSION_JSON_URL}?t=${new Date().getTime()}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // 3. Compare versions
      if (isVersionNewer(data.version, currentVersion)) {
        setUpdateInfo({
          currentVersion: currentVersion,
          latestVersion: data.version,
          updateRequired: data.forceUpdate || false,
          downloadUrl: data.downloadUrl,
          releaseNotes: data.releaseNotes
        });
        setShowUpdateDialog(true);
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  }, []);

  // Action: Open the browser to download the APK
  const performUpdate = async () => {
    if (updateInfo?.downloadUrl) {
      await Browser.open({ url: updateInfo.downloadUrl });
    }
  };

  const dismissUpdate = () => {
    setShowUpdateDialog(false);
  };

  useEffect(() => {
    checkVersion();
    const listener = App.addListener('resume', checkVersion);
    return () => {
      listener.then(h => h.remove());
    };
  }, [checkVersion]);

  return {
    updateInfo,
    showUpdateDialog,
    dismissUpdate,
    performUpdate,
  };
};