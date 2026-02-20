import { useState } from 'react';
import { POSTER_URL, PLACEHOLDER_IMG, IMG_URL } from '../../api/tmdb';
import { useGlobal } from '../../context/GlobalContext';

const MovieCard = ({ item, isHistory = false }) => {
    const { setDetailItem, togglePin, removeItem } = useGlobal();
    const [showMenu, setShowMenu] = useState(false);

    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || 'N/A').split('-')[0];
    const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : 'NR';
    const image = isHistory && item.backdrop_path ? IMG_URL + item.backdrop_path : (item.poster_path ? POSTER_URL + item.poster_path : PLACEHOLDER_IMG);

    const handleMenu = (e) => { e.stopPropagation(); setShowMenu(!showMenu); };
    const handlePin = (e) => { e.stopPropagation(); togglePin(item); setShowMenu(false); };
    const handleRemove = (e) => { e.stopPropagation(); removeItem(item, isHistory ? 'history' : 'watchlist'); setShowMenu(false); };

    return (
        <div className={`${isHistory ? 'continue-card' : 'movie-card'} fade-in`} onClick={() => setDetailItem(item)}>
            <div className={isHistory ? "continue-image-wrapper" : "card-poster"}>
                {isHistory && <div className="continue-play-icon"><i className="fas fa-play"></i></div>}
                <div className="rating-badge"><i className="fas fa-star"></i> {rating}</div>
                {item.pinned && <div className="pinned-badge visible" style={{position:'absolute', top:5, left:5, color:'#e50914'}}><i className="fas fa-thumbtack"></i></div>}
                <img src={image} alt={title} loading="lazy" onError={(e) => e.target.src = PLACEHOLDER_IMG} />
                
                {/* 3-Dot Menu */}
                <div className="card-menu-btn" onClick={handleMenu} style={{top: 5, right: 5}}>
                    <i className="fas fa-ellipsis-v"></i>
                </div>
                {showMenu && (
                    <div className="card-context-menu show" style={{top: 35, right: 5}}>
                        {isHistory && <div className="ctx-item" onClick={handlePin}><i className="fas fa-thumbtack"></i> {item.pinned ? 'Unpin' : 'Pin'}</div>}
                        <div className="ctx-item delete" onClick={handleRemove}><i className="fas fa-trash"></i> Remove</div>
                    </div>
                )}
            </div>
            
            <div className={isHistory ? "continue-info" : "card-info"}>
                <div className={isHistory ? "continue-title" : "card-title"}>{title}</div>
                {!isHistory && (
                    <div className="card-meta">
                        <span>{year}</span><span className="dot-sep"></span><span>{item.media_type==='tv'?'Series':'Movie'}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
export default MovieCard;
