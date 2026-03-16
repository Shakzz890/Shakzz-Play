// src/components/tv/TVPlayerControls.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useInput } from '../../utils/InputManager';
import TVButton from './TVButton';

const TVPlayerControls = ({ 
  isPlaying, 
  onPlayPause, 
  onSeek, 
  onSkipForward, 
  onSkipBackward,
  progress = 0,
  duration = 0,
  title,
  subtitle
}) => {
  const [showControls, setShowControls] = useState(true);
  const hideTimeout = useRef(null);
  const { platform } = useInput();

  useEffect(() => {
    const handleMediaKey = (e) => {
      switch(e.type) {
        case 'media-play-pause':
          onPlayPause?.();
          break;
        case 'media-forward':
          onSkipForward?.();
          break;
        case 'media-rewind':
          onSkipBackward?.();
          break;
      }
      showControlsTemporarily();
    };

    window.addEventListener('media-play-pause', handleMediaKey);
    window.addEventListener('media-forward', handleMediaKey);
    window.addEventListener('media-rewind', handleMediaKey);

    return () => {
      window.removeEventListener('media-play-pause', handleMediaKey);
      window.removeEventListener('media-forward', handleMediaKey);
      window.removeEventListener('media-rewind', handleMediaKey);
    };
  }, [onPlayPause, onSkipForward, onSkipBackward]);

  const showControlsTemporarily = () => {
    setShowControls(true);
    clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      if (!platform.isTV) setShowControls(false);
    }, 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showControls && !platform.isTV) return null;

  return (
    <div className={`tv-player-controls ${showControls ? 'visible' : 'hidden'}`}>
      <div className="tv-player-info">
        {title && <h2 className="tv-player-title">{title}</h2>}
        {subtitle && <p className="tv-player-subtitle">{subtitle}</p>}
      </div>
      
      <div className="tv-player-progress">
        <span className="tv-player-time">{formatTime(progress)}</span>
        <div className="tv-player-progress-bar">
          <div 
            className="tv-player-progress-fill"
            style={{ width: `${(progress / duration) * 100}%` }}
          />
        </div>
        <span className="tv-player-time">{formatTime(duration)}</span>
      </div>

      <div className="tv-player-buttons">
        <TVButton 
          onClick={onSkipBackward}
          icon="⏮"
          variant="ghost"
          size="large"
        />
        <TVButton 
          onClick={onPlayPause}
          icon={isPlaying ? '⏸' : '▶'}
          variant="primary"
          size="large"
        />
        <TVButton 
          onClick={onSkipForward}
          icon="⏭"
          variant="ghost"
          size="large"
        />
      </div>

      {platform.isTV && (
        <div className="tv-player-hints">
          <span>OK: Play/Pause</span>
          <span>◀▶: Seek</span>
          <span>Back: Exit</span>
        </div>
      )}
    </div>
  );
};

export default TVPlayerControls;