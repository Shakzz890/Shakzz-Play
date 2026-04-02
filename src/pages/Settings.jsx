import React from 'react';
import { useGlobal } from '../context/GlobalContext';

const Settings = () => {
    const { user, switchView, showToast } = useGlobal();

    return (
        <div style={{ padding: '20px', color: 'white', paddingTop: '80px', minHeight: '100vh' }}>
            <button 
                onClick={() => switchView('profile')} 
                style={{ marginBottom: '20px', background: 'transparent', color: '#a855f7', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
            >
                <i className="fa-solid fa-arrow-left"></i> Back to Profile
            </button>
            
            <h2>Account Settings</h2>
            
            <div style={{ marginTop: '20px', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
                <p><strong>Logged in as:</strong> {user ? (user.displayName || user.email) : 'Guest'}</p>
                <p style={{ color: '#aaa', marginTop: '10px' }}>More settings coming soon...</p>
                
                <button 
                    onClick={() => showToast("Preferences saved!", "success")}
                    className="play-btn-primary" 
                    style={{ marginTop: '20px' }}
                >
                    Save Preferences
                </button>
            </div>
        </div>
    );
};

export default Settings;