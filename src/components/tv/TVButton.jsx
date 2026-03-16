// src/components/tv/TVButton.jsx
import React from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useInput } from '../../utils/InputManager'; // Still needed just to check platform.isTV

const TVButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  className = '',
  style = {},
  disabled = false,
  icon,
  fullWidth = false,
  focusKey // Optional: Useful if you ever need to manually force focus to a specific button
}) => {
  const { platform } = useInput(); // We only need this to show the "OK" hint

  // 🚀 THE MAGIC HOOK: Replaces all your old refs, useEffects, and keydown listeners
  const { ref, focused, setFocus } = useFocusable({
    focusable: !disabled, // Automatically tells the D-pad to skip this button if disabled!
    onEnterPress: () => {
      if (!disabled && onClick) {
        onClick();
      }
    },
    focusKey: focusKey 
  });

  return (
    <button
      ref={ref}
      className={`tv-button tv-button-${variant} tv-button-${size} ${className} ${focused ? 'tv-focused' : ''} ${fullWidth ? 'tv-button-full' : ''}`}
      style={style}
      onClick={() => {
        if (!disabled) {
          setFocus(); // Good practice: clicking with a mouse also visually focuses it
          onClick?.();
        }
      }}
      disabled={disabled}
      type="button"
    >
      {icon && <span className="tv-button-icon">{icon}</span>}
      <span className="tv-button-text">{children}</span>
      
      {/* Show TV Hint only when focused AND on a TV */}
      {focused && platform?.isTV && <span className="tv-button-hint">OK</span>}
    </button>
  );
};

export default TVButton;