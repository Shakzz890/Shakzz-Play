import React, { useState, useEffect } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { PLACEHOLDER_IMG } from '../api/tmdb'; 

// --- IMPORTS FOR IMMERSIVE MODE ---
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';

const SECURE_WORKER_URL = "https://stream.supreme-ninja01.workers.dev";

const TABS = [
    "all", 
    "favorites", 
    "news", 
    "entertainment", 
    "movies", 
    "sports", 
    "documentary", 
    "cartoons & animations", 
    "anime tagalog dubbed"
];

const Live = () => {
    const { currentView } = useGlobal();

    // --- CLOUDFLARE DYNAMIC DATA STATES ---
    const [channels, setChannels] = useState({});
    const [animeData, setAnimeData] = useState({});
    const [isDbLoading, setIsDbLoading] = useState(true);

    // --- STATE ---
    const [activeChannelKey, setActiveChannelKey] = useState(null);
    const [activeTab, setActiveTab] = useState(0); 
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);
    
    // Data States
    const [onlineCount, setOnlineCount] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date()); 
    const [isAnimeLoading, setIsAnimeLoading] = useState(false); 
    
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [animeEpisodes, setAnimeEpisodes] = useState([]);
    const [selectedAnimeTitle, setSelectedAnimeTitle] = useState("");

    // --- INITIAL SETUP & CLOUDFLARE FETCH ---
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1023);
        window.addEventListener('resize', handleResize);
        
        const storedFavs = JSON.parse(localStorage.getItem("favoriteChannels") || "[]");
        setFavorites(storedFavs);

        const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000); 

        const updateCount = async () => {
            const uid = localStorage.getItem('visitor_uid') || Math.random().toString(36).substring(7);
            localStorage.setItem('visitor_uid', uid);
            try {
                const response = await fetch(`https://shakzz-tv.firebaseapp.com/api/visit?uid=${uid}&t=${Date.now()}`);
                if (response.ok) {
                    const data = await response.json();
                    setOnlineCount(data.count.toLocaleString());
                }
            } catch (err) {}
        };
        const countInterval = setInterval(updateCount, 5000);
        updateCount();

        // === FETCH DATABASE FROM CLOUDFLARE ===
        const initLiveTV = async () => {
            try {
                // Fetch full JSON DB from Worker fallback route
                const dbRes = await fetch(SECURE_WORKER_URL);
                if (!dbRes.ok) throw new Error("Failed to load Cloudflare DB");
                
                const dbData = await dbRes.json();
                const remoteChannels = dbData.channels || {};
                const remoteAnime = dbData.animeData || {};

                // Update app state
                setChannels(remoteChannels);
                setAnimeData(remoteAnime);
                setIsDbLoading(false);

                // Figure out which channel to auto-play first
                const lastPlayed = localStorage.getItem("lastPlayedChannel");
                let targetChannel = "";
                if (lastPlayed && remoteChannels[lastPlayed]) {
                    targetChannel = lastPlayed;
                } else {
                    targetChannel = remoteChannels['kapamilya'] ? 'kapamilya' : Object.keys(remoteChannels)[0];
                }

                // Initialize Player using the freshly fetched remote data
                if (!window.jwplayer) {
                    const script = document.createElement('script');
                    script.src = "https://ssl.p.jwpcdn.com/player/v/8.38.10/jwplayer.js";
                    script.onload = () => {
                        window.jwplayer.key = "ITWMv7t88JGzI0xPwW8I0+LveiXX9SWbfdmt0ArUSyc=";
                        if(targetChannel) loadChannel(targetChannel, null, remoteChannels);
                    };
                    document.head.appendChild(script);
                } else {
                    if(targetChannel) loadChannel(targetChannel, null, remoteChannels);
                }

            } catch (err) {
                console.error("DB Sync Error:", err);
                setIsDbLoading(false);
            }
        };

        initLiveTV();

        return () => {
            clearInterval(timeInterval);
            clearInterval(countInterval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // --- VIEW SWITCHING LOGIC ---
    useEffect(() => {
        if (!window.jwplayer || !activeChannelKey) return;
        try {
            const player = window.jwplayer("video");
            if (player && player.getState) {
                if (currentView === 'live') {
                    const state = player.getState();
                    if (state === 'paused' || state === 'idle') player.play();
                } else {
                    player.pause();
                }
            }
        } catch(e) {}
    }, [currentView, activeChannelKey]);

    // --- PLAYER LOGIC (Accepts custom remote DB on first boot) ---
    const loadChannel = async (key, customData = null, dbRef = channels) => {
        const channelMeta = customData || dbRef[key];
        if (!channelMeta) return;

        setActiveChannelKey(key || channelMeta.name);
        if(!customData) localStorage.setItem("lastPlayedChannel", key);

        let secureData = {};
        try {
            if (!customData) {
                const response = await fetch(`${SECURE_WORKER_URL}/get-channel?id=${key}`);
                if (!response.ok) throw new Error("Stream Offline");
                secureData = await response.json();
            } else {
                secureData = customData;
            }
        } catch (error) {
            console.error("Secure Fetch Error:", error);
            return;
        }

        const finalConfig = { ...channelMeta, ...secureData };

        if (window.jwplayer) {
            const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJTaGFrenoiLCJleHAiOjE3NjY5NTgzNTN9.RSc_LQ11txXXI0d7gZ8GvMOAwoHrWzUUr3CCQCM0Hco";
            
            let finalManifest = finalConfig.manifestUri;
            if (!finalManifest) return;

            if (finalManifest.includes("converse.nathcreqtives.com")) {
                const separator = finalManifest.includes('?') ? '&' : '?';
                finalManifest = `${finalManifest}${separator}token=${AUTH_TOKEN}`;
            }

            let drmConfig = undefined;
            if (finalConfig.type === "clearkey" && finalConfig.keyId && finalConfig.key) {
                drmConfig = { 
                    clearkey: { 
                        keyId: finalConfig.keyId, 
                        key: finalConfig.key 
                    } 
                };
            } else if (finalConfig.type === "widevine") {
                drmConfig = { 
                    widevine: { 
                        url: finalConfig.licenseServerUri || finalConfig.key 
                    } 
                };
            }

            // 1. SHOW BANNER BEFORE SETUP
            const loadingBanner = document.getElementById('stream-loading-banner');
            if (loadingBanner) {
                loadingBanner.style.opacity = '1';
                loadingBanner.innerHTML = `
                    <div class="spinner" style="margin: 0 0 15px 0 !important;"></div>
                    <h3>SHAKZZ PLAY</h3>
                    <p>Loading channel... please wait 3-5 seconds.</p>
                `;
            }

            // 2. INITIALIZE PLAYER (Removed the background image property)
            const playerInstance = window.jwplayer("video").setup({
                autostart: true,
                width: "100%",
                height: "100%",
                stretching: "exactfit",
                playlist: [{
                    file: finalManifest,
                    type: finalConfig.type === "mp4" ? "mp4" : (finalConfig.type === "hls" ? "hls" : "dash"),
                    drm: drmConfig
                }]
            });

            // 3. DYNAMIC BANNER EVENTS
            playerInstance.on('play', () => {
                if (loadingBanner) loadingBanner.style.opacity = '0'; // Hide when successfully playing
            });

            playerInstance.on('buffer', () => {
                if (loadingBanner) {
                    loadingBanner.style.opacity = '1';
                    loadingBanner.innerHTML = `
                        <div class="spinner" style="margin: 0 0 15px 0 !important;"></div>
                        <h3>SHAKZZ PLAY</h3>
                        <p>Buffering stream... please wait.</p>
                    `;
                }
            });

            playerInstance.on('error', () => {
                if (loadingBanner) {
                    loadingBanner.style.opacity = '1';
                    loadingBanner.innerHTML = `
                        <h3 style="color: #ef4444; text-shadow: 0 0 15px rgba(239, 68, 68, 0.4);">STREAM OFFLINE</h3>
                        <p>Unable to load channel. Please try another one.</p>
                    `;
                }
            });

            playerInstance.on('fullscreen', async (event) => {
                if (event.fullscreen) {
                    try {
                        await ScreenOrientation.lock({ orientation: 'landscape' });
                        await StatusBar.hide();
                        await NavigationBar.hide();
                    } catch (e) {}
                } else {
                    try {
                        await ScreenOrientation.lock({ orientation: 'portrait' });
                        await StatusBar.show();
                        await NavigationBar.show();
                    } catch (e) {}
                }
            });
        }
    };

    const handleAnimeSelect = async (e) => {
        const title = e.target.value;
        setSelectedAnimeTitle(title);
        
        if (animeData && animeData[title]) {
            setIsAnimeLoading(true);
            setAnimeEpisodes([]);

            try {
                const response = await fetch(`${SECURE_WORKER_URL}/get-anime?title=${encodeURIComponent(title)}`);
                
                if (response.ok) {
                    const secureEpisodes = await response.json();
                    const localEpisodes = animeData[title];
                    
                    const mergedList = localEpisodes.map((localEp, index) => {
                        const secureEp = secureEpisodes[index] || {};
                        return {
                            ...localEp,
                            manifestUri: secureEp.manifestUri
                        };
                    });

                    setAnimeEpisodes(mergedList);
                } else {
                    setAnimeEpisodes([]);
                }
            } catch (error) {
                console.error("Anime Fetch Error:", error);
                setAnimeEpisodes([]);
            } finally {
                setIsAnimeLoading(false);
            }
        }
    };

    const handleCategorySelect = (index) => {
        setActiveTab(index);
        setIsCategoryModalOpen(false);
        if (TABS[index] !== "anime tagalog dubbed") {
            setSelectedAnimeTitle("");
            setAnimeEpisodes([]);
        }
    };

    const toggleFavorite = (e, key) => {
        e.stopPropagation();
        let newFavs = favorites.includes(key) 
            ? favorites.filter(k => k !== key) 
            : [...favorites, key];
        setFavorites(newFavs);
        localStorage.setItem("favoriteChannels", JSON.stringify(newFavs));
    };

    const getFilteredList = () => {
        const selectedGroup = TABS[activeTab];
        if (selectedGroup === "anime tagalog dubbed") return [];

        return Object.entries(channels).filter(([key, channel]) => {
            const group = channel.group || "live";
            const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
            let matchesGroup = false;
            
            if (selectedGroup === "all") matchesGroup = true;
            else if (selectedGroup === "favorites") matchesGroup = favorites.includes(key);
            else matchesGroup = Array.isArray(group) ? group.includes(selectedGroup) : group === selectedGroup;

            return matchesSearch && matchesGroup;
        }).sort((a, b) => a[1].name.localeCompare(b[1].name));
    };

    const formatTabName = (tab) => {
        return tab.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const filteredChannels = getFilteredList();
    const isAnimeTab = TABS[activeTab] === "anime tagalog dubbed";
    const { dateStr, timeStr } = formatFullDateTime(currentTime);

    function formatFullDateTime(date) {
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        let suffix = hours >= 12 ? (hours === 12 ? 'NN' : 'PM') : (hours === 0 ? 'MN' : 'AM');
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;
        return { dateStr, timeStr: `${hours}:${minutes}:${seconds} ${suffix}` };
    }

    return (
        <div id="live-view" style={{ display: 'flex', position: 'relative' }}>
            {/* 1. PLAYER CONTAINER */}
            <div className="live-player-container">
                <div id="playerWrapper">
                    <div id="video">
                        <div className="skeleton" style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: '#000'}}></div>
                    </div>

                    {/* --- NEW CUSTOM LOADING BANNER --- */}
                    <div id="stream-loading-banner" className="stream-loading-banner" style={{opacity: 0}}></div>

                    <div id="overlayContainer">
                        <div id="nowPlayingOverlay">
                            <span className="pulsing-dot"></span>
                            Now Playing: <span id="nowPlayingChannel">
                                {isAnimeTab ? (activeChannelKey || "Select Episode") : (channels[activeChannelKey]?.name || "Select Channel")}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. SIDEBAR CONTAINER */}
            <div className="channel-section">
                <div className="search-container">
                    <i className="fas fa-search search-icon"></i>
                    <input 
                        type="text" 
                        placeholder="Search channel..." 
                        className="focusable-element"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && <i className="fas fa-times clear-btn" onClick={() => setSearchQuery('')}></i>}
                </div>

                {!isMobile && (
                    <div className="category-bar">
                        {TABS.map((tab, index) => (
                            <button
                                key={index}
                                className={`category-button ${activeTab === index ? 'active' : ''}`}
                                onClick={() => handleCategorySelect(index)}
                            >
                                {formatTabName(tab)}
                            </button>
                        ))}
                    </div>
                )}

                {isMobile && (
                    <button className="category-dropdown-btn focusable-element" onClick={() => setIsCategoryModalOpen(true)}>
                        <span>{formatTabName(TABS[activeTab])}</span>
                        <i className="fas fa-chevron-down"></i>
                    </button>
                )}

                {isAnimeTab && (
                    <div id="animeSeriesSelect" className="anime-selector-container">
                        <select className="focusable-element" onChange={handleAnimeSelect} value={selectedAnimeTitle}>
                            <option value="" disabled>Select Anime Title</option>
                            {Object.keys(animeData).map(title => (
                                <option key={title} value={title}>{title}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="channel-count-display">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fas fa-tv"></i>
                        <span>
                            {isDbLoading ? "Syncing..." : isAnimeLoading ? "Loading..." : 
                             isAnimeTab ? (selectedAnimeTitle ? `${animeEpisodes.length} Eps` : "Select Title") : 
                             `${filteredChannels.length} Channels`}
                        </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ color: 'var(--accent-color)', fontWeight: '700', fontSize: '0.85rem' }}>{timeStr}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: '#aaa', fontSize: '0.7rem' }}>{dateStr}</span>
                            {onlineCount && <span style={{color: '#fff', fontSize: '0.7rem'}}><i className="fas fa-user"></i> {onlineCount}</span>}
                        </div>
                    </div>
                </div>

                <div className="channel-list-wrapper">
                    <div className="channel-list">
                        {isDbLoading && (
                            <div style={{textAlign: 'center', color: '#666', padding: '40px'}}>
                                <div className="spinner" style={{margin: '0 auto 15px auto'}}></div>
                                Syncing Secure Data...
                            </div>
                        )}

                        {!isDbLoading && !isAnimeTab && filteredChannels.map(([key, channel]) => (
                            <div 
                                key={key} 
                                className={`channel-button focusable-element ${activeChannelKey === key ? 'active' : ''}`}
                                onClick={() => loadChannel(key)}
                            >
                                <div className="channel-logo">
                                    <img src={channel.logo} loading="lazy" onError={(e) => e.target.src = PLACEHOLDER_IMG} />
                                </div>
                                <span className="channel-name">{channel.name}</span>
                                <i 
                                    className={`favorite-star ${favorites.includes(key) ? 'fas' : 'far'} fa-star`}
                                    style={{ color: favorites.includes(key) ? '#e50914' : '#666' }}
                                    onClick={(e) => toggleFavorite(e, key)}
                                ></i>
                            </div>
                        ))}

                        {!isDbLoading && isAnimeTab && animeEpisodes.map((ep, idx) => (
                            <div 
                                key={idx} 
                                className={`channel-button focusable-element ${activeChannelKey === ep.name ? 'active' : ''}`}
                                onClick={() => loadChannel(null, ep)}
                            >
                                <div className="channel-logo">
                                    <img src={ep.logo} loading="lazy" onError={(e) => e.target.src = PLACEHOLDER_IMG} style={{objectFit: 'cover'}}/>
                                </div>
                                <div className="channel-name">{ep.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isCategoryModalOpen && (
                <div className="modal-overlay active">
                    <div className="modal-content category-modal-content">
                        <button className="close-button" onClick={() => setIsCategoryModalOpen(false)}>×</button>
                        <h3 className="modal-heading">Select Category</h3>
                        <div className="mobile-category-list">
                            {TABS.map((tab, index) => (
                                <div 
                                    key={index}
                                    className={`mobile-cat-option ${activeTab === index ? 'active' : ''}`}
                                    onClick={() => handleCategorySelect(index)}
                                >
                                    <span>{formatTabName(tab)}</span>
                                    {activeTab === index && <i className="fas fa-check-circle" style={{fontSize: '0.8rem'}}></i>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Live;