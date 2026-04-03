import React from 'react';
import { useGlobal } from '../context/GlobalContext';

const Settings = () => {
    const { user, switchView, showToast } = useGlobal();

    return (
        <div style={{ paddingTop: 'var(--navbar-offset)', paddingBottom: 'calc(var(--bottom-nav-height) + 20px)', minHeight: '100vh' }}>
            
            {/* Native Header */}
            <div style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="search-back-btn" onClick={() => switchView('profile')} style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <i className="fa-solid fa-arrow-left"></i>
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>Account Settings</h2>
            </div>

            {/* Menu Content */}
            <div style={{ padding: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '25px', borderRadius: '12px' }}>
                    
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#fff' }}>Profile Information</h3>
                    <p style={{ color: '#ccc', margin: '0 0 10px 0' }}>
                        <strong style={{ color: '#fff' }}>Logged in as:</strong> {user ? (user.displayName || user.email) : 'Guest'}
                    </p>
                    {user && user.email && (
                        <p style={{ color: '#ccc', margin: '0 0 20px 0' }}>
                            <strong style={{ color: '#fff' }}>Email:</strong> {user.email}
                        </p>
                    )}
                    
                    <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '20px 0' }} />
                    
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#fff' }}>App Preferences</h3>
                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>More settings coming soon...</p>

                    <button
                        onClick={() => showToast("Preferences saved!", "success")}
                        className="play-btn-primary"
                        style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
                    >
                        <i className="fa-solid fa-floppy-disk"></i> Save Preferences
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Settings;