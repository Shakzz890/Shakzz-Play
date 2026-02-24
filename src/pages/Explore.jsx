    import React, { useState, useEffect, useRef } from 'react';
    import { useGlobal } from '../context/GlobalContext';
    import { POSTER_URL, PLACEHOLDER_IMG, getDisplayTitle } from '../api/tmdb';

    const API_KEY = '4eea503176528574efd91847b7a302cc';
    const BASE_URL = 'https://api.themoviedb.org/3';

    const Explore = () => {
        const { openDetail } = useGlobal();
        
        // State
        const [results, setResults] = useState([]);
        const [filters, setFilters] = useState({ type: 'All', region: 'All Regions', sort: 'Ongoing' });
        const [page, setPage] = useState(1);
        const [isLoading, setIsLoading] = useState(false);
        const [hasMore, setHasMore] = useState(true);

        // Options
        const typeOptions = ['All', 'Series', 'Movie', 'Tv Show', 'Anime'];
        const regionOptions = ['All Regions', 'South Korea', 'China', 'US', 'Japan', 'Philippines'];
        const sortOptions = ['Latest', 'Ongoing', 'Popular', 'Completed'];

        // --- 1. RESET & INITIAL LOAD ---
        useEffect(() => {
            setResults([]);
            setPage(1);
            setHasMore(true);
            loadResults(1, filters);
        }, [filters.type, filters.region, filters.sort]);

        // --- 2. API FETCH LOGIC ---
        const loadResults = async (pageNum, currentFilters) => {
            if (isLoading) return;
            setIsLoading(true);

            try {
                let endpoint = '/discover/tv';
                let type = currentFilters.type.toLowerCase();
                let params = `&page=${pageNum}&sort_by=popularity.desc`;

                // Adjust endpoint based on type
                if (type === 'movie') endpoint = '/discover/movie';
                
                // Anime specific logic
                if (type === 'anime') {
                    endpoint = '/discover/tv';
                    params += `&with_genres=16`; 
                }

                // Region/Language Map
                const regionMap = { 
                    'South Korea': 'ko', 'China': 'zh', 'Japan': 'ja', 
                    'Philippines': 'tl', 'US': 'en' 
                };

                if (currentFilters.region !== 'All Regions' && regionMap[currentFilters.region]) {
                    params += `&with_original_language=${regionMap[currentFilters.region]}`;
                } else if (type === 'anime') {
                    params += `&with_original_language=ja`;
                }

                // Sort Logic
                if (currentFilters.sort === 'Latest') {
                    const dateKey = type === 'movie' ? 'primary_release_date' : 'first_air_date';
                    const today = new Date().toISOString().split('T')[0];
                    params += `&sort_by=${dateKey}.desc&${dateKey}.lte=${today}`;
                }

                const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}${params}`;
                const res = await fetch(url);
                const data = await res.json();

                if (data.results && data.results.length > 0) {
                    setResults(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
                    setHasMore(pageNum < data.total_pages);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Explore Fetch Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // --- 3. SCROLL HANDLER (Robust Method) ---
        // This logic is identical to your working SearchModal
        const handleScroll = (e) => {
            const { scrollTop, clientHeight, scrollHeight } = e.target;
            
            // Trigger load when scrolled within 300px of the bottom
            if (scrollHeight - scrollTop <= clientHeight + 300 && hasMore && !isLoading) {
                const next = page + 1;
                setPage(next);
                loadResults(next, filters);
            }
        };

        // --- 4. FILTER HANDLER ---
        const handleFilter = (key, value) => {
            setFilters(prev => ({ ...prev, [key]: value }));
        };

        return (
            <div 
                id="explore-view" 
                className="active"
                style={{ 
                    /* Force Layout for Mobile/Tablet */
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: 'var(--content-height)', 
                    width: '100%',
                    position: 'fixed',
                    top: 'var(--navbar-offset)',
                    left: 0,
                    background: 'var(--bg-color)',
                    zIndex: 50
                }}
            >
                {/* FIXED HEADER SECTION */}
                <div className="explore-header-wrapper" style={{ flexShrink: 0, zIndex: 10, background: 'var(--bg-color)' }}>
                    {/* Type Filter */}
                    <div className="explore-type-pills">
                        {typeOptions.map(t => (
                            <button key={t} type="button" className={`explore-pill explore-pill--type ${filters.type === t ? 'is-active' : ''}`} onClick={() => handleFilter('type', t)}>{t}</button>
                        ))}
                    </div>

                    {/* Region Filter */}
                    <div className="explore-region-pills">
                        {regionOptions.map(r => (
                            <button key={r} type="button" className={`explore-pill explore-pill--region ${filters.region === r ? 'is-active' : ''}`} onClick={() => handleFilter('region', r)}>{r}</button>
                        ))}
                    </div>

                    {/* Sort Filter */}
                    <div className="explore-sort-pills">
                        {sortOptions.map(s => (
                            <button key={s} type="button" className={`explore-pill explore-pill--sort ${filters.sort === s ? 'is-active' : ''}`} onClick={() => handleFilter('sort', s)}>{s}</button>
                        ))}
                    </div>
                </div>

                {/* SCROLLABLE CONTENT BODY */}
                <div 
                    className="explore-content-body" 
                    onScroll={handleScroll}
                    style={{ 
                        flex: 1, 
                        overflowY: 'auto', 
                        paddingTop: '10px',
                        width: '100%'
                    }}
                >
                    <div className="explore-grid" style={{ paddingBottom: '120px' }}>
                        {results.map((item, idx) => {
                            if (item.media_type === 'person' || !item.poster_path) return null;
                            return (
                                <div key={`${item.id}-${idx}`} className="movie-card fade-in" onClick={() => openDetail(item)}>
                                    <div className="card-poster">
                                        <div className="badge-overlay">HD</div>
                                        <div className="rating-badge"><i className="fas fa-star"></i> {item.vote_average?.toFixed(1)}</div>
                                        <img src={POSTER_URL + item.poster_path} onError={(e) => e.target.src = PLACEHOLDER_IMG} loading="lazy" alt={getDisplayTitle(item)} />
                                    </div>
                                    <div className="card-info">
                                        <div className="card-title">{getDisplayTitle(item)}</div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {isLoading && <div className="spinner" style={{ gridColumn: '1 / -1', margin: '20px auto' }}></div>}
                        
                        {!isLoading && !hasMore && results.length > 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', margin: '20px 0' }}>
                                No more results.
                            </div>
                        )}
                        
                        {!isLoading && results.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', marginTop: '50px' }}>
                                No results found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    export default Explore;