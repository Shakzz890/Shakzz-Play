import React from 'react';
import { useGlobal } from '../context/GlobalContext';
import { POSTER_URL, PLACEHOLDER_IMG, getDisplayTitle } from '../api/tmdb';

const Top10Philippines = ({ trendingMovies }) => {
    const { openDetail } = useGlobal();
    
    // Ensure we only ever show a maximum of 10 items
    const top10 = trendingMovies?.slice(0, 10) || [];

    if (top10.length === 0) return null;

    return (
        <div className="row top-10-section">
            <h2>
                <span className="section-indicator" style={{ background: 'var(--accent-color)' }}></span>
                Top 10 in the Philippines Today
            </h2>
            
            <div className="top-10-list">
                {top10.map((movie, index) => (
                    <div 
                        className="top-10-card focusable-element fade-in" 
                        key={movie.id || index}
                        onClick={() => openDetail(movie)}
                        tabIndex="0"
                    >
                        {/* The giant overlapping number */}
                        <div className="top-10-number">{index + 1}</div>
                        
                        {/* The Poster */}
                        <div className="card-poster">
                            <div className="badge-overlay">HD</div>
                            <img 
                                src={movie.poster_path ? POSTER_URL + movie.poster_path : PLACEHOLDER_IMG} 
                                alt={getDisplayTitle(movie)} 
                                loading="lazy"
                                onError={(e) => e.target.src = PLACEHOLDER_IMG}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Top10Philippines;