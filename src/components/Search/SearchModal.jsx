import React, { useState, useEffect, useRef } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { POSTER_URL, PLACEHOLDER_IMG, getDisplayTitle } from '../../api/tmdb';

const API_KEY = '4eea503176528574efd91847b7a302cc';
const BASE_URL = 'https://api.themoviedb.org/3';

const SearchModal = () => {
    const { searchModal, setSearchModal, openDetail } = useGlobal();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    
    // Filters
    const [filters, setFilters] = useState({ type: 'All', region: 'All Regions', sort: 'Ongoing' });
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const inputRef = useRef(null);
    const debounceTimer = useRef(null);

    // --- CONFIGURATION ---
    const typeOptions = ['All', 'Series', 'Movie', 'Tv Show', 'Anime'];
    const regionOptions = ['All Regions', 'South Korea', 'China', 'US', 'Japan', 'Philippines'];
    const sortOptions = ['Latest', 'Ongoing', 'Popular', 'Completed'];

    // --- 1. INITIAL LOAD & FOCUS ---
    useEffect(() => {
        if (searchModal.isOpen) {
            setResults([]);
            setPage(1);
            setHasMore(true);
            setQuery('');
            
            // Only focus if search is not hidden
            if(!searchModal.hideSearch && inputRef.current) {
                inputRef.current.focus();
            }
            
            const initialFilters = searchModal.mode === 'search' 
                ? { type: 'All', region: 'All Regions', sort: 'Ongoing' }
                : filters;

            setFilters(initialFilters);
            loadResults(1, '', initialFilters);
        }
    }, [searchModal.isOpen, searchModal.mode, searchModal.hideSearch]);

    // --- 2. INPUT HANDLER ---
    const handleInput = (e) => {
        const val = e.target.value;
        setQuery(val);
        
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            setResults([]);
            setPage(1);
            loadResults(1, val, filters);
        }, 500);
    };

    // --- 3. FILTER HANDLER ---
    const handleFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        setResults([]);
        setPage(1);
        loadResults(1, query, newFilters);
    };

    // --- 4. API FETCH LOGIC ---
    const loadResults = async (pageNum, searchQuery, currentFilters) => {
        if (pageNum > 1 && isLoading) return;
        setIsLoading(true);

        try {
            let url = '';
            
            if (searchQuery && searchQuery.trim().length > 0) {
                let endpoint = '/search/multi';
                if(currentFilters.type === 'Movie') endpoint = '/search/movie';
                if(currentFilters.type === 'Series' || currentFilters.type === 'Tv Show') endpoint = '/search/tv';
                
                url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&query=${encodeURIComponent(searchQuery)}&page=${pageNum}`;
            } else {
                const isGenericSearch = searchModal.mode === 'search' && currentFilters.type === 'All';

                if (isGenericSearch) {
                    url = `${BASE_URL}/trending/all/week?api_key=${API_KEY}&page=${pageNum}`;
                } else {
                    let endpoint = '/discover/tv';
                    const type = currentFilters.type.toLowerCase();
                    
                    if (type === 'movie') endpoint = '/discover/movie';
                    
                    let params = `&page=${pageNum}&sort_by=popularity.desc`;
                    
                    const regionMap = { 
                        'South Korea': 'ko', 'China': 'zh', 'Japan': 'ja', 
                        'Philippines': 'tl', 'US': 'en' 
                    };
                    if (regionMap[currentFilters.region]) {
                        params += `&with_original_language=${regionMap[currentFilters.region]}`;
                    }
                    
                    if (type === 'anime') {
                        endpoint = '/discover/tv';
                        params += `&with_genres=16&with_original_language=ja`;
                    }

                    url = `${BASE_URL}${endpoint}?api_key=${API_KEY}${params}`;
                }
            }

            const res = await fetch(url);
            const data = await res.json();
            
            if (data.results && data.results.length > 0) {
                setResults(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
            } else {
                setHasMore(false);
            }
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    };

    // --- 5. SCROLL HANDLER ---
    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 300 && hasMore && !isLoading) {
            const next = page + 1;
            setPage(next);
            loadResults(next, query, filters);
        }
    };

    if (!searchModal.isOpen) return null;

    let headingText = "Popular Searches";
    if (query) headingText = `Results for "${query}"`;
    else if (filters.type !== 'All') headingText = `Top ${filters.type}`;

    return (
        <div className="search-modal-v2" style={{ display: 'flex' }}>
            
            {/* --- STICKY HEADER --- */}
            <div className="search-modal-v2__header">
                
                {/* ROW 1: INPUT - Only show if not hidden */}
                {!searchModal.hideSearch && (
                    <div className="search-modal-v2__input-row">
                        <i className="fa-solid fa-arrow-left search-modal-v2__back-btn" 
                           onClick={() => setSearchModal({ ...searchModal, isOpen: false })}></i>
                        
                        <div className="search-modal-v2__input-wrapper">
                            <i className="fa-solid fa-magnifying-glass search-modal-v2__input-icon"></i>
                            <input 
                                ref={inputRef}
                                type="text" 
                                className="search-modal-v2__input"
                                placeholder="Search movies, series..." 
                                value={query} 
                                onChange={handleInput}
                                autoComplete="off"
                            />
                            {query && (
                                <i className="fa-solid fa-xmark search-modal-v2__clear-btn" 
                                   style={{ display: 'block' }}
                                   onClick={() => { 
                                        setQuery(''); 
                                        setResults([]); 
                                        loadResults(1, '', { ...filters, type: 'All' }); 
                                   }}
                                ></i>
                            )}
                        </div>
                    </div>
                )}

                {/* ROW 2: TYPE PILLS */}
                <div className="search-modal-v2__type-pills">
                    {typeOptions.map(t => (
                        <button 
                            key={t} 
                            type="button"
                            className={`search-modal-v2__pill search-modal-v2__pill--type ${filters.type === t ? 'is-active' : ''}`} 
                            onClick={() => handleFilter('type', t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* ROW 3: SECONDARY FILTERS (Only show in Explore Mode) */}
                {searchModal.mode === 'explore' && !query && (
                    <div className="search-modal-v2__secondary-filters">
                        <div className="search-modal-v2__filter-row">
                            {regionOptions.map(r => (
                                <button 
                                    key={r} 
                                    type="button"
                                    className={`search-modal-v2__pill search-modal-v2__pill--region ${filters.region === r ? 'is-active' : ''}`} 
                                    onClick={() => handleFilter('region', r)}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                        <div className="search-modal-v2__filter-row">
                            {sortOptions.map(s => (
                                <button 
                                    key={s} 
                                    type="button"
                                    className={`search-modal-v2__pill search-modal-v2__pill--sort ${filters.sort === s ? 'is-active' : ''}`} 
                                    onClick={() => handleFilter('sort', s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- RESULTS GRID --- */}
            <div className="search-modal-v2__results" onScroll={handleScroll}>
                
                <h3 className="search-modal-v2__heading">
                    {headingText}
                </h3>

                {results.map((item, idx) => {
                    if (item.media_type === 'person' || !item.poster_path) return null;
                    return (
                        <div 
                            key={`${item.id}-${idx}`} 
                            className="movie-card fade-in" 
                            onClick={() => { 
                                setSearchModal(prev => ({ ...prev, isOpen: false })); 
                                openDetail(item); 
                            }}
                        >
                            <div className="card-poster">
                                <div className="badge-overlay">HD</div>
                                <div className="rating-badge">
                                    <i className="fas fa-star"></i> {item.vote_average?.toFixed(1)}
                                </div>
                                <img 
                                    src={POSTER_URL + item.poster_path} 
                                    onError={(e) => e.target.src = PLACEHOLDER_IMG} 
                                    loading="lazy" 
                                    alt={getDisplayTitle(item)}
                                />
                            </div>
                            <div className="card-info">
                                <div className="card-title">{getDisplayTitle(item)}</div>
                            </div>
                        </div>
                    );
                })}
                
                {isLoading && (
                    <div className="spinner" style={{ gridColumn: '1 / -1', margin: '20px auto' }}></div>
                )}
                
                {!isLoading && results.length === 0 && (
                    <div className="search-modal-v2__empty">
                        No results found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchModal;