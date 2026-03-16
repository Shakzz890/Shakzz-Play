// src/components/tv/TVNavigation.jsx
import React from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useInput } from '../../utils/InputManager'; // Keeping this just for the platform check

const TVNavigation = ({ items, activeIndex, onSelect, orientation = 'horizontal', containerFocusKey = 'tv-nav' }) => {
  // 🚀 Optional but recommended: We wrap the whole nav in a focusable container.
  // Setting focusable: false means the container itself won't highlight, 
  // but trackChildren: true helps the engine group these items together smartly!
  const { ref } = useFocusable({
    focusable: false,
    trackChildren: true,
    focusKey: containerFocusKey
  });

  return (
    <nav 
      ref={ref}
      className={`tv-navigation tv-navigation-${orientation}`}
      role="tablist"
    >
      {items.map((item, index) => (
        <TVNavItem
          key={item.id || index}
          item={item}
          isActive={index === activeIndex}
          onSelect={() => onSelect?.(item, index)}
          index={index}
        />
      ))}
    </nav>
  );
};

const TVNavItem = ({ item, isActive, onSelect, index }) => {
  const { platform } = useInput();
  
  // 🚀 THE MAGIC HOOK: Replaces all your manual keydown and focus tracking!
  const { ref, focused, setFocus } = useFocusable({
    onEnterPress: () => onSelect(),
    focusKey: item.id ? `nav-item-${item.id}` : `nav-item-${index}`
  });

  return (
    <div
      ref={ref}
      className={`tv-nav-item ${isActive ? 'active' : ''} ${focused ? 'tv-focused' : ''}`}
      onClick={() => {
        setFocus(); // Visually update focus if the user clicks with a mouse/touch
        onSelect();
      }}
      role="tab"
      aria-selected={isActive}
      data-index={index}
    >
      {item.icon && <span className="tv-nav-icon">{item.icon}</span>}
      <span className="tv-nav-label">{item.label}</span>
      
      {/* Only show shortcuts if focused AND on a TV */}
      {focused && platform?.isTV && item.shortcut && (
        <span className="tv-nav-shortcut">{item.shortcut}</span>
      )}
    </div>
  );
};

export default TVNavigation;