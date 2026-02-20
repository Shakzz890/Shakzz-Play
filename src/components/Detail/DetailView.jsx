// DetailView.jsx - Updated
import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { fetchData, IMG_URL, POSTER_URL, PLACEHOLDER_IMG, getDisplayTitle } from '../../api/tmdb';

const DetailView = () => {
    const { 
        detailItem, 
        isDetailOpen, 
        closeDetail, 
        setIsPlayerOpen, 
        watchlist, 
        toggleWatchlist, 
        addToHistory,
        openDetail 
    } = useGlobal();

    const [fullDetails, setFullDetails] = useState(null);
    const [similar, setSimilar] = useState([]);

    useEffect(() => {
        if (detailItem) {
            const type = detailItem.media_type === 'tv' || detailItem.first_air_date ? 'tv' : 'movie';
            fetchData(`/${type}/${detailItem.id}`).then(setFullDetails);
            fetchData(`/${type}/${detailItem.id}/recommendations`).then(res => {
                setSimilar(res.results || []);
            });
        }
    }, [detailItem]);

    if (!isDetailOpen || !detailItem) return null;

    const handleRecClick = (item) => {
        const type = item.media_type || (item.title ? 'movie' : 'tv');
        openDetail({ ...item, media_type: type });
        const view = document.querySelector('.detail-page');
        if(view) view.scrollTop = 0;
    };

    const isAdded = watchlist.some(i => i.id === detailItem.id);
    const typeLabel = detailItem.media_type === 'tv' || detailItem.first_air_date ? 'TV Series' : 'Movie';

    return (
        <div id="detail-view" className="page-view detail-page active">
            {/* BACKDROP IMAGE */}
            <div className="detail-backdrop-layer">
                <img 
                    id="detail-backdrop-img" 
                    src={detailItem.backdrop_path ? IMG_URL + detailItem.backdrop_path : POSTER_URL + detailItem.poster_path} 
                    onError={(e) => e.target.src = PLACEHOLDER_IMG}
                    alt="Backdrop"
                />
                <div className="detail-overlay-gradient"></div>
            </div>

            {/* CLOSE BUTTON */}
            <button className="close-detail-btn" onClick={closeDetail}>
                <i className="fa-solid fa-arrow-left"></i>
            </button>

            <div className="detail-content-wrapper">
                <div className="detail-hero-layout">
                    <div className="detail-poster-card">
                        <img 
                            id="detail-poster-img"
                            src={detailItem.poster_path ? POSTER_URL + detailItem.poster_path : PLACEHOLDER_IMG} 
                            onError={(e) => e.target.src = PLACEHOLDER_IMG}
                            alt="Poster"
                        />
                    </div>

                    <div className="detail-info-box">
                        <h1 id="detail-title">{getDisplayTitle(detailItem)}</h1>
                        
                        <div className="detail-meta-row">
                            <span>{(detailItem.release_date || detailItem.first_air_date || 'N/A').split('-')[0]}</span>
                            <span className="dot-sep"></span>
                            <span className="rating-box"><i className="fas fa-star"></i> {detailItem.vote_average?.toFixed(1)}</span>
                            <span className="dot-sep"></span>
                            <span>{typeLabel}</span>
                        </div>

                        <div className="genre-pills-row">
                            {fullDetails?.genres?.slice(0, 3).map(g => (
                                <span key={g.id} className="genre-pill">{g.name}</span>
                            ))}
                        </div>

                        <p id="detail-overview">{detailItem.overview}</p>

                        <div className="detail-actions">
                            <button className="play-btn-primary" onClick={() => {
                                setIsPlayerOpen(true);
                                addToHistory(detailItem);
                            }}>
                                <i className="fas fa-play"></i> Play
                            </button>
                            
                            <button className="watchlist-btn" onClick={() => toggleWatchlist(detailItem)}>
                                <i className={isAdded ? "fas fa-check" : "fas fa-plus"}></i> {isAdded ? "List" : "List"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="recommendations-section">
                    <h3>You May Also Like</h3>
                    <div className="recommendations-grid">
                        {similar.length > 0 ? similar.slice(0, 18).map(item => (
                            <div key={item.id} className="movie-card" onClick={() => handleRecClick(item)}>
                                <div className="card-poster">
                                    <div className="rating-badge"><i className="fas fa-star"></i> {item.vote_average?.toFixed(1)}</div>
                                    <img 
                                        src={item.poster_path ? POSTER_URL + item.poster_path : PLACEHOLDER_IMG} 
                                        onError={(e) => e.target.src = PLACEHOLDER_IMG}
                                        alt={item.title}
                                    />
                                </div>
                                <div className="card-info">
                                    <div className="card-title">{getDisplayTitle(item)}</div>
                                </div>
                            </div>
                        )) : (
                            <p style={{color:'#666', padding:'20px'}}>No recommendations found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailView;