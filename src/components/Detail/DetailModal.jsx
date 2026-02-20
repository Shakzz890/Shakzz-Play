import { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { fetchTMDB, IMG_URL, POSTER_URL } from '../../api/tmdb';

const servers = [
    { name: "Server 1", url: (type, id, s, e) => `https://vidsrc.cc/v2/embed/${type}/${id}${type==='tv'?`/${s}/${e}`:''}` },
    { name: "Server 2", url: (type, id, s, e) => `https://vidsrc.xyz/embed/${type}/${id}${type==='tv'?`/${s}/${e}`:''}` },
];

const DetailModal = () => {
    // 1. Single, clean declaration of context
    const { detailItem, setDetailItem, addToHistory, watchlist, toggleWatchlist } = useGlobal();
    
    // 2. State hooks
    const [fullDetails, setFullDetails] = useState(null);
    const [playMode, setPlayMode] = useState(false);
    const [season, setSeason] = useState(1);
    const [episode, setEpisode] = useState(1);
    
    // 3. Effect: Fetch Data & Save History when item opens
    useEffect(() => {
        if (detailItem) {
            const type = detailItem.media_type || (detailItem.first_air_date ? 'tv' : 'movie');
            
            // Fetch extra details (runtime, genres, seasons)
            fetchTMDB(`/${type}/${detailItem.id}`).then(setFullDetails);
            
            // Save to Firebase History
            addToHistory(detailItem);
        } else {
            // Reset state when closing
            setPlayMode(false);
            setFullDetails(null);
            setSeason(1);
            setEpisode(1);
        }
    }, [detailItem]);

    // 4. Early return if closed
    if (!detailItem || !fullDetails) return null;

    // 5. Render Helpers
    const type = fullDetails.first_air_date ? 'tv' : 'movie';
    const bg = fullDetails.backdrop_path ? IMG_URL + fullDetails.backdrop_path : null;
    
    // Check Watchlist status
    const isWatchlisted = watchlist.some(i => i.id === detailItem.id);

    return (
        <div id="detail-view" style={{ display: 'flex' }}>
            <div className="detail-backdrop-layer">
                {bg && <img id="detail-backdrop-img" src={bg} alt="" />}
                <div className="detail-overlay-gradient"></div>
            </div>

            <button className="close-detail-btn" onClick={() => setDetailItem(null)}>
                <i className="fa-solid fa-arrow-left"></i>
            </button>

            {!playMode ? (
                <div className="detail-content-wrapper">
                    <div className="detail-hero-layout">
                        <div className="detail-poster-card">
                            <img src={fullDetails.poster_path ? POSTER_URL + fullDetails.poster_path : ''} alt="" />
                        </div>
                        <div className="detail-info-box">
                            <h1 id="detail-title">{fullDetails.title || fullDetails.name}</h1>
                            <div className="detail-meta-row">
                                <span>{(fullDetails.release_date || fullDetails.first_air_date || '').split('-')[0]}</span>
                                <span className="rating-box"><i className="fas fa-star"></i> {fullDetails.vote_average?.toFixed(1)}</span>
                            </div>
                            <div className="detail-actions">
                                <button className="play-btn-primary" onClick={() => setPlayMode(true)}>
                                    <i className="fas fa-play"></i> Play
                                </button>
                                
                                {/* Toggle Watchlist Button */}
                                <button className="watchlist-btn" onClick={() => toggleWatchlist(detailItem)}>
                                    <i className={`fa-${isWatchlisted ? 'solid' : 'regular'} fa-heart`}></i>
                                </button>
                            </div>
                            <p id="detail-overview">{fullDetails.overview}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="player-overlay" style={{display:'flex'}}>
                   <div className="iframe-wrapper">
                       <iframe 
                           src={servers[0].url(type, detailItem.id, season, episode)} 
                           width="100%" height="100%" allowFullScreen frameBorder="0"
                       ></iframe>
                   </div>
                   {type === 'tv' && (
                       <div className="player-controls-bar stacked">
                           <select onChange={(e) => setSeason(e.target.value)} value={season} className="pill-dropdown">
                               {fullDetails.seasons?.filter(s => s.season_number > 0).map(s => (
                                   <option key={s.season_number} value={s.season_number}>Season {s.season_number}</option>
                               ))}
                           </select>
                           <input type="number" value={episode} onChange={(e) => setEpisode(e.target.value)} className="episode-search" placeholder="Ep..." />
                       </div>
                   )}
                   <button className="close-player-btn" style={{position:'absolute', top:20, right:20}} onClick={() => setPlayMode(false)}>
                       <i className="fa-solid fa-xmark"></i>
                   </button>
                </div>
            )}
        </div>
    );
};

export default DetailModal;
