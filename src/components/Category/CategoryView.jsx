import React, { useState, useEffect, useRef } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { POSTER_URL, IMG_URL, PLACEHOLDER_IMG, getDisplayTitle, fetchData } from '../../api/tmdb';
import BackToTop from '../Layout/BackToTop'; 

const CategoryView = () => {
    const { categoryModal, setCategoryModal, openDetail, history, watchlist } = useGlobal();
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const scrollContainerRef = useRef(null);
    const isUserList = categoryModal.title === 'Watch History' || categoryModal.title === 'My Favorites';

    // --- RESET ON OPEN ---
    useEffect(() => {
        if (!categoryModal.isOpen) return;

        setResults([]);
        setPage(1);
        setHasMore(true);

        if (isUserList) {
            if (categoryModal.title === 'Watch History') {
                setResults(history || []);
            } else {
                setResults(watchlist || []);
            }
            setLoading(false);
            setHasMore(false); // No infinite scroll for local history
        } else {
            loadApiData(1);
        }
    }, [categoryModal.isOpen, categoryModal.endpoint, history, watchlist]);

    // --- API FETCH ---
    const loadApiData = async (pageNum) => {
        if (loading) return;
        setLoading(true);
        try {
            const data = await fetchData(categoryModal.endpoint, pageNum);
            
            if (!data.results || data.results.length === 0) {
                setHasMore(false);
            } else {
                setResults(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
            }
        } catch (e) { 
            console.error(e); 
            setHasMore(false);
        } finally { 
            setLoading(false); 
        }
    };

    // --- SCROLL HANDLER ---
    const handleScroll = (e) => {
        if (isUserList) return; // Don't scroll for history/favorites
        
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        
        // Trigger load when within 400px of bottom
        if (scrollHeight - scrollTop <= clientHeight + 400 && hasMore && !loading) {
            const next = page + 1;
            setPage(next);
            loadApiData(next);
        }
    };

    if (!categoryModal.isOpen) return null;

    const isHistory = categoryModal.title === 'Watch History';

    return (
        <div id="category-view" className="page-view category-page active">
            <div className="category-header">
                <i 
                    className="fa-solid fa-arrow-left" 
                    onClick={() => setCategoryModal({ ...categoryModal, isOpen: false })}
                ></i>
                <h1 id="category-title">{categoryModal.title}</h1>
            </div>
            
            <div 
                className="category-content" 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                style={{ overflowY: 'auto' }} // Ensure it scrolls
            >
                <div className={`category-grid ${isHistory ? 'landscape-grid' : ''}`} id="category-grid">
                    {results.map((item, index) => {
                        if(!item) return null;
                        const title = getDisplayTitle(item);
                        const year = (item.release_date || item.first_air_date || 'N/A').split('-')[0];
                        const typeLabel = item.media_type === 'tv' || item.first_air_date ? 'Series' : 'Movie';
                        const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : 'NR';
                        const image = isHistory ? (item.backdrop_path ? IMG_URL + item.backdrop_path : POSTER_URL + item.poster_path) : (POSTER_URL + item.poster_path);

                        return (
                            <div key={`${item.id}-${index}`} className={isHistory ? "history-card fade-in" : "movie-card fade-in"} onClick={() => openDetail(item)}>
                                {isHistory ? (
                                    <>
                                        <div className="history-image-wrapper">
                                            <img src={image} onError={(e)=>e.target.src=PLACEHOLDER_IMG} loading="lazy" alt={title} />
                                            <div className="history-play-icon"><i className="fas fa-play"></i></div>
                                            <div className="history-progress-bar"><div className="history-progress-fill" style={{width: `${item.progress || 45}%`}}></div></div>
                                        </div>
                                        <div className="card-info">
                                            <div className="card-title" style={{fontSize:'0.95rem'}}>{title}</div>
                                            <div className="card-meta" style={{fontSize:'0.8rem', color:'#aaa'}}>{item.badge_label || 'Watched'}</div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="card-poster">
                                            <div className="rating-badge"><i className="fas fa-star"></i> {rating}</div>
                                            <img src={image} onError={(e)=>e.target.src=PLACEHOLDER_IMG} loading="lazy" alt={title} />
                                        </div>
                                        <div className="card-info">
                                            <div className="card-title">{title}</div>
                                            <div className="card-meta">
                                                <span>{year}</span><span className="dot-sep"></span><span>{typeLabel}</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                    
                    {results.length === 0 && !loading && (
                        <div style={{color:'#888', width:'100%', textAlign:'center', marginTop:'50px', gridColumn: '1/-1'}}>List is empty.</div>
                    )}
                    {loading && (
                        <div className="spinner" style={{margin:'20px auto', gridColumn: '1/-1'}}></div>
                    )}
                </div>
            </div>

            <BackToTop containerRef={scrollContainerRef} />
        </div>
    );
};

export default CategoryView;