// src/components/tv/TVCard.jsx
import React from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

const TVCard = ({ 
  children, 
  onClick, 
  onSelect, 
  className = '', 
  style = {},
  focusKey,
  poster,
  title,
  subtitle,
  badge,
  aspectRatio = '16/9'
}) => {
  
  // 🚀 THE MAGIC HOOK: Handles 2D grid movement, Enter presses, and focus state!
  const { ref, focused, setFocus } = useFocusable({
    focusKey: focusKey,
    onEnterPress: () => {
      // Trigger either onSelect or onClick when the user presses 'OK/Enter' on the TV remote
      if (onSelect) onSelect();
      else if (onClick) onClick();
    }
  });

  const handleClick = () => {
    setFocus(); // Good practice: Ensure mouse clicks also update the spatial focus engine
    if (onClick) onClick();
    else if (onSelect) onSelect();
  };

  return (
    <div 
      ref={ref}
      className={`tv-card ${className} ${focused ? 'tv-focused' : ''}`}
      style={{
        '--aspect-ratio': aspectRatio,
        ...style
      }}
      onClick={handleClick}
      role="button"
      aria-label={title || 'TV Card'}
    >
      <div className="tv-card-poster">
        {poster && <img src={poster} alt={title || 'Poster'} loading="lazy" />}
        {badge && <span className="tv-card-badge">{badge}</span>}
        
        {/* Only show the play indicator when the card is actively focused via D-pad */}
        {focused && <div className="tv-card-focus-indicator">▶</div>}
      </div>
      
      {(title || subtitle) && (
        <div className="tv-card-info">
          {title && <h3 className="tv-card-title">{title}</h3>}
          {subtitle && <p className="tv-card-subtitle">{subtitle}</p>}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default TVCard;