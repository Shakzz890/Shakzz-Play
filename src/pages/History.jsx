import React from 'react';
import { useGlobal } from '../context/GlobalContext';

const History = () => {
    const { history, switchView, openDetail } = useGlobal();

    return (
        <div style={{ paddingTop: 'var(--navbar-offset)', paddingBottom: 'calc(var(--bottom-nav-height) + 20px)', minHeight: '100vh' }}>
            
            {/* Native Header */}
            <div style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="search-back-btn" onClick={() => switchView('profile')} style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <i className="fa-solid fa-arrow-left"></i>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>Watch History</h2>
            </div>

            {/* Grid Content */}
            <div style={{ padding: '20px' }}>
                {history.length === 0 ? (
                    <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>No watch history yet.</p>
                ) : (
                    <div className="explore-grid" style={{ padding: '0' }}>
                        {history.map(item => (
                            <div key={item.id} className="movie-card fade-in" onClick={() => openDetail(item)}>
                                <div className="card-poster">
                                    {item.badge_label && <div className="coming-badge">{item.badge_label}</div>}
                                    <img
                                        src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/200x300'}
                                        alt={item.title}
                                        loading="lazy"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/200x300'}
                                    />
                                </div>
                                <div className="card-info" style={{ marginTop: '8px' }}>
                                    <div className="card-title">{item.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;