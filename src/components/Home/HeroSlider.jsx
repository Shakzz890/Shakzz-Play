import { useState, useEffect, useCallback } from 'react';
import { IMG_URL, POSTER_URL } from '../../api/tmdb';
import { useGlobal } from '../../context/GlobalContext';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

// ============================================================================
// 🚀 SMART TV SUB-COMPONENT
// ============================================================================
const FocusablePlayBtn = ({ onClick, onSlidePrev, onSlideNext, onFocusChange }) => {
    const { ref, focused, setFocus } = useFocusable({
        onEnterPress: onClick,
        focusKey: 'hero-play-btn',
        // 🚀 PRO TV TRICK: Hijack Left/Right D-pad to change slides instead of moving focus!
        onArrowLeft: () => {
            onSlidePrev();
            return false; // Tells the spatial engine: "I handled this, don't move the cursor!"
        },
        onArrowRight: () => {
            onSlideNext();
            return false; 
        }
    });

    // Notify the parent slider when the user focuses on it so we can pause auto-sliding
    useEffect(() => {
        onFocusChange(focused);
    }, [focused, onFocusChange]);

    return (
        <button 
            ref={ref}
            className={`slider-btn btn-play-slide ${focused ? 'tv-focused' : ''}`} 
            onClick={() => { setFocus(); onClick(); }}
        >
            <i className="fas fa-play"></i> Play
            {focused && (
                <span style={{ fontSize: '0.65rem', marginLeft: '10px', opacity: 0.8, fontWeight: 'normal', textTransform: 'none' }}>
                    (◀ ▶ to browse)
                </span>
            )}
        </button>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const HeroSlider = ({ items }) => {
    const [index, setIndex] = useState(0);
    const { setDetailItem } = useGlobal();
    const [isTVFocused, setIsTVFocused] = useState(false);

    // Auto-slide every 5 seconds (Pauses if TV remote is actively highlighting the Play button!)
    useEffect(() => {
        if (isTVFocused) return; 

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [items, isTVFocused]);

    const handlePrev = useCallback(() => {
        setIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    }, [items]);

    const handleNext = useCallback(() => {
        setIndex((prev) => (prev + 1) % items.length);
    }, [items]);

    if (!items || items.length === 0) return null;
    
    const item = items[index];
    const bgImage = item.backdrop_path ? IMG_URL + item.backdrop_path : POSTER_URL + item.poster_path;

    return (
        <div className="slider-viewport">
            <div className="slider-track">
                <div className="slide fade-in" style={{ backgroundImage: `url(${bgImage})` }}>
                    <div className="slide-content">
                        <span className="slide-badge">Trending Now</span>
                        <h1 className="slide-title">{item.title || item.name}</h1>
                        <div className="slide-meta">
                            <span>{(item.release_date || item.first_air_date || 'N/A').split('-')[0]}</span>
                            <span className="slide-rating"><i className="fas fa-star"></i> {item.vote_average?.toFixed(1)}</span>
                        </div>
                        <p className="slide-desc">{item.overview?.slice(0, 150)}...</p>
                        
                        <div className="slide-actions">
                            <FocusablePlayBtn 
                                onClick={() => setDetailItem(item)}
                                onSlidePrev={handlePrev}
                                onSlideNext={handleNext}
                                onFocusChange={setIsTVFocused}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="slider-dots">
                {items.map((_, idx) => (
                    <div key={idx} className={`dot ${idx === index ? 'active' : ''}`} onClick={() => setIndex(idx)}></div>
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;