import { useState, useEffect } from 'react';
import { IMG_URL, POSTER_URL } from '../../api/tmdb';
import { useGlobal } from '../../context/GlobalContext';

const HeroSlider = ({ items }) => {
    const [index, setIndex] = useState(0);
    const { setDetailItem } = useGlobal();

    // Auto-slide every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(timer);
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
                            <button className="slider-btn btn-play-slide" onClick={() => setDetailItem(item)}>
                                <i className="fas fa-play"></i> Play
                            </button>
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