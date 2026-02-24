import React from 'react';
import { useGlobal } from '../../context/GlobalContext';
import FocusWrapper from '../FocusWrapper'; 

const BottomNav = () => {
    const { currentView, switchView, toggleSidebar } = useGlobal();

    const handleNavClick = (view) => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        switchView(view);
        setTimeout(() => document.documentElement.style.scrollBehavior = '', 50);
    };

    const isHomeActive = currentView === 'home';
    const isExploreActive = currentView === 'explore';
    const isLiveActive = currentView === 'live';

    return (
        <div className="bottom-nav-telegram">
            <FocusWrapper 
                className={`nav-item ${isHomeActive ? 'active' : ''}`} 
                onClick={() => handleNavClick('home')}
            >
                <div className="icon-container">
                    <i className="fa-solid fa-house"></i>
                </div>
                <span>Home</span>
            </FocusWrapper>
            
            <FocusWrapper 
                className={`nav-item ${isExploreActive ? 'active' : ''}`} 
                onClick={() => handleNavClick('explore')}
            >
                <div className="icon-container">
                    <i className="fa-regular fa-compass"></i>
                </div>
                <span>Explore</span>
            </FocusWrapper>
            
            <FocusWrapper 
                className={`nav-item ${isLiveActive ? 'active' : ''}`} 
                onClick={() => handleNavClick('live')}
            >
                <div className="icon-container">
                    <i className="fa-solid fa-tv"></i>
                </div>
                <span>Live TV</span>
            </FocusWrapper>

            <FocusWrapper 
                className="nav-item" 
                onClick={toggleSidebar}
            >
                <div className="icon-container">
                    <i className="fa-solid fa-bars"></i>
                </div>
                <span>Menu</span>
            </FocusWrapper>
        </div>
    );
};

export default BottomNav;