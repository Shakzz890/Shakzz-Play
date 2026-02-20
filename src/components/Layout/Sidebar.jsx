import React from 'react';
import { useGlobal } from '../../context/GlobalContext';

const Sidebar = () => {
    const { 
        isSidebarOpen, 
        toggleSidebar, 
        switchView, 
        currentView, 
        searchModal, // <-- Added this
        setInfoModal, 
        setSearchModal 
    } = useGlobal();

    // --- HIGHLIGHT LOGIC ---
    const isExploreOpen = searchModal.isOpen && searchModal.mode === 'explore';
    const isHomeActive = currentView === 'home' && !isExploreOpen;
    const isLiveActive = currentView === 'live' && !isExploreOpen;

    return (
        <>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="main-sidebar">
                <div className="sidebar-header">
                    <img src="/logo.png" alt="Shakzz TV" className="sidebar-logo" onError={(e)=>e.target.style.display='none'}/>
                    <span className="logo-text">SHAKZZ<span style={{color:'#e50914'}}>TV</span></span>
                    <span className="close-sidebar" onClick={toggleSidebar}>×</span>
                </div>
                <div className="sidebar-menu">
                    <a 
                        href="#" 
                        className={`sidebar-link ${isHomeActive ? 'active' : ''}`} 
                        onClick={() => switchView('home')}
                    >
                        <i className="fa-solid fa-house"></i> Home
                    </a>
                    <a 
                        href="#" 
                        className={`sidebar-link ${isExploreOpen ? 'active' : ''}`} 
                        onClick={() => { setSearchModal({isOpen: true, mode: 'explore'}); toggleSidebar(); }}
                    >
                        <i className="fa-regular fa-compass"></i> Explore
                    </a>
                    <a 
                        href="#" 
                        className={`sidebar-link ${isLiveActive ? 'active' : ''}`} 
                        onClick={() => switchView('live')}
                    >
                        <i className="fa-solid fa-tv"></i> Live TV
                    </a>
                    <a 
                        href="#" 
                        className="sidebar-link" 
                        onClick={() => { setInfoModal({isOpen: true, type: 'updates'}); toggleSidebar(); }}
                    >
                        <i className="fa-solid fa-bell"></i> Updates
                    </a>
                    <a 
                        href="#" 
                        className="sidebar-link" 
                        onClick={() => { setInfoModal({isOpen: true, type: 'contact'}); toggleSidebar(); }}
                    >
                        <i className="fa-solid fa-envelope"></i> Contact
                    </a>
                </div>
                <div className="sidebar-footer">
                    <p>Shakzz TV © 2026</p>
                </div>
            </div>
            <div className={`overlay ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
        </>
    );
};
export default Sidebar;
