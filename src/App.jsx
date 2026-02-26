import React, { useLayoutEffect, useEffect, useCallback, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';
import { GlobalProvider, useGlobal } from './context/GlobalContext';

// Layout Imports
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import InfoModal from './components/Layout/InfoView';
import Loader from './components/Layout/Loader'; 

// Pages
import Home from './pages/Home';
import Live from './pages/Live';
import Explore from './pages/Explore';

// Components & Overlays
import DetailView from './components/Detail/DetailView';
import PlayerOverlay from './components/Detail/PlayerView';
import CategoryView from './components/Category/CategoryView';
import SearchModal from './components/Search/SearchModal';

import UpdateDialog from './components/UpdateDialog';

const AppContent = () => {
    const { 
        isOffline,
        currentView, 
        switchView,
        isPlayerOpen, setIsPlayerOpen,
        isDetailOpen, closeDetail,
        categoryModal, setCategoryModal,
        searchModalOpen, setSearchModalOpen,
        infoModalOpen, setInfoModalOpen
    } = useGlobal();

    // Track if we've already initialized to prevent double-calls
    const isInitializedRef = useRef(false);
    const lastViewRef = useRef(currentView);

    // === IMMERSIVE FULLSCREEN MODE using capgo-navigation-bar ===
    const enterImmersiveMode = useCallback(async () => {
        try {
            await NavigationBar.hide();
            await StatusBar.hide();
            
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) {
                await docEl.requestFullscreen();
            } else if (docEl.webkitRequestFullscreen) {
                await docEl.webkitRequestFullscreen();
            }

            if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape');
            }
        } catch (err) {
            console.log('Enter immersive error:', err);
        }
    }, []);

    const exitImmersiveMode = useCallback(async () => {
        try {
            await NavigationBar.show();
            await StatusBar.show();
            
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                await document.webkitExitFullscreen();
            }

            if (screen.orientation && screen.orientation.unlock) {
                screen.orientation.unlock();
            }
            
            await screen.orientation.lock('portrait').catch(() => {});
        } catch (err) {
            console.log('Exit immersive error:', err);
        }
    }, []);

    // === SAFE REFRESH - Only when needed, not on Alt+Tab ===
    const forcePortraitAndRefresh = useCallback(async (isFromVisibilityChange = false) => {
        // Skip aggressive refresh if coming from visibility change (Alt+Tab)
        if (isFromVisibilityChange) {
            await NavigationBar.show().catch(() => {});
            await StatusBar.show().catch(() => {});
            return;
        }

        await NavigationBar.show().catch(() => {});
        await StatusBar.show().catch(() => {});
        
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
        
        try {
            await screen.orientation.lock('portrait');
        } catch (e) {
            // Ignore lock errors
        }
        
        // Only scroll to top on actual view changes, not on every refresh
        if (lastViewRef.current !== currentView) {
            window.scrollTo(0, 0);
            lastViewRef.current = currentView;
        }
    }, [currentView]);

    // === FULLSCREEN CHANGE HANDLER ===
    useEffect(() => {
        const handleFullscreenChange = async () => {
            const isFullscreen = !!document.fullscreenElement;
            
            if (!isFullscreen) {
                await NavigationBar.show().catch(() => {});
                await StatusBar.show().catch(() => {});
                // Don't call forcePortraitAndRefresh here - let visibility handler deal with it
            } else {
                await NavigationBar.hide().catch(() => {});
                await StatusBar.hide().catch(() => {});
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        };
    }, []);

    // === VISIBILITY CHANGE HANDLER - Fixed for Alt+Tab ===
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Just ensure nav bars are visible, DON'T reset scroll or re-render
                NavigationBar.show().catch(() => {});
                StatusBar.show().catch(() => {});
                
                // Only force portrait if not in fullscreen
                if (!document.fullscreenElement) {
                    if (screen.orientation && screen.orientation.lock) {
                        screen.orientation.lock('portrait').catch(() => {});
                    }
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // === BACK BUTTON HANDLER ===
    useEffect(() => {
        const handleBackButton = async () => {
            if (document.fullscreenElement) {
                await exitImmersiveMode();
                return;
            }

            if (isPlayerOpen) {
                setIsPlayerOpen(false);
                // Only refresh layout, don't reset scroll
                await NavigationBar.show().catch(() => {});
                await StatusBar.show().catch(() => {});
                if (screen.orientation && screen.orientation.lock) {
                    await screen.orientation.lock('portrait').catch(() => {});
                }
                return;
            }

            if (isDetailOpen) {
                closeDetail();
                return;
            }

            if (categoryModal.isOpen) {
                setCategoryModal(prev => ({ ...prev, isOpen: false }));
                return;
            }

            if (searchModalOpen) {
                setSearchModalOpen(false);
                return;
            }

            if (infoModalOpen) {
                setInfoModalOpen(false);
                return;
            }

            if (currentView !== 'home') {
                switchView('home');
                return;
            }

            CapacitorApp.exitApp();
        };

        const backButtonListener = CapacitorApp.addListener('backButton', handleBackButton);

        return () => {
            backButtonListener.then(f => f.remove());
        };
    }, [
        isPlayerOpen, isDetailOpen, categoryModal.isOpen, 
        searchModalOpen, infoModalOpen, currentView,
        setIsPlayerOpen, closeDetail, setCategoryModal, 
        setSearchModalOpen, setInfoModalOpen, switchView,
        exitImmersiveMode
    ]);

    // === NAVIGATION CLICK HANDLER ===
    const handleNavClick = async (view) => {
        if (document.fullscreenElement) {
            await exitImmersiveMode();
        }
        
        // Update ref before switch
        lastViewRef.current = view;
        
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        switchView(view); 
        setTimeout(() => document.documentElement.style.scrollBehavior = '', 50);
    };

    useLayoutEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        // Only scroll to top on initial mount or actual view change
        if (!isInitializedRef.current) {
            window.scrollTo(0, 0);
            isInitializedRef.current = true;
        }
    }, []);

    // Only run this on actual view changes, not on every render
    useEffect(() => {
        if (!document.fullscreenElement && isInitializedRef.current) {
            forcePortraitAndRefresh(false);
        }
    }, [currentView, forcePortraitAndRefresh]);

    // === EXPOSE FULLSCREEN FUNCTIONS TO WINDOW ===
    useEffect(() => {
        window.enterAppFullscreen = enterImmersiveMode;
        window.exitAppFullscreen = exitImmersiveMode;
    }, [enterImmersiveMode, exitImmersiveMode]);

    // === INITIAL SETUP ===
    useEffect(() => {
        NavigationBar.show().catch(() => {});
        StatusBar.show().catch(() => {});
        isInitializedRef.current = true;
    }, []);

    const isHomeActive = currentView === 'home';
    const isExploreActive = currentView === 'explore';
    const isLiveActive = currentView === 'live';

    return (
        <>
            <Loader />
            <Sidebar />
            <Navbar />

            {isOffline ? (
                <div style={{
                    height: '100vh',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    justifyContent: 'center', textAlign: 'center', padding: '20px',
                    paddingBottom: 'var(--bottom-nav-height)'
                }}>
                    <i className="fa-solid fa-wifi" style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '20px', position: 'relative' }}>
                        <div style={{ position: 'absolute', width: '120%', height: '6px', background: 'var(--bg-color, #0a0a0a)', borderTop: '2px solid #ef4444', top: '50%', left: '-10%', transform: 'rotate(-45deg)' }}></div>
                    </i>
                    <h2 style={{ color: '#fff', marginBottom: '10px', fontSize: '1.5rem', letterSpacing: '1px' }}>SYSTEM OFFLINE</h2>
                    <p style={{ color: '#aaa', fontSize: '0.95rem', maxWidth: '300px' }}>Check your network connection to synchronize with the server.</p>
                </div>
            ) : (
                <>
                    <div style={{ display: currentView === 'home' ? 'block' : 'none' }}><Home /></div>
                    <div style={{ display: currentView === 'explore' ? 'block' : 'none' }}><Explore /></div>
                    <div style={{ display: currentView === 'live' ? 'block' : 'none' }}><Live /></div>
                    
                    <DetailView />
                    <PlayerOverlay />
                    <CategoryView />
                    <SearchModal />
                </>
            )}

            <InfoModal />
            <UpdateDialog />
            
            <div className="bottom-nav">
                <div className={`nav-item ${isHomeActive ? 'active' : ''}`} onClick={() => handleNavClick('home')}>
                    <i className="fa-solid fa-house"></i><span>Home</span>
                </div>
                <div className={`nav-item ${isExploreActive ? 'active' : ''}`} onClick={() => handleNavClick('explore')}>
                    <i className="fa-regular fa-compass"></i><span>Explore</span>
                </div>
                <div className={`nav-item ${isLiveActive ? 'active' : ''}`} onClick={() => handleNavClick('live')}>
                    <i className="fa-solid fa-tv"></i><span>Live TV</span>
                </div>
            </div>
        </>
    );
};

const App = () => <GlobalProvider><AppContent /></GlobalProvider>;

export default App;