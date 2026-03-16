// src/utils/InputManager.jsx
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

const InputContext = createContext(null);

// Platform detection
const detectPlatform = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Android TV detection - enhanced
  const isAndroidTV = (
    userAgent.includes('android') && 
    (userAgent.includes('tv') || 
     userAgent.includes('smb') || 
     userAgent.includes('googletv') ||
     userAgent.includes('smarttv') ||
     userAgent.includes('hbbtv') ||
     userAgent.includes('adt-') || // Android TV devices
     userAgent.includes('androidtv') ||
     userAgent.includes('nvidia shield') ||
     userAgent.includes('chromecast') ||
     (window.screen && window.screen.width > 1000 && userAgent.includes('android')))
  );
  
  // Smart TV detection (Samsung, LG, etc)
  const isSmartTV = (
    userAgent.includes('smart-tv') ||
    userAgent.includes('webos') ||
    userAgent.includes('tizen') ||
    userAgent.includes('netcast') ||
    userAgent.includes('smarttv') ||
    userAgent.includes('viera') || // Panasonic
    userAgent.includes('sonydtv') // Sony
  );
  
  // Desktop detection
  const isDesktop = (
    !isAndroidTV && 
    !isSmartTV && 
    !userAgent.includes('android') && 
    !userAgent.includes('iphone') && 
    !userAgent.includes('ipad') && 
    !userAgent.includes('mobile')
  );
  
  // Touch device detection
  const isTouch = (
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0 ||
    userAgent.includes('android') ||
    userAgent.includes('iphone') ||
    userAgent.includes('ipad')
  );
  
  return {
    isAndroidTV,
    isSmartTV,
    isDesktop,
    isTouch,
    isTV: isAndroidTV || isSmartTV,
    platform: isAndroidTV ? 'android-tv' : isSmartTV ? 'smart-tv' : isDesktop ? 'desktop' : 'mobile'
  };
};

