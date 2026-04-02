// src/App.jsx
import React, { useLayoutEffect, useEffect, useCallback, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';
import { SplashScreen } from '@capacitor/splash-screen'; 
import { GlobalProvider, useGlobal } from './context/GlobalContext';

// --- NEW: IMPORT NORIGIN SPATIAL NAVIGATION ---
import { init, useFocusable } from '@noriginmedia/norigin-spatial-navigation';

// Input Manager for TV/Desktop Navigation
import { InputProvider, useInput } from './utils/InputManager';

// Layout Imports
import Navbar from './components/Layout/Navbar';
import InfoModal from './components/Layout/InfoView';

// Pages
import Home from './pages/Home';
import Live from './pages/Live';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import History from './pages/History'; 
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';

// Components & Overlays
import DetailView from './components/Detail/DetailView';
import PlayerOverlay from './components/Detail/PlayerView';
import CategoryView from './components/Category/CategoryView';
import SearchModal from './components/Search/SearchModal';
import UpdateDialog from './components/UpdateDialog';

// ==========================================================================
// 🚀 INITIALIZE THE SPATIAL NAVIGATION ENGINE
// ==========================================================================
init({
    debug: false,
    visualDebug: false, 
    distanceCalculationMethod: 'corners'
});

// ==========================================================================
// 🚀 SMART NAV ITEM COMPONENT
// ==========================================================================
const SmartNavItem = ({ item, isActive, onAction, isTV }) => {
    const { ref, focused, setFocus } = useFocusable({
        onEnterPress: () => onAction(item),
        focusKey: `nav-${item.id}` 
    });

    return (
        <div
            ref={ref}
            className={`nav-item ${isActive ? 'active' : ''} ${focused ? 'tv-focused' : ''}`}
            onPointerDown={(e) => {
                e.preventDefault(); 
                e.stopPropagation();
                if (isTV) { setFocus(); }
                onAction(item); 
            }}
            onClick={(e) => e.stopPropagation()}
            role="tab"
            aria-selected={isActive}
            aria-label={item.label}
            style={{ cursor: 'pointer', zIndex: 9999, position: 'relative' }}
        >
            <div className="icon-container">
                <i className={`fa-solid ${item.icon}`} aria-hidden="true"></i>
            </div>
            <span>{item.label}</span>
            {isTV && focused && (
                <span className="nav-hint" style={{position: 'absolute', top: '-20px', fontSize: '10px', background: 'var(--accent-color)', padding: '2px 6px', borderRadius: '4px', color: '#fff'}}>OK</span>
            )}
        </div>
    );
};

const AppContent = () => {
    const { 
        isOffline,
        currentView, 
        switchView,
        toggleSidebar, 
        isPlayerOpen, setIsPlayerOpen,
        isDetailOpen, closeDetail,
        categoryModal, setCategoryModal,
        searchModalOpen, setSearchModalOpen,
        infoModalOpen, setInfoModalOpen,
        triggerGlobalRefresh // 🚀 PULLING GLOBAL TRIGGER
    } = useGlobal();

    const { platform, goBack, containerRef } = useInput();

    const { focusKey, focusSelf, setFocus } = useFocusable({
        trackChildren: true,
        autoRestoreFocus: true,
        isFocusBoundary: false
    });

    const isInitializedRef = useRef(false);
    const lastViewRef = useRef(currentView);

    // 🚀 GLOBAL REFRESH PHYSICS STATE
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const touchStartY = useRef(0);

    // === STARTUP ===
    useEffect(() => {
        SplashScreen.hide().catch(() => {});
        const startupAudio = new Audio('/assets/sounds/system_open.mp3');
        startupAudio.volume = 0.5;

        startupAudio.play().catch((err) => {
            const playOnFirstTap = () => {
                startupAudio.play().catch(() => {});
                document.removeEventListener('touchstart', playOnFirstTap);
                document.removeEventListener('mousedown', playOnFirstTap);
            };
            document.addEventListener('touchstart', playOnFirstTap, { once: true });
            document.addEventListener('mousedown', playOnFirstTap, { once: true });
        });

        return () => startupAudio.pause();
    }, []);
    
    const navItems = [
        { id: 'home', label: 'Home', icon: 'fa-house', view: 'home' },
        { id: 'explore', label: 'Explore', icon: 'fa-compass', view: 'explore' },
        { id: 'live', label: 'Live TV', icon: 'fa-tv', view: 'live' },
        { id: 'profile', label: 'Profile', icon: 'fa-user', view: 'profile' },
    ];

    // === IMMERSIVE FULLSCREEN MODE ===
    const enterImmersiveMode = useCallback(async () => {
        try {
            await NavigationBar.hide();
            await StatusBar.hide();
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) { await docEl.requestFullscreen(); } 
            else if (docEl.webkitRequestFullscreen) { await docEl.webkitRequestFullscreen(); }
            if (screen.orientation && screen.orientation.lock) { await screen.orientation.lock('landscape'); }
        } catch (err) {}
    }, []);

    const exitImmersiveMode = useCallback(async () => {
        try {
            await NavigationBar.show();
            await StatusBar.show();
            if (document.exitFullscreen) { await document.exitFullscreen(); } 
            else if (document.webkitExitFullscreen) { await document.webkitExitFullscreen(); }
            if (screen.orientation && screen.orientation.unlock) { screen.orientation.unlock(); }
            await screen.orientation.lock('portrait').catch(() => {});
        } catch (err) {}
    }, []);

    const forcePortraitAndRefresh = useCallback(async (isFromVisibilityChange = false) => {
        if (isFromVisibilityChange) {
            await NavigationBar.show().catch(() => {});
            await StatusBar.show().catch(() => {});
            return;
        }
        await NavigationBar.show().catch(() => {});
        await StatusBar.show().catch(() => {});
        if (screen.orientation && screen.orientation.unlock) { screen.orientation.unlock(); }
        try { await screen.orientation.lock('portrait'); } catch (e) {}
        if (lastViewRef.current !== currentView) {
            window.scrollTo(0, 0);
            lastViewRef.current = currentView;
        }
    }, [currentView]);

    useEffect(() => {
        const handleFullscreenChange = async () => {
            const isFullscreen = !!document.fullscreenElement;
            if (!isFullscreen) {
                await NavigationBar.show().catch(() => {});
                await StatusBar.show().catch(() => {});
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

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                NavigationBar.show().catch(() => {});
                StatusBar.show().catch(() => {});
                if (!document.fullscreenElement && screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('portrait').catch(() => {});
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    useEffect(() => {
        const handleTVBack = async (e) => {
            if (document.fullscreenElement) { await exitImmersiveMode(); return; }
            if (isPlayerOpen) {
                setIsPlayerOpen(false);
                await NavigationBar.show().catch(() => {});
                await StatusBar.show().catch(() => {});
                if (screen.orientation && screen.orientation.lock) { await screen.orientation.lock('portrait').catch(() => {}); }
                focusSelf();
                return;
            }
            if (isDetailOpen) { closeDetail(); focusSelf(); return; }
            if (categoryModal.isOpen) { setCategoryModal(prev => ({ ...prev, isOpen: false })); focusSelf(); return; }
            if (searchModalOpen) { setSearchModalOpen(false); focusSelf(); return; }
            if (infoModalOpen) { setInfoModalOpen(false); focusSelf(); return; }

            const wentBack = goBack();
            if (!wentBack && currentView !== 'home') {
                switchView('home');
                setFocus('nav-home'); 
            }
        };
        window.addEventListener('tv-back', handleTVBack);
        return () => window.removeEventListener('tv-back', handleTVBack);
    }, [isPlayerOpen, isDetailOpen, categoryModal.isOpen, searchModalOpen, infoModalOpen, currentView, setIsPlayerOpen, closeDetail, setCategoryModal, setSearchModalOpen, setInfoModalOpen, switchView, exitImmersiveMode, goBack, focusSelf, setFocus]);

    useEffect(() => {
        const handleBackButton = async () => {
            if (platform.isTV) return; 
            if (document.fullscreenElement) { await exitImmersiveMode(); return; }
            if (isPlayerOpen) {
                setIsPlayerOpen(false);
                await NavigationBar.show().catch(() => {});
                await StatusBar.show().catch(() => {});
                if (screen.orientation && screen.orientation.lock) { await screen.orientation.lock('portrait').catch(() => {}); }
                return;
            }
            if (isDetailOpen) { closeDetail(); return; }
            if (categoryModal.isOpen) { setCategoryModal(prev => ({ ...prev, isOpen: false })); return; }
            if (searchModalOpen) { setSearchModalOpen(false); return; }
            if (infoModalOpen) { setInfoModalOpen(false); return; }
            if (currentView !== 'home') { switchView('home'); return; }
            CapacitorApp.exitApp();
        };
        const backButtonListener = CapacitorApp.addListener('backButton', handleBackButton);
        return () => { backButtonListener.then(f => f.remove()); };
    }, [isPlayerOpen, isDetailOpen, categoryModal.isOpen, searchModalOpen, infoModalOpen, currentView, platform.isTV, setIsPlayerOpen, closeDetail, setCategoryModal, setSearchModalOpen, setInfoModalOpen, switchView, exitImmersiveMode]);

    const handleNavClick = useCallback(async (item) => {
        if (item.action === 'menu') { toggleSidebar(); return; }
        if (document.fullscreenElement) { await exitImmersiveMode(); }
        lastViewRef.current = item.view;
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        switchView(item.view); 
        setTimeout(() => document.documentElement.style.scrollBehavior = '', 50);
    }, [exitImmersiveMode, switchView, toggleSidebar]);

    useLayoutEffect(() => {
        if ('scrollRestoration' in window.history) { window.history.scrollRestoration = 'manual'; }
        if (!isInitializedRef.current) {
            window.scrollTo(0, 0);
            isInitializedRef.current = true;
        }
    }, []);

    useEffect(() => {
        if (platform.isTV || platform.isDesktop) {
            focusSelf();
            setTimeout(() => setFocus(`nav-${currentView}`), 500);
        }
    }, [platform.isTV, platform.isDesktop, focusSelf, setFocus, currentView]);

    useEffect(() => {
        if (!document.fullscreenElement && isInitializedRef.current) { forcePortraitAndRefresh(false); }
    }, [currentView, forcePortraitAndRefresh]);

    useEffect(() => {
        window.enterAppFullscreen = enterImmersiveMode;
        window.exitAppFullscreen = exitImmersiveMode;
    }, [enterImmersiveMode, exitImmersiveMode]);

    useEffect(() => {
        NavigationBar.show().catch(() => {});
        StatusBar.show().catch(() => {});
        isInitializedRef.current = true;
    }, []);

    // ==========================================================================
    // 🚀 GLOBAL PULL-TO-REFRESH PHYSICS
    // ==========================================================================
    const handleTouchStart = (e) => {
        if (window.scrollY <= 5) {
            touchStartY.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e) => {
        if (touchStartY.current > 0) {
            const currentY = e.touches[0].clientY;
            const distance = currentY - touchStartY.current;
            if (distance > 0) {
                setPullDistance(Math.min(distance * 0.45, 130)); 
            }
        }
    };

    const handleTouchEnd = async () => {
        if (pullDistance > 80) { 
            setIsRefreshing(true);
            setPullDistance(100); 
            
            triggerGlobalRefresh(); // Tell active views to fetch data
            
            // Artificial delay to let the animation play out while fetching starts
            await new Promise(res => setTimeout(res, 1200)); 
            
            setIsRefreshing(false);
            setPullDistance(0); 
        } else {
            setPullDistance(0); 
        }
        touchStartY.current = 0;
    };

    return (
        <div 
            ref={containerRef}
            className={`app-container ${platform.isTV ? 'tv-mode' : ''} ${platform.isDesktop ? 'desktop-mode' : ''}`}
            style={{ width: '100%', height: '100%', outline: 'none' }}
            tabIndex="-1"
            onTouchStart={handleTouchStart} 
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* 🔄 THE GLOBAL YOUTUBE REFRESH BUBBLE */}
            <div style={{
                position: 'fixed',
                top: -50,
                left: '50%',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#fff',
                boxShadow: '0 3px 12px rgba(0,0,0,0.4)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 999999, // Ensure it's above everything
                transform: `translate(-50%, ${isRefreshing ? 120 : pullDistance}px) rotate(${pullDistance * 3}deg)`,
                transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
                opacity: pullDistance > 10 || isRefreshing ? 1 : 0
            }}>
                <i 
                    className={`fa-solid ${isRefreshing ? 'fa-spinner fa-spin' : 'fa-arrow-down'}`} 
                    style={{ fontSize: '1.2rem', color: isRefreshing ? 'var(--accent-color)' : '#333' }}
                ></i>
            </div>

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
                    <p style={{ color: '#aaa', fontSize: '0.95rem', maxWidth: '300px', marginBottom: '30px' }}>Check your network connection to synchronize with the server.</p>
                    
                    {/* 🚀 MANUAL RETRY BUTTON */}
                    <button 
                        onClick={() => {
                            if (navigator.onLine) { triggerGlobalRefresh(); }
                        }}
                        style={{
                            padding: '12px 24px', background: 'var(--accent-color)', color: '#fff', 
                            border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        <i className="fa-solid fa-rotate-right" style={{marginRight: '8px'}}></i> Retry Connection
                    </button>
                </div>
            ) : (
                <>
                    <main className="main-content" style={{ display: currentView === 'home' ? 'block' : 'none' }}>
                        <Home />
                    </main>
                    <main className="main-content" style={{ display: currentView === 'explore' ? 'block' : 'none' }}>
                        <Explore />
                    </main>
                    <main className="main-content" style={{ display: currentView === 'live' ? 'block' : 'none' }}>
                        <Live />
                    </main>
                    <main className="main-content" style={{ display: currentView === 'profile' ? 'block' : 'none' }}>
                        <Profile />
                    </main>
                    <main className="main-content" style={{ display: currentView === 'history' ? 'block' : 'none' }}>
                        <History />
                    </main>
                    <main className="main-content" style={{ display: currentView === 'favorites' ? 'block' : 'none' }}>
                        <Favorites />
                    </main>
                    <main className="main-content" style={{ display: currentView === 'settings' ? 'block' : 'none' }}>
                        <Settings />
                    </main>
                    
                    <DetailView />
                    <PlayerOverlay />
                    <CategoryView />
                    <SearchModal />
                </>
            )}

            <InfoModal />
            <UpdateDialog />
            
            <nav className="bottom-nav" role="tablist" aria-label="Main Navigation">
                {navItems.map((item) => (
                    <SmartNavItem 
                        key={item.id}
                        item={item} 
                        isActive={item.view ? currentView === item.view : false} 
                        onAction={handleNavClick}
                        isTV={platform.isTV}
                    />
                ))}
            </nav>
        </div>
    );
};

const App = () => (
    <GlobalProvider>
        <InputProvider>
            <AppContent />
        </InputProvider>
    </GlobalProvider>
);

export default App;