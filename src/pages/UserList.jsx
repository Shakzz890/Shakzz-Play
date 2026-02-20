import React, { useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { POSTER_URL, PLACEHOLDER_IMG, getDisplayTitle } from '../api/tmdb';

const UserList = ({ type }) => {
    const { history, watchlist, user, isLoading, openDetail } = useGlobal();
    const navigate = useNavigate();

    // Redirect if not logged in
    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/');
        }
    }, [user, isLoading, navigate]);

    // Select data source based on prop
    const items = type === 'history' ? history : watchlist;
    const title = type === 'history' ? 'Watch History' : 'My Favorites';

    if (isLoading) return <div style={{paddingTop:100, textAlign:'center', color:'white'}}>Loading...</div>;

    return (
        <div id="category-view" style={{display:'flex', paddingTop:80, minHeight:'100vh', flexDirection:'column'}}>
            
            {/* HEADER */}
            <div className="category-header">
                <i className="fa-solid fa-arrow-left" onClick={() => navigate('/')} style={{cursor:'pointer', fontSize:'1.5rem', color:'#fff'}}></i>
                <h1 id="category-title" style={{marginLeft: 15}}>{title}</h1>
            </div>
            
            {/* CONTENT GRID */}
            <div className="category-content">
                <div className={`category-grid ${type === 'history' ? 'landscape-grid' : ''}`} id="category-grid">
                    {items && items.length > 0 ? (
                        items.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="movie-card fade-in" onClick={() => openDetail(item)}>
                                <div className="card-poster">
                                    <div className="badge-overlay">HD</div>
                                    <div className="rating-badge">
                                        <i className="fas fa-star"></i> {item.vote_average?.toFixed(1) || 'NR'}
                                    </div>
                                    <img 
                                        src={item.poster_path ? POSTER_URL + item.poster_path : PLACEHOLDER_IMG} 
                                        loading="lazy" 
                                        onError={(e) => e.target.src = PLACEHOLDER_IMG} 
                                        alt={getDisplayTitle(item)}
                                    />
                                    {/* Show progress bar for history items */}
                                    {type === 'history' && (
                                        <div className="continue-progress-bg" style={{position:'absolute', bottom:0, left:0, width:'100%', height:'3px', background:'rgba(255,255,255,0.2)'}}>
                                            <div className="continue-progress-fill" style={{width: '0%', height:'100%', background:'#e50914'}}></div>
                                        </div>
                                    )}
                                </div>
                                <div className="card-info">
                                    <div className="card-title">{getDisplayTitle(item)}</div>
                                    <div className="card-meta">
                                        <span>{(item.release_date || item.first_air_date || 'N/A').split('-')[0]}</span>
                                        <span className="dot-sep"></span>
                                        <span>{item.media_type === 'tv' ? 'Series' : 'Movie'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{gridColumn:'1/-1', textAlign:'center', color:'#888', marginTop:50, fontSize:'1.1rem'}}>
                            <p>This list is empty.</p>
                            <button 
                                onClick={() => navigate('/')}
                                style={{marginTop:15, padding:'10px 20px', background:'#e50914', color:'#fff', border:'none', borderRadius:'5px', cursor:'pointer'}}
                            >
                                Browse Content
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserList;
