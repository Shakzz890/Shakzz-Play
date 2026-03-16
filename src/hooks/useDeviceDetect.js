import { useState, useEffect } from 'react';

export const useDeviceDetect = () => {
    const [deviceInfo, setDeviceInfo] = useState({
        isTV: false,
        isMobile: false,
        isDesktop: true
    });

    useEffect(() => {
        const ua = navigator.userAgent.toLowerCase();
        
        // 1. Check for Smart TVs, Android TV, Fire TV, WebOS, Tizen, Roku, etc.
        const isTV = /(tv|smarttv|tizen|webos|bravia|roku|appletv|firetv|android tv|googletv|mibox|shield)/i.test(ua);
        
        // 2. Check for Mobile / Tablet (Ensure it's NOT a TV first)
        const isMobile = !isTV && /(android|webos|iphone|ipad|ipod|blackberry|windows phone)/i.test(ua);
        
        // 3. Fallback to Desktop
        const isDesktop = !isTV && !isMobile;

        setDeviceInfo({ isTV, isMobile, isDesktop });

        // Add the class to the body so your CSS knows what to do!
        if (isTV) {
            document.body.classList.add('tv-mode');
        } else {
            document.body.classList.remove('tv-mode');
        }
    }, []);

    return deviceInfo;
};