import React from 'react';
import { useGlobal } from '../context/GlobalContext';

const Favorites = () => {
    const { watchlist, switchView } = useGlobal();

    return (
        <div style={{ padding: '20px', color: 'white', paddingTop: '80px', minHeight: '100vh' }}>
            <button 
                onClick={() => switchView('profile')} 
                style={{ marginBottom: '20px', background: 'transparent', color: '#a855f7', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
            >
                <i className="fa-solid fa-arrow-left"></i> Back to Profile
            </button>
            
            <h2>My Favorites</h2>
            
            {watchlist.length === 0 ? (
                <p style={{ color: '#aaa' }}>You haven't added any favorites yet.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', marginTop: '20px' }}>
                    {watchlist.map(item => (
                        <div key={item.id} style={{ backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '8px' }}>
                            <img 
                                src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : 'https://via.placeholder.com/200x300'} 
                                alt={item.title || item.name} 
                                style={{ width: '100%', borderRadius: '4px' }}
                            />
                            <p style={{ fontSize: '0.9rem', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.title || item.name}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;