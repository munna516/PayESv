"use client";

import { useState, useEffect } from 'react';

export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    const getDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (/mobile|android|iphone|ipad/.test(userAgent)) return "mobile";
      if (/tablet|ipad/.test(userAgent)) return "tablet";
      return "desktop";
    };

    const getOS = () => {
      const ua = navigator.userAgent;
      if (/windows/i.test(ua)) return "Windows";
      if (/macintosh/i.test(ua)) return "macOS";
      if (/linux/i.test(ua)) return "Linux";
      if (/android/i.test(ua)) return "Android";
      if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
      return "Unknown OS";
    };

    const getBrowser = () => {
      const ua = navigator.userAgent;
      if (/chrome/i.test(ua)) return "Chrome";
      if (/firefox/i.test(ua)) return "Firefox";
      if (/safari/i.test(ua)) return "Safari";
      if (/edge/i.test(ua)) return "Edge";
      return "Unknown Browser";
    };

    setDeviceInfo({
      deviceType: getDeviceType(),
      os: getOS(),
      browser: getBrowser(),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      jsEnabled: true,
      cookiesEnabled: navigator.cookieEnabled,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, []);

  return deviceInfo;
};