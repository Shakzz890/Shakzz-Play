import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { fetchData, IMG_URL, POSTER_URL, PLACEHOLDER_IMG, getDisplayTitle } from '../api/tmdb';
import Top10Philippines from '../components/Top10Philippines';
// Capacitor Browser for external links
import { Browser } from '@capacitor/browser';

// --- HELPER TO CHECK IF ITEM IS IN THE FUTURE ---
const isItemUpcoming = (item) => {
    const releaseStr = item.release_date || item.first_air_date;
    if (!releaseStr) return false;
    const releaseDate = new Date(releaseStr);
    const today = new Date();
    return releaseDate > today;
};

const MovieList = React.memo(({ items, isUpcoming }) => {
    const { openDetail } = useGlobal();

    return (
        <div className="list">
            {items.slice(0, 12).map(item => (
                <div key={item.id} className="movie-card focusable-element fade-in" onClick={() => openDetail(item)} tabIndex="0">
                    <div className="card-poster">
                        {isUpcoming ? <div className="coming-badge">COMING</div> : <div className="badge-overlay">HD</div>}
                        {!isUpcoming && <div className="rating-badge"><i className="fas fa-star"></i> {item.vote_average?.toFixed(1)}</div>}
                        <img 
                            src={item.poster_path ? POSTER_URL + item.poster_path : PLACEHOLDER_IMG} 
                            loading="lazy" 
                            onError={(e) => e.target.src = PLACEHOLDER_IMG} 
                            alt={getDisplayTitle(item)}
                        />
                    </div>
                    <div className="card-info">
                        <div className="card-title">{getDisplayTitle(item)}</div>
                        <div className="card-meta">
                            <span>{(item.release_date || item.first_air_date || 'N/A').split('-')[0]}</span>
                            <span className="dot-sep"></span>
                            <span>{item.media_type === 'tv' || item.first_air_date ? 'Series' : 'Movie'}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
});

const Home = () => {
    const { 
        openDetail, 
        setDetailItem, 
        setIsPlayerOpen, 
        showLoader, 
        hideLoader, 
        history, 
        removeFromHistory, 
        togglePin,          
        setCategoryModal,
        setInfoModal,
        refreshTrigger 
    } = useGlobal();

    const [sliderItems, setSliderItems] = useState([]);
    const [lists, setLists] = useState({
        trending: [], kdrama: [], cdrama: [], filipino: [], top_ph: [], movies: [], tv: [], anime: [], upcoming: []
    });
    const [slideIndex, setSlideIndex] = useState(0);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const sliderInterval = useRef(null);

    const CATEGORY_ENDPOINTS = {
        'trending': '/trending/all/week',
        'kdrama': '/discover/tv?with_original_language=ko&with_origin_country=KR&sort_by=popularity.desc',
        'cdrama': '/discover/tv?with_original_language=zh&with_origin_country=CN&sort_by=popularity.desc',
        'filipino': '/discover/tv?with_original_language=tl&with_origin_country=PH&sort_by=popularity.desc',
        'top_ph': '/discover/movie?region=PH&sort_by=popularity.desc',
        'anime': '/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc',
        'movies': '/movie/popular',
        'tv': '/tv/popular',
        'upcoming': '/movie/upcoming?region=US'
    };

    const fetchAllData = async () => {
        try {
            const [day, week, kr, cn, ph, topPh, anime, mov, tv, up] = await Promise.all([
                fetchData('/trending/all/day'),
                fetchData('/trending/all/week'),
                fetchData('/discover/tv?with_original_language=ko&with_origin_country=KR&sort_by=popularity.desc'),
                fetchData('/discover/tv?with_original_language=zh&with_origin_country=CN&sort_by=popularity.desc'),
                fetchData('/discover/tv?with_original_language=tl&with_origin_country=PH&sort_by=popularity.desc'),
                fetchData('/discover/movie?region=PH&sort_by=popularity.desc'),
                fetchData('/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc'),
                fetchData('/movie/popular'),
                fetchData('/tv/popular'),
                fetchData('/movie/upcoming?region=US')
            ]);

            const globalHits = (day.results || []).filter(i => i.backdrop_path).slice(0, 5);
            const kDramaHits = (kr.results || []).filter(i => i.backdrop_path).slice(0, 3);
            setSliderItems([...globalHits, ...kDramaHits]);
            
            setLists({
                trending: week.results || [],
                kdrama: kr.results || [],
                cdrama: cn.results || [],
                filipino: ph.results || [],
                top_ph: topPh.results || [],
                anime: anime.results || [],
                movies: mov.results || [],
                tv: tv.results || [],
                upcoming: up.results || []
            });
        } catch (e) { console.error("Error fetching data:", e); }
    };

    useEffect(() => {
        if (refreshTrigger > 0) {
            fetchAllData();
        }
    }, [refreshTrigger]);

    useEffect(() => {
        const init = async () => {
            const hasInitialized = sessionStorage.getItem('shakzz_system_ready');
            if (!hasInitialized) {
                showLoader("Initializing System...");
                sessionStorage.setItem('shakzz_system_ready', 'true');
            }
            await fetchAllData();
            hideLoader();
        };
        init();

        const closeMenu = () => setActiveMenuId(null);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    const startSlider = useCallback(() => {
        clearInterval(sliderInterval.current);
        if (sliderItems.length > 0) {
            sliderInterval.current = setInterval(() => {
                setSlideIndex(prev => (prev + 1) % sliderItems.length);
            }, 5000);
        }
    }, [sliderItems]);

    useEffect(() => {
        startSlider();
        return () => clearInterval(sliderInterval.current);
    }, [startSlider]);

    const moveSlider = (dir) => {
        setSlideIndex(prev => (prev + dir + sliderItems.length) % sliderItems.length);
        startSlider(); 
    };

    const openCat = (key, title) => {
        const endpoint = CATEGORY_ENDPOINTS[key];
        if (endpoint) setCategoryModal({ isOpen: true, title, endpoint });
    };

    const playSliderItem = (item) => {
        setDetailItem(item);
        setIsPlayerOpen(true);
    };

    const playHistoryItem = (item) => {
        setDetailItem(item);    
        setIsPlayerOpen(true); 
    };

    const handleMenuClick = (e, id) => {
        e.preventDefault(); e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handlePin = (e, item) => {
        e.stopPropagation();
        if (togglePin) togglePin(item.id); 
        setActiveMenuId(null);
    };

    const handleRemove = (e, item) => {
        e.stopPropagation();
        if (removeFromHistory) removeFromHistory(item.id); 
        setActiveMenuId(null);
    };

    const openExternalLink = async (e, url) => {
        e.preventDefault();
        try {
            await Browser.open({ url: url });
        } catch (error) {
            window.open(url, '_blank');
        }
    };

    return (
        <div id="home-view">
            {/* SLIDER SECTION */}
            <div className="slider-viewport">
                <div className="slider-track" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
                    {sliderItems.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="slide" style={{ backgroundImage: `url(${IMG_URL + item.backdrop_path})` }}>
                            <div className="slide-content">
                                
                                {/* 🚀 NEW DYNAMIC BADGES */}
                                <div className="slide-badges">
                                    <span className="slide-badge trending">Trending Now</span>
                                    {isItemUpcoming(item) ? (
                                        <span className="slide-badge coming-soon">Coming Soon</span>
                                    ) : (
                                        <span className="slide-badge hd-badge">HD</span>
                                    )}
                                </div>

                                <h1 className="slide-title">{getDisplayTitle(item)}</h1>
                                <div className="slide-meta">
                                    <span>{(item.release_date || item.first_air_date || '').split('-')[0]}</span>
                                    <span>•</span>
                                    <span className="slide-rating"><i className="fas fa-star"></i> {item.vote_average?.toFixed(1)}</span>
                                </div>
                                <p className="slide-desc">{item.overview}</p>
                                <div className="slide-actions">
                                    <button className="slider-btn btn-play-slide" onClick={() => playSliderItem(item)}>
                                        <i className="fas fa-play"></i> Play
                                    </button>
                                    <button className="slider-btn btn-info-slide" onClick={() => openDetail(item)}>
                                        <i className="fas fa-info-circle"></i> Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="slider-dots">
                    {sliderItems.map((_, idx) => (
                        <div key={idx} className={`dot ${idx === slideIndex ? 'active' : ''}`} onClick={() => { setSlideIndex(idx); startSlider(); }}></div>
                    ))}
                </div>
                <button className="slider-arrow prev-arrow" onClick={() => moveSlider(-1)}><i className="fas fa-chevron-left"></i></button>
                <button className="slider-arrow next-arrow" onClick={() => moveSlider(1)}><i className="fas fa-chevron-right"></i></button>
            </div>

            {/* CONTINUE WATCHING */}
            {history.length > 0 && (
                <div className="row" id="continue-watching-row">
                    <h2><span className="section-indicator" style={{ background: 'var(--accent-color)' }}></span> Continue Watching <i className="fa-solid fa-clock-rotate-left"></i></h2>
                    <div className="list" id="continue-list">
                        {history.slice(0, 10).map(item => (
                            <div key={item.id} className="continue-card fade-in" onClick={() => playHistoryItem(item)}>
                                <div className="continue-image-wrapper">
                                    <img 
                                        src={item.backdrop_path ? IMG_URL + item.backdrop_path : POSTER_URL + item.poster_path} 
                                        onError={(e) => e.target.src = PLACEHOLDER_IMG} 
                                        alt={item.title || "Continue Watching"}
                                    />
                                    <div className="continue-play-icon"><i className="fas fa-play"></i></div>
                                    <div className="continue-ep-badge">{item.badge_label || 'Resume'}</div>
                                    {item.pinned && <div className="pinned-badge visible"><i className="fas fa-thumbtack"></i></div>}
                                    <div className="continue-progress-bg">
                                        <div className="continue-progress-fill" style={{ width: '0%' }}></div>
                                    </div>
                                </div>
                                <div className="continue-info">
                                    <div className="continue-title">{item.title}</div>
                                    <div className="continue-menu-btn" onClick={(e) => handleMenuClick(e, item.id)}>
                                        <i className="fas fa-ellipsis-vertical"></i>
                                    </div>
                                    {activeMenuId === item.id && (
                                        <div className="card-context-menu show">
                                            <div className="ctx-item" onClick={(e) => handlePin(e, item)}>
                                                <i className="fas fa-thumbtack"></i> {item.pinned ? 'Unpin' : 'Pin'}
                                            </div>
                                            <div className="ctx-item delete" onClick={(e) => handleRemove(e, item)}>
                                                <i className="fas fa-trash"></i> Remove
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* 🚀 THE NEW GIANT TOP 10 ROW */}
            <Top10Philippines trendingMovies={lists.top_ph} />
                        {/* CATEGORIES */}
            <div className="row"><h2 onClick={() => openCat('trending', 'Latest Updates')}><span className="section-indicator" style={{ background: 'var(--accent-color)' }}></span> Latest Updates <i className="fa-solid fa-chevron-right"></i></h2><MovieList items={lists.trending} /></div>
            <div className="row"><h2 onClick={() => openCat('top_ph', 'Top in the Philippines')}><span className="section-indicator" style={{ background: 'var(--accent-color)' }}></span> Top in the Philippines <i className="fa-solid fa-chevron-right"></i></h2><MovieList items={lists.top_ph} /></div>
            <div className="row"><h2 onClick={() => openCat('kdrama', 'Top K-Drama')}><span className="section-indicator" style={{ background: 'var(--accent-color)' }}></span> Top K-Drama <i className="fa-solid fa-chevron-right"></i></h2><MovieList items={lists.kdrama} /></div>
            <div className="row"><h2 onClick={() => openCat('cdrama', 'Top C-Drama')}><span className="section-indicator" style={{ background: 'var(--accent-color)' }}></span> Top C-Drama <i className="fa-solid fa-chevron-right"></i></h2><MovieList items={lists.cdrama} /></div>
            <div className="row"><h2 onClick={() => openCat('filipino', 'Top Filipino Drama')}><span className="section-indicator" style={{ background: 'var(--accent-color)' }}></span> Top Filipino Drama <i className="fa-solid fa-chevron-right"></i></h2><MovieList items={lists.filipino} /></div>
            <div className="row"><h2 onClick={() => openCat('movies', 'Trending Movies')}><span className="section-indicator" style={{ background: 'var(--accent-color)' }}></span> Trending Movies <i className="fa-solid fa-chevron-right"></i></h2><MovieList items={lists.movies} /></div>
            <div className="row"><h2 onClick={() => openCat('tv', 'Trending TV Shows')}><span className="section-indicator" style={{ background: 'var(--accent-color)' }}></span> Trending TV Shows <i className="fa-solid fa-chevron-right"></i></h2><MovieList items={lists.tv} /></div>
            <div className="row"><h2 onClick={() => openCat('anime', 'Trending Anime')}><span className="section-indicator" style={{ background: 'var(--accent-color)' }}></span> Trending Anime <i className="fa-solid fa-chevron-right"></i></h2><MovieList items={lists.anime} /></div>
            <div className="row"><h2 onClick={() => openCat('upcoming', 'Upcoming Releases')}><span className="section-indicator" style={{ background: 'var(--accent-color)' }}></span> Upcoming <i className="fa-solid fa-chevron-right"></i></h2><MovieList items={lists.upcoming} isUpcoming={true} /></div>
        
            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-top">
                        <div className="footer-desc">
                            <h4>DIVE INTO THE SYSTEM</h4>
                            <p>Watch your favorite movies, TV shows, and anime in HD. Experience the ultimate entertainment platform.</p>
                            
                            <div className="footer-big-text" style={{
                                background: '-webkit-linear-gradient(#fff, #a855f7)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.4))',
                                fontFamily: "'Orbitron', sans-serif",
                                letterSpacing: '-2px'
                            }}>
                                SHAKZZ
                            </div>
                        </div>
                        
                        <div className="footer-nav-wrapper">
                            <div className="footer-col">
                                <a href="#" onClick={(e) => { e.preventDefault(); setInfoModal({isOpen: true, type: 'about'}); }}>About Us</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setInfoModal({isOpen: true, type: 'updates'}); }}>Updates</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setInfoModal({isOpen: true, type: 'faq'}); }}>FAQ</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setInfoModal({isOpen: true, type: 'privacy'}); }}>Privacy Policy</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setInfoModal({isOpen: true, type: 'contact'}); }}>Contact Us</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); setInfoModal({isOpen: true, type: 'donate'}); }}>Donate</a>
                            </div>
                            
                            <div className="footer-col">
                                <span className="col-title">FOLLOW US</span>
                                <div className="social-row">
                                    <a href="#" onClick={(e) => openExternalLink(e, "https://www.facebook.com/share/1BzwhDsGmT/")}>
                                        <i className="fa-brands fa-facebook-f"></i>
                                    </a>
                                    <a href="#" onClick={(e) => openExternalLink(e, "https://www.instagram.com/shakzzph?igsh=MTR4enRzbjJ4aWh5MQ==")}>
                                        <i className="fa-brands fa-instagram"></i>
                                    </a>
                                    <a href="#" onClick={(e) => openExternalLink(e, "https://www.tiktok.com/@shakzz05?is_from_webapp=1&sender_device=pc")}>
                                        <i className="fa-brands fa-tiktok"></i>
                                    </a>
                                </div>
                                
                                <span className="col-title" style={{marginTop:'25px'}}>JOIN COMMUNITY</span>
                                <div className="social-row">
                                    <a href="#" onClick={(e) => openExternalLink(e, "https://discord.gg/K2VhJxAmvX")} title="Join Discord">
                                        <i className="fa-brands fa-discord"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="footer-bottom">
                        <span className="copyright">© 2026 AHJIN GUILD. ALL RIGHTS RESERVED.</span>
                        <span className="credits">DESIGNED BY SHAKZZ</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;