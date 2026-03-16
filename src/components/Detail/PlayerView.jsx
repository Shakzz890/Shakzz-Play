import React, { useState, useEffect, useMemo, useRef } from "react";
import { useGlobal } from "../../context/GlobalContext";
import { fetchData } from "../../api/tmdb";

// --- IMPORTS FOR IMMERSIVE MODE & ORIENTATION ---
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { StatusBar } from '@capacitor/status-bar';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';
// 🚀 ADDED: Import the Background Mode Plugin
import { BackgroundMode } from '@anuradev/capacitor-background-mode';

const servers = [
  { name: "Server 1", forceSandbox: false, getUrl: (id, type, s, e) => `https://vidsrc.cc/v2/embed/${type}/${id}${type === "tv" ? `/${s}/${e}?autoPlay=false&poster=true` : "?autoPlay=false&poster=true"}` },
  { name: "Server 2", forceSandbox: false, getUrl: (id, type, s, e) => `https://zxcstream.xyz/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}` },
  { name: "Server 3", forceSandbox: false, getUrl: (id, type, s, e) => type === "movie" ? `https://vidsrc.to/embed/movie/${id}` : `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
  { name: "Server 4", forceSandbox: true, getUrl: (id, type, s, e) => type === "movie" ? `https://fmovies4u.com/embed/movie/${id}` : `https://fmovies4u.com/embed/tv/${id}/${s}/${e}` },
  { name: "Server 5", forceSandbox: false, getUrl: (id, type, s, e) => `https://vidsrc.cx/embed/${type}/${id}${type === "tv" ? `/${s}/${e}` : ""}` },
  { name: "Server 6 (Ads)", forceSandbox: true, getUrl: (id, type, s, e) => `https://mapple.uk/watch/${type}/${id}${type === "tv" ? `-${s}-${e}` : ""}` },
];

export default function PlayerView() {
  const { isPlayerOpen, setIsPlayerOpen, detailItem, addToHistory } = useGlobal();

  const isTv = detailItem?.media_type === "tv" || detailItem?.first_air_date;
  const type = isTv ? "tv" : "movie";

  const [serverIdx, setServerIdx] = useState(0);
  
  // 🚀 REFACTOR: Split Playing State vs Viewing State
  const [playingSeason, setPlayingSeason] = useState(1);
  const [playingEpisode, setPlayingEpisode] = useState(1);
  const [viewingSeason, setViewingSeason] = useState(1);

  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [epSearch, setEpSearch] = useState("");
  
  const [showDesc, setShowDesc] = useState(false);
  const [showServerMenu, setShowServerMenu] = useState(false);
  const dropdownRef = useRef(null);

  const sandboxKey = useMemo(() => detailItem ? `sandbox_${detailItem.id}_${playingSeason}_${playingEpisode}_${serverIdx}` : null, [detailItem, playingSeason, playingEpisode, serverIdx]);
  const [sandbox, setSandbox] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (sandboxKey) {
      const saved = localStorage.getItem(sandboxKey);
      if (saved !== null) setSandbox(JSON.parse(saved));
    }
  }, [sandboxKey]);

  useEffect(() => {
    if (sandboxKey) localStorage.setItem(sandboxKey, JSON.stringify(sandbox));
  }, [sandbox, sandboxKey]);

  useEffect(() => {
    if (servers[serverIdx]?.forceSandbox) setSandbox(true);
  }, [serverIdx]);

  useEffect(() => {
    setIframeKey(prev => prev + 1);
  }, [sandbox]);

  // --- UPDATED FULLSCREEN & IMMERSIVE MODE LOGIC ---
  useEffect(() => {
    const handleFullscreenChange = async () => {
      const isFullscreen = document.fullscreenElement || 
                           document.webkitFullscreenElement || 
                           document.mozFullScreenElement || 
                           document.msFullscreenElement;

      if (isFullscreen) {
        try {
          await ScreenOrientation.lock({ orientation: 'landscape' });
          await StatusBar.hide();
          await NavigationBar.hide(); 
        } catch (e) { console.error("Fullscreen Enter Error:", e); }
      } else {
        try {
          await ScreenOrientation.lock({ orientation: 'portrait' });
          await StatusBar.show();
          await NavigationBar.show(); 
        } catch (e) { console.error("Fullscreen Exit Error:", e); }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      
      ScreenOrientation.lock({ orientation: 'portrait' }).catch(() => {});
      StatusBar.show().catch(() => {});
      NavigationBar.show().catch(() => {});
    };
  }, []);

  // 🚀 NEW: KEEP ALIVE LOGIC (PREVENTS 30-SECOND APP RESET)
  useEffect(() => {
    if (!isPlayerOpen) return;

    const keepAlive = async () => {
      try {
        // Tells Android: "Do not kill this app, we are running a background task!"
        await BackgroundMode.enable();
      } catch (err) {
        console.log("Background mode error:", err);
      }
    };

    keepAlive();

    // Cleanup: Turn it off when the user closes the video to save battery
    return () => {
      BackgroundMode.disable().catch(() => {});
    };
  }, [isPlayerOpen]);

  // ESC key handler
  useEffect(() => {
    if (!isPlayerOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsPlayerOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isPlayerOpen, setIsPlayerOpen]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowServerMenu(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Data fetching
  useEffect(() => {
    if (!isPlayerOpen || !detailItem) return;
    
    let startSeason = 1;
    let startEpisode = 1;

    if (detailItem.badge_label && detailItem.badge_label.includes(':')) {
        const match = detailItem.badge_label.match(/S(\d+):E(\d+)/);
        if (match) {
            startSeason = parseInt(match[1]);
            startEpisode = parseInt(match[2]);
        }
    }
    
    setPlayingSeason(startSeason);
    setPlayingEpisode(startEpisode);
    setViewingSeason(startSeason); // Set initial viewed season to match playing season

    setShowDesc(false);
    setShowServerMenu(false);

    if (isTv) {
      fetchTMDB(`/tv/${detailItem.id}`).then(d => {
        setSeasons(d.seasons?.filter(s => s.season_number > 0) || []);
      });
      fetchTMDB(`/tv/${detailItem.id}/season/${startSeason}`).then(d => {
        setEpisodes(d.episodes || []);
        addToHistory(detailItem, startSeason, startEpisode);
      });
    } else {
        addToHistory(detailItem, null, null);
    }
  }, [isPlayerOpen, detailItem]);

  const fetchTMDB = async (endpoint) => {
      try {
        const res = await fetchData(endpoint); 
        return res;
      } catch(e) { return {}; }
  };

  // 🚀 REFACTOR: Only changes the grid, not the video
  const handleSeasonChange = async (newSeason) => {
    setViewingSeason(newSeason); 
    const d = await fetchData(`/tv/${detailItem.id}/season/${newSeason}`);
    setEpisodes(d.episodes || []);
  };

  // 🚀 REFACTOR: Changes the video when an episode is clicked
  const handleEpisodeChange = (newEp) => {
    setPlayingSeason(viewingSeason); // Sync playing season to what they are looking at
    setPlayingEpisode(newEp);
    addToHistory(detailItem, viewingSeason, newEp);
  };

  if (!isPlayerOpen || !detailItem) return null;

  // Use playingSeason and playingEpisode for the video frame
  const src = servers[serverIdx].getUrl(detailItem.id, type, playingSeason, playingEpisode);
  
  const filteredEpisodes = episodes.filter(ep => 
    !epSearch || 
    ep.episode_number.toString() === epSearch || 
    (ep.name && ep.name.toLowerCase().includes(epSearch.toLowerCase()))
  );

  // Helper to determine Series Status
  const getSeriesStatus = () => {
    if (!isTv) return 'Movie';
    const status = detailItem.status?.toLowerCase();
    if (status === 'ended' || status === 'canceled') return 'Ended';
    return 'Ongoing';
  };

  return (
    <div className="player-page-view active">
      <button className="close-player-btn" onClick={() => setIsPlayerOpen(false)}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      <div className="player-layout">
        {/* LEFT: VIDEO */}
        <div className="video-section">
          <div className="iframe-wrapper">
            <iframe
              key={iframeKey}
              id="overlay-video"
              src={src}
              allowFullScreen
              sandbox={sandbox ? "allow-scripts allow-same-origin allow-presentation allow-forms allow-popups allow-popups-to-escape-sandbox" : undefined}
            />
          </div>
        </div>

        {/* RIGHT: SIDEBAR */}
        <aside className="sidebar-section">
          <div className="sidebar-content">
            <h2 className="sidebar-title">{detailItem.title || detailItem.name}</h2>
            
            {/* 🚀 ADDED: Ongoing / Ended Status in Meta */}
            <div className="sidebar-meta">
                <span style={{ 
                    color: getSeriesStatus() === 'Ongoing' ? '#46d369' : '#ef4444', 
                    fontWeight: 'bold', border: '1px solid', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' 
                }}>
                    {getSeriesStatus().toUpperCase()}
                </span>
                <span>{detailItem.release_date?.split('-')[0] || detailItem.first_air_date?.split('-')[0] || 'N/A'}</span>
                <span className="dot"></span>
                <span>{detailItem.vote_average ? detailItem.vote_average.toFixed(1) : 'N/A'} <i className="fas fa-star" style={{color:'gold', fontSize:'0.7rem'}}></i></span>
            </div>

            <div className="description-box">
                <div className="desc-trigger" onClick={() => setShowDesc(!showDesc)}>
                    <span>Description</span>
                    <i className={`fas fa-chevron-down ${showDesc ? 'rotate' : ''}`}></i>
                </div>
                <div className={`desc-body ${showDesc ? 'open' : ''}`}>
                    <p>{detailItem.overview || "No synopsis available."}</p>
                    {detailItem.genres && (
                        <div className="genre-tags">
                            {detailItem.genres.map(g => <span key={g.id} className="tag">{g.name}</span>)}
                        </div>
                    )}
                </div>
            </div>

            <div className="controls-grid">
                {/* SERVER SELECTOR */}
                <div className="control-item" ref={dropdownRef}>
                  <label>Server</label>
                  <div className="custom-dropdown">
                    <button 
                        className={`dropdown-btn ${showServerMenu ? 'active' : ''}`} 
                        onClick={() => setShowServerMenu(!showServerMenu)}
                    >
                        <span>{servers[serverIdx].name}</span>
                        <i className={`fas fa-chevron-down ${showServerMenu ? 'rotate' : ''}`}></i>
                    </button>

                    <div className={`dropdown-menu ${showServerMenu ? 'show' : ''}`}>
                        <div className="dropdown-header-sandbox" onClick={(e) => e.stopPropagation()}>
                            <div className="sandbox-info">
                                <i className="fas fa-shield-alt"></i>
                                <span>Sandbox</span>
                            </div>
                            <label className="switch sm">
                                <input 
                                    type="checkbox" 
                                    checked={sandbox}
                                    disabled={servers[serverIdx].forceSandbox}
                                    onChange={() => setSandbox(!sandbox)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div className="server-list-scroll">
                            {servers.map((s, i) => (
                                <div 
                                    key={i} 
                                    className={`dropdown-item ${serverIdx === i ? 'selected' : ''}`}
                                    onClick={() => {
                                        setServerIdx(i);
                                        setShowServerMenu(false);
                                    }}
                                >
                                    {s.name}
                                    {s.forceSandbox && <span className="tag-forced">Ad-Block</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
                </div>

                {/* 🚀 REFACTOR: Uses viewingSeason instead of season */}
                {isTv && (
                    <div className="control-item">
                        <label>Season</label>
                        <select 
                            className="dark-select"
                            value={viewingSeason}
                            onChange={(e) => handleSeasonChange(+e.target.value)}
                        >
                            {seasons.map(s => <option key={s.id} value={s.season_number}>Season {s.season_number}</option>)}
                        </select>
                    </div>
                )}
            </div>

            {isTv && (
              <>
                <div className="control-item">
                    <label>Search Episode</label>
                    <input 
                        type="text" 
                        className="dark-input" 
                        placeholder="Episode number..."
                        value={epSearch}
                        onChange={(e) => setEpSearch(e.target.value)}
                    />
                </div>

                <div className="episode-header">
                    <span>Episodes ({filteredEpisodes.length})</span>
                </div>
                
                <div className="episode-grid">
                  {filteredEpisodes.length === 0 ? (
                    <div className="no-ep-msg">No episodes found</div>
                  ) : (
                    filteredEpisodes.map(ep => {
                      // 🚀 REFACTOR: Check if this exact season & episode is playing right now
                      const isPlaying = playingSeason === viewingSeason && playingEpisode === ep.episode_number;
                      
                      // 🚀 ADDED: Check if episode has aired
                      const isOut = ep.air_date ? new Date(ep.air_date) <= new Date() : false;

                      return (
                        <button
                          key={ep.id}
                          className={`ep-btn ${isPlaying ? "active" : ""}`}
                          onClick={() => handleEpisodeChange(ep.episode_number)}
                          title={ep.name}
                          style={{ position: 'relative' }} // For badge positioning
                        >
                          {ep.episode_number}
                          
                          {/* 🚀 ADDED: OUT Badge for newly aired episodes */}
                          {isOut && (
                              <span style={{
                                  position: 'absolute', top: '-4px', right: '-4px', 
                                  background: 'var(--accent-color)', color: '#fff', 
                                  fontSize: '0.5rem', padding: '2px 4px', 
                                  borderRadius: '4px', fontWeight: 'bold',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                              }}>
                                OUT
                              </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}