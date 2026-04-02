import React, { useRef } from 'react';
import { useGlobal } from '../context/GlobalContext';

const Profile = () => {
    // Added loginGithub and switchView
    const { user, loginGoogle, loginGithub, doLogout, showToast, switchView } = useGlobal();
    const fileInputRef = useRef(null);

    // Triggers the hidden file input
    const handleEditPictureClick = () => {
        fileInputRef.current.click();
    };

    // Handles the file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // TODO: Add Firebase Storage upload logic here
        showToast("Picture selected! Ready for upload.", "success");
        console.log("Selected file:", file.name);
    };

    // ==========================================
    // GUEST STATE (NOT LOGGED IN)
    // ==========================================
    if (!user) {
        return (
            <div id="profile-view">
                <div className="profile-guest-state">
                    <i className="fa-solid fa-user-circle profile-guest-icon"></i>
                    <h2 className="profile-guest-title">Sign in to Shakzz Play</h2>
                    <p className="profile-guest-desc">Save your favorites, continue watching where you left off, and personalize your experience.</p>
                    
                    {/* Google Button */}
                    <button className="play-btn-primary" onClick={loginGoogle} style={{ width: '100%', maxWidth: '300px', marginBottom: '12px' }}>
                        <i className="fa-brands fa-google"></i> Continue with Google
                    </button>

                    {/* GitHub Button */}
                    <button 
                        className="play-btn-secondary" 
                        onClick={loginGithub} 
                        style={{ 
                            width: '100%', 
                            maxWidth: '300px', 
                            backgroundColor: '#24292e', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            gap: '8px', 
                            margin: '0 auto' 
                        }}
                    >
                        <i className="fa-brands fa-github" style={{ fontSize: '1.2rem' }}></i> Continue with GitHub
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // AUTHENTICATED STATE (LOGGED IN)
    // ==========================================
    return (
        <div id="profile-view">
            <div className="profile-header-centered">
                <div className="avatar-edit-wrapper">
                    <img 
                        src={user?.photoURL || "https://ui-avatars.com/api/?name=" + (user?.displayName || "User") + "&background=a855f7&color=fff"} 
                        alt="Profile" 
                        className="profile-avatar-large"
                    />
                    <div className="avatar-edit-btn" onClick={handleEditPictureClick}>
                        <i className="fa-solid fa-camera"></i>
                    </div>
                    {/* Hidden File Input */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                    />
                </div>
                <h2 className="profile-name">{user?.displayName || "Shadow Monarch"}</h2>
                <p className="profile-email">{user?.email || "user@shakzz.play"}</p>
            </div>

            <div className="profile-menu-list">
                {/* Watch History */}
                <div className="profile-menu-item" onClick={() => switchView('history')}>
                    <div className="profile-menu-item-left">
                        <i className="fa-solid fa-clock-rotate-left"></i>
                        <span>Watch History</span>
                    </div>
                    <i className="fa-solid fa-chevron-right profile-menu-item-right"></i>
                </div>

                {/* Favorites List */}
                <div className="profile-menu-item" onClick={() => switchView('favorites')}>
                    <div className="profile-menu-item-left">
                        <i className="fa-solid fa-bookmark"></i>
                        <span>My Favorites</span>
                    </div>
                    <i className="fa-solid fa-chevron-right profile-menu-item-right"></i>
                </div>

                {/* Settings */}
                <div className="profile-menu-item" onClick={() => switchView('settings')}>
                    <div className="profile-menu-item-left">
                        <i className="fa-solid fa-gear"></i>
                        <span>Account Settings</span>
                    </div>
                    <i className="fa-solid fa-chevron-right profile-menu-item-right"></i>
                </div>

                {/* Support / Discord */}
                <div className="profile-menu-item" onClick={() => window.open('https://discord.gg/K2VhJxAmvX', '_blank')}>
                    <div className="profile-menu-item-left">
                        <i className="fa-brands fa-discord"></i>
                        <span>Community Support</span>
                    </div>
                    <i className="fa-solid fa-chevron-right profile-menu-item-right"></i>
                </div>

                {/* Logout Button */}
                <div className="profile-menu-item logout" onClick={doLogout}>
                    <div className="profile-menu-item-left">
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        <span>Sign Out</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;