import React, { useLayoutEffect, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app'; // 1. Import Capacitor App
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

// === 1. IMPORT THE DIALOG ===
import UpdateDialog from './components/UpdateDialog';

const AppContent = () => {
    // 2. Expand destructuring to get all modal states AND isOffline
    const { 
        isOffline, // <--- ADDED OFFLINE STATE HERE
        currentView, 
        switchView,
        // Modal States for Back Button Logic
        isPlayerOpen, setIsPlayerOpen,
        isDetailOpen, closeDetail,
        categoryModal, setCategoryModal,
        searchModalOpen, setSearchModalOpen,
        infoModalOpen, setInfoModalOpen
    } = useGlobal();

    // 3. Add the Back Button Listener
    useEffect(() => {
        const handleBackButton = async () => {
            // Priority 1: Close Player if open
            if (isPlayerOpen) {
                setIsPlayerOpen(false);
                return;
            }

            // Priority 2: Close Detail View if open
            if (isDetailOpen) {
                closeDetail();
                return;
            }

            // Priority 3: Close Category View if open
            if (categoryModal.isOpen) {
                setCategoryModal(prev => ({ ...prev, isOpen: false }));
                return;
            }

            // Priority 4: Close Search Modal if open
            if (searchModalOpen) {
                setSearchModalOpen(false);
                return;
            }

            // Priority 5: Close Info/Settings Modal if open
            if (infoModalOpen) {
                setInfoModalOpen(false);
                return;
            }

            // Priority 6: Navigation Logic
            // If user is on 'Explore' or 'Live', go back to 'Home' first
            if (currentView !== 'home') {
                switchView('home');
                return;
            }

            // Priority 7: If on Home and no modals open, Exit App
            CapacitorApp.exitApp();
        };

        const backButtonListener = CapacitorApp.addListener('backButton', handleBackButton);

        // Cleanup listener on unmount
        return () => {
            backButtonListener.then(f => f.remove());
        };
    }, [
        isPlayerOpen, 
        isDetailOpen, 
        categoryModal.isOpen, 
        searchModalOpen, 
        infoModalOpen, 
        currentView, // Added currentView dependency
        setIsPlayerOpen, 
        closeDetail, 
        setCategoryModal, 
        setSearchModalOpen, 
        setInfoModalOpen, 
        switchView
    ]);

    const handleNavClick = (view) => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        switchView(view); 
        setTimeout(() => document.documentElement.style.scrollBehavior = '', 50);
    };

    useLayoutEffect(() => {
        if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
        window.scrollTo(0, 0);
    }, [currentView]);

    const isHomeActive = currentView === 'home';
    const isExploreActive = currentView === 'explore';
    const isLiveActive = currentView === 'live';

    return (
        <>
            {/* NEW LOADER COMPONENT */}
            <Loader />
            
            <Sidebar />
            <Navbar />

            {/* === CONDITIONAL CONTENT RENDER === */}
            {isOffline ? (
                // 1. IF OFFLINE: Show the offline UI in the middle of the screen
                <div style={{
                    height: '100vh',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', 
                    justifyContent: 'center', textAlign: 'center', padding: '20px',
                    paddingBottom: 'var(--bottom-nav-height)' // Prevents overlapping with bottom nav
                }}>
                    <i className="fa-solid fa-wifi" style={{ fontSize: '4rem', color: '#ef4444', marginBottom: '20px', position: 'relative' }}>
                        <div style={{ position: 'absolute', width: '120%', height: '6px', background: 'var(--bg-color, #0a0a0a)', borderTop: '2px solid #ef4444', top: '50%', left: '-10%', transform: 'rotate(-45deg)' }}></div>
                    </i>
                    <h2 style={{ color: '#fff', marginBottom: '10px', fontSize: '1.5rem', letterSpacing: '1px' }}>SYSTEM OFFLINE</h2>
                    <p style={{ color: '#aaa', fontSize: '0.95rem', maxWidth: '300px' }}>Check your network connection to synchronize with the server.</p>
                </div>
            ) : (
                // 2. IF ONLINE: Render the pages and modals normally
                <>
                    {/* MAIN PAGES */}
                    <div style={{ display: currentView === 'home' ? 'block' : 'none' }}><Home /></div>
                    <div style={{ display: currentView === 'explore' ? 'block' : 'none' }}><Explore /></div>
                    <div style={{ display: currentView === 'live' ? 'block' : 'none' }}><Live /></div>
                    
                    {/* OVERLAYS & MODALS */}
                    <DetailView />
                    <PlayerOverlay />
                    <CategoryView />
                    <SearchModal />
                </>
            )}

            {/* These stay outside so they can still be clicked/viewed while offline */}
            <InfoModal />
            <UpdateDialog />
            
            {/* MOBILE BOTTOM NAV - Always visible! */}
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