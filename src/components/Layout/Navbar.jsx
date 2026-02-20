import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';

const Navbar = () => {
    const { 
        toggleSidebar, 
        switchView, 
        currentView, 
        searchModal, 
        setSearchModal, 
        user, 
        loginGoogle, 
        loginGithub, 
        doLogout, 
        categoryModal, 
        setCategoryModal,
        setInfoModal,
        isDetailOpen,
        setDetailItem,
        isPlayerOpen,
        setIsPlayerOpen,
        infoModal 
    } = useGlobal();

    const [authDropdown, setAuthDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // FIXED: Handle Scroll Transparency - restored working logic
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        // Check initial state
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // --- THE FIX: RESET EVERYTHING ON LOGO CLICK ---
    const handleHomeReset = () => {
        switchView('home');

        if (categoryModal.isOpen) {
            setCategoryModal({ isOpen: false, title: '', listType: '' });
        }

        if (isDetailOpen && setDetailItem) {
            setDetailItem(null);
        }

        if (isPlayerOpen && setIsPlayerOpen) {
            setIsPlayerOpen(false);
        }

        if (searchModal.isOpen) {
            setSearchModal(prev => ({ ...prev, isOpen: false }));
        }

        if (infoModal.isOpen) {
            setInfoModal({ isOpen: false, type: '' });
        }

        const homeView = document.getElementById('home-view');
        if (homeView) {
            homeView.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const openUserList = (type) => {
        setCategoryModal({ isOpen: true, title: type === 'watchlist' ? 'My Favorites' : 'Watch History', listType: type });
        setAuthDropdown(false);
    };

    const isExploreOpen = searchModal.isOpen && searchModal.mode === 'explore';
    const isHomeActive = currentView === 'home' && !isExploreOpen;
    const isLiveActive = currentView === 'live' && !isExploreOpen;

    const isSolid = currentView !== 'home' || scrolled || isExploreOpen || isDetailOpen || isPlayerOpen || infoModal.isOpen || categoryModal.isOpen;

    return (
        <div className={`navbar ${isSolid ? 'solid-nav' : ''}`}>
            <div className="nav-left">
                <div className="hamburger" onClick={toggleSidebar}>
                    <i className="fa-solid fa-bars"></i>
                </div>
                
                <div 
                    className="logo-text" 
                    style={{ 
                        fontFamily: "'Outfit', sans-serif", 
                        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' 
                    }} 
                    onClick={handleHomeReset}
                >
                    <div style={{
                        width: '32px', height: '32px',
                        background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--accent-dark) 100%)',
                        borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)', border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <i className="fa-solid fa-play" style={{ color: '#fff', fontSize: '12px' }}></i>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                        <span style={{ 
                            color: '#fff', fontWeight: '900', fontSize: '1.3rem', letterSpacing: '1px',
                            textShadow: '0 0 15px rgba(168, 85, 247, 0.5)' 
                        }}>SHAKZZ</span>
                        <span style={{ 
                            color: 'var(--accent-color)', fontSize: '0.65rem', fontWeight: '700', 
                            letterSpacing: '2px', textTransform: 'uppercase'
                        }}>Play</span>
                    </div>
                </div>

                <ul className="desktop-menu">
                    <li><a href="#" className={`nav-link ${isHomeActive ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); handleHomeReset(); }}>Home</a></li>
                    <li><a href="#" className={`nav-link ${isLiveActive ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); switchView('live'); }}>Live TV</a></li>
                    <li><a href="#" className={`nav-link ${isExploreOpen ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setSearchModal({isOpen: true, mode: 'explore'}); }}>Explore</a></li>
                    <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setInfoModal({isOpen: true, type: 'updates'}); }}>Updates</a></li>
                </ul>
            </div>

            <div className="nav-right">
                <div className="search-trigger" onClick={() => setSearchModal({isOpen: true, mode: 'search'})}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div className="auth-wrapper">
                    {!user ? (
                        <div id="logged-out-state">
                            <button className="login-btn" onClick={() => setAuthDropdown(!authDropdown)}>
                                <i className="fa-regular fa-user"></i> <span>Sign In</span>
                            </button>
                            {authDropdown && (
                                <div className="auth-dropdown show" id="login-dropdown">
                                    <div className="dropdown-header">Sign in to save your watch history.</div>
                                    <div className="social-item" onClick={loginGoogle}><i className="fa-brands fa-google" style={{color:'#DB4437'}}></i> Google</div>
                                    <div className="social-item" onClick={loginGithub}><i className="fa-brands fa-github" style={{color:'#fff'}}></i> Github</div>
                                    <div style={{borderTop: '1px solid #333', margin: '5px 0'}}></div>
                                    <div className="dropdown-footer" style={{fontSize: '0.8rem', color: '#aaa', textAlign: 'center', padding: '5px'}}>More coming soon...</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div id="logged-in-state">
                            <img src={user.photoURL || "https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg "} alt="Profile" className="nav-avatar" onClick={() => setAuthDropdown(!authDropdown)} />
                            {authDropdown && (
                                <div className="auth-dropdown show" id="profile-dropdown">
                                    <div className="user-info-box">
                                        <img src={user.photoURL} className="menu-avatar" alt="User" />
                                        <div className="user-text"><span className="user-name">{user.displayName}</span></div>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <div className="menu-item" onClick={() => openUserList('history')}><i className="fa-solid fa-clock-rotate-left"></i> History list</div>
                                    <div className="menu-item" onClick={() => openUserList('watchlist')}><i className="fa-regular fa-heart"></i> Favorite list</div>
                                    <div className="menu-item logout" onClick={doLogout}><i className="fa-solid fa-power-off"></i> Sign out</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Navbar;