export const InputProvider = ({ children }) => {
  const [platform, setPlatform] = useState(() => detectPlatform());
  const [focusedElement, setFocusedElement] = useState(null);
  const [lastInputType, setLastInputType] = useState('mouse');
  const focusHistory = useRef([]);
  const containerRef = useRef(null);
  const isNavigating = useRef(false);

  // Update platform on mount and resize
  useEffect(() => {
    const handleResize = () => {
      setPlatform(detectPlatform());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced focus management
  const setFocus = useCallback((element) => {
    if (!element || isNavigating.current) return;
    
    isNavigating.current = true;
    
    // Remove previous focus styles
    document.querySelectorAll('.focus-visible, .tv-focused').forEach(el => {
      el.classList.remove('focus-visible', 'tv-focused');
    });
    
    // Add focus to new element
    element.classList.add('focus-visible', 'tv-focused');
    element.focus();
    setFocusedElement(element);
    
    // Track focus history
    focusHistory.current.push(element);
    if (focusHistory.current.length > 20) {
      focusHistory.current.shift();
    }
    
    setTimeout(() => {
      isNavigating.current = false;
    }, 50);
  }, []);

  const goBack = useCallback(() => {
    if (focusHistory.current.length > 1) {
      focusHistory.current.pop();
      const previous = focusHistory.current[focusHistory.current.length - 1];
      if (previous && previous.isConnected) {
        setFocus(previous);
        return true;
      }
    }
    return false;
  }, [setFocus]);

  // Enhanced directional navigation with better algorithm
  const handleDirectionalInput = useCallback((direction) => {
    if (!containerRef.current || isNavigating.current) return;
    
    const currentFocus = document.activeElement;
    const focusables = Array.from(containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), .focusable, [data-focusable="true"]'
    )).filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' &&
             !el.disabled;
    });

    if (focusables.length === 0) return;

    // If no current focus, focus first element
    if (!currentFocus || !focusables.includes(currentFocus)) {
      setFocus(focusables[0]);
      return;
    }

    const currentRect = currentFocus.getBoundingClientRect();
    const currentCenter = {
      x: currentRect.left + currentRect.width / 2,
      y: currentRect.top + currentRect.height / 2
    };

    // Find best candidate in direction
    let bestCandidate = null;
    let bestScore = Infinity;

    focusables.forEach(el => {
      if (el === currentFocus) return;
      
      const rect = el.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };

      let inDirection = false;
      let primaryDistance = 0;
      let secondaryDistance = 0;

      switch(direction) {
        case 'up':
          inDirection = center.y < currentCenter.y;
          primaryDistance = currentCenter.y - center.y;
          secondaryDistance = Math.abs(center.x - currentCenter.x);
          break;
        case 'down':
          inDirection = center.y > currentCenter.y;
          primaryDistance = center.y - currentCenter.y;
          secondaryDistance = Math.abs(center.x - currentCenter.x);
          break;
        case 'left':
          inDirection = center.x < currentCenter.x;
          primaryDistance = currentCenter.x - center.x;
          secondaryDistance = Math.abs(center.y - currentCenter.y);
          break;
        case 'right':
          inDirection = center.x > currentCenter.x;
          primaryDistance = center.x - currentCenter.x;
          secondaryDistance = Math.abs(center.y - currentCenter.y);
          break;
      }

      if (inDirection) {
        // Weight primary distance more heavily than secondary
        const score = primaryDistance + (secondaryDistance * 0.5);
        if (score < bestScore) {
          bestScore = score;
          bestCandidate = el;
        }
      }
    });

    // If no candidate found, wrap around or stay
    if (!bestCandidate && focusables.length > 1) {
      // Find furthest element in opposite direction (wrap around)
      let furthestScore = -1;
      focusables.forEach(el => {
        if (el === currentFocus) return;
        const rect = el.getBoundingClientRect();
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
        
        let score = 0;
        switch(direction) {
          case 'up': score = center.y; break;
          case 'down': score = -center.y; break;
          case 'left': score = center.x; break;
          case 'right': score = -center.x; break;
        }
        
        if (score > furthestScore) {
          furthestScore = score;
          bestCandidate = el;
        }
      });
    }

    if (bestCandidate) {
      setFocus(bestCandidate);
      bestCandidate.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center', 
        inline: 'center',
        nearest: true 
      });
    }
  }, [setFocus]);

  // Global key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detect input type
      if (e.key.startsWith('Arrow') || ['Enter', 'Backspace', 'Escape'].includes(e.key)) {
        setLastInputType('dpad');
      } else {
        setLastInputType('keyboard');
      }

      // Handle DPad/Keyboard navigation
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (platform.isTV || platform.isDesktop) {
            e.preventDefault();
            handleDirectionalInput('up');
          }
          break;
          
        case 'ArrowDown':
        case 's':
        case 'S':
          if (platform.isTV || platform.isDesktop) {
            e.preventDefault();
            handleDirectionalInput('down');
          }
          break;
          
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (platform.isTV || platform.isDesktop) {
            e.preventDefault();
            handleDirectionalInput('left');
          }
          break;
          
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (platform.isTV || platform.isDesktop) {
            e.preventDefault();
            handleDirectionalInput('right');
          }
          break;
          
        case 'Enter':
        case ' ':
          if ((platform.isTV || platform.isDesktop) && focusedElement) {
            e.preventDefault();
            focusedElement.click();
            focusedElement.dispatchEvent(new Event('tv-select', { bubbles: true }));
          }
          break;
          
        case 'Backspace':
        case 'Escape':
          if (platform.isTV) {
            e.preventDefault();
            const wentBack = goBack();
            if (!wentBack) {
              window.dispatchEvent(new CustomEvent('tv-back', { detail: { source: 'backspace' } }));
            }
          }
          break;
          
        // Media keys support
        case 'MediaPlayPause':
        case 'MediaPlay':
        case 'MediaPause':
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('media-play-pause'));
          break;
          
        case 'MediaFastForward':
        case 'MediaTrackNext':
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('media-forward'));
          break;
          
        case 'MediaRewind':
        case 'MediaTrackPrevious':
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('media-rewind'));
          break;
          
        case 'MediaStop':
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('media-stop'));
          break;
          
        case 'VolumeUp':
        case 'VolumeDown':
        case 'VolumeMute':
          // Let system handle volume, but track it
          setLastInputType('dpad');
          break;
      }
    };

    // Touch detection
    const handleTouchStart = () => {
      setLastInputType('touch');
    };

    // Mouse detection
    const handleMouseMove = () => {
      setLastInputType('mouse');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mousemove', handleMouseMove);

    // Initial focus for TV
    if (platform.isTV && containerRef.current) {
      setTimeout(() => {
        const firstFocusable = containerRef.current.querySelector(
          'button, .focusable, [data-focusable="true"]'
        );
        if (firstFocusable) setFocus(firstFocusable);
      }, 100);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [platform, handleDirectionalInput, focusedElement, setFocus, goBack]);

  const value = {
    platform,
    focusedElement,
    lastInputType,
    setFocus,
    goBack,
    containerRef,
    isTV: platform.isTV
  };

  return (
    <InputContext.Provider value={value}>
      <div 
        ref={containerRef} 
        className={`input-container platform-${platform.platform} ${platform.isTV ? 'tv-mode' : ''}`}
        style={{ outline: 'none', width: '100%', height: '100%' }}
        tabIndex="-1"
      >
        {children}
      </div>
    </InputContext.Provider>
  );
};

export const useInput = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('useInput must be used within InputProvider');
  }
  return context;
};

// Hook for focusable elements
export const useFocusable = (options = {}) => {
  const { setFocus, platform, focusedElement } = useInput();
  const ref = useRef(null);
  const { onFocus, onBlur, autoFocus = false } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (platform.isTV || platform.isDesktop) {
      element.classList.add('focusable');
      element.setAttribute('tabindex', '0');
      element.setAttribute('data-focusable', 'true');
      
      if (autoFocus) {
        setTimeout(() => setFocus(element), 100);
      }
    }

    return () => {
      element?.classList.remove('focusable', 'tv-focused', 'focus-visible');
    };
  }, [platform, autoFocus, setFocus]);

  const handleFocus = useCallback(() => {
    if (ref.current) {
      setFocus(ref.current);
      onFocus?.();
    }
  }, [setFocus, onFocus]);

  const isFocused = focusedElement === ref.current;

  return { 
    ref, 
    handleFocus, 
    isFocused,
    focused: isFocused 
  };
};

// Legacy FocusWrapper for compatibility
export const FocusWrapper = ({ children, onClick, className = '', style = {}, focusKey, autoFocus = false }) => {
  const { ref, focused } = useFocusable({ autoFocus });
  const { platform } = useInput();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={ref}
      className={`${className} ${focused ? 'tv-focused' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      style={style}
      data-focus-key={focusKey}
    >
      {children}
    </div>
  );
};

export default InputProvider;