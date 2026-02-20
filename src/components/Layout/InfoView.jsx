import React, { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';

// --- EXPANDED STATIC CONTENT ---
const infoContent = {
    about: `
        <div class="update-item">
            <div class="update-header">
                <h3 class="update-title" style="font-size: 1.4rem; color: #fff;">About Shakzz Play</h3>
            </div>
            <p class="update-content">
                Shakzz Play is a next-generation streaming platform designed to bridge the gap between premium entertainment and accessibility. We curate a vast library of high-definition movies, TV series, anime, and live television channels, delivering them through a seamless, ad-lite experience.
            </p>
            <br>
            <h4 style="color: #a855f7; margin-bottom: 8px;">Our Mission</h4>
            <p class="update-content">
                To democratize entertainment for Filipinos and global viewers alike. We believe that quality content—whether it's the latest K-Drama, a classic anime, or live news coverage—should be accessible to everyone, anywhere, without restrictive paywalls.
            </p>
            <br>
            <h4 style="color: #a855f7; margin-bottom: 8px;">The Technology</h4>
            <p class="update-content">
                Built on a modern React & Capacitor framework, Shakzz Play utilizes decentralized video aggregation. We don't host files; instead, our "Shadow Monarch" engine scours the web to find the fastest, highest-quality streams available in real-time.
            </p>
        </div>
        <div class="update-item">
            <div class="update-header">
                <h3 class="update-title" style="font-size: 1.2rem; color: #fff;">Legal Disclaimer</h3>
            </div>
            <p class="update-content" style="color: #aaa; font-style: italic;">
                Shakzz Play functions as a search engine and aggregation tool. We do not host, upload, or manage any video files on our servers. All content is provided by non-affiliated third parties. If you have legal concerns, please contact the hosting providers directly.
            </p>
        </div>
    `,
    updates: `
        <div class="update-item">
            <div class="update-header">
                <h3 class="update-title"> Beta Release</h3>
                <span class="update-date">2026-02-20</span>
            </div>
           <p class="update-content">Welcome to the official <strong>Beta Release</strong>! We've integrated a new hybrid Anime system for perfectly accurate seasons, added global offline protection, and built a multi-source server selector for flawless playback. Thank you for testing!</p>
        </div>
       <div class="update-item">
            <div class="update-header">
                <h3 class="update-title">Web IPTV Optimization</h3>
                <span class="update-date">Previous</span>
            </div>
            <p class="update-content">
                <strong>shakzz.online Update:</strong>
                <br>• Optimized the Live TV player for faster loading on mobile browsers.
                <br>• Added a decentralized CDN to ensure stability for 24/7 channel streaming.
            </p>
        </div>
    `,
    faq: `
        <div class="faq-container" style="padding: 10px 0;">
            <div class="faq-item">
                <h3 class="faq-question"><i class="fa-solid fa-circle-question"></i> Is Shakzz Play completely free?</h3>
                <p class="faq-answer">Yes. We believe in open access to information and entertainment. There are no subscription fees, credit card requirements, or hidden paywalls.</p>
            </div>
            <div class="faq-item">
                <h3 class="faq-question"><i class="fa-solid fa-triangle-exclamation"></i> Why are there pop-up ads?</h3>
                <p class="faq-answer">
                    We utilize third-party video hosting providers (like VidSrc, 2Embed) to stream content. These providers usually include ads to cover their massive server costs. Shakzz Play does not control these ads.
                    <br><strong style="color:#fff">Tip:</strong> Use the "Server" selector below the player to find a stream with fewer interruptions (e.g., Server 3 or 4).
                </p>
            </div>
            <div class="faq-item">
                <h3 class="faq-question"><i class="fa-solid fa-wifi"></i> Buffering or Playback Issues?</h3>
                <p class="faq-answer">
                    If a video stalls or refuses to play:
                    <br>1. <strong>Switch Servers:</strong> This is the most effective fix.
                    <br>2. <strong>Clear Cache:</strong> Sometimes your browser holds onto old data.
                    <br>3. <strong>Check Connection:</strong> Ensure you have a stable connection of at least 5Mbps for HD streaming.
                </p>
            </div>
            <div class="faq-item">
                <h3 class="faq-question"><i class="fa-solid fa-tv"></i> Can I cast to my TV?</h3>
                <p class="faq-answer">
                    Yes! If you are on Android, you can use the "Cast" feature in your quick settings panel to mirror your screen. Alternatively, some of our players (Server 1 & 2) have a built-in Chromecast button if a device is detected on your network.
                </p>
            </div>
            <div class="faq-item">
                <h3 class="faq-question"><i class="fa-solid fa-film"></i> How do I request a movie/series?</h3>
                <p class="faq-answer">
                    Go to the "Contact Us" section and select "Content Request" from the dropdown. Please provide the exact Title and Year. We usually add requests within 24-48 hours.
                </p>
            </div>
        </div>
    `,
    privacy: `
        <div class="privacy-container" style="padding: 10px 0; color: #ccc; line-height: 1.6;">
            <div class="update-item">
                <h3 class="update-title" style="color: #fff;">1. Data Collection Policy</h3>
                <p class="update-content">
                    We value user anonymity. We <strong>do not</strong> collect personally identifiable information (PII) such as names, addresses, or phone numbers unless explicitly provided by you (e.g., via Email or Google Login).
                    <br><br>
                    <strong>Automatic Logging:</strong> Like most websites, our servers automatically record basic data such as IP addresses, browser types, and referring pages. This data is used solely for analytics, abuse prevention, and improving server performance.
                </p>
            </div>
            <div class="update-item">
                <h3 class="update-title" style="color: #fff;">2. Cookie & Local Storage</h3>
                <p class="update-content">
                    We use "Local Storage" on your device to enhance your experience. This allows us to:
                    <br>• Remember your "Continue Watching" history.
                    <br>• Save your "My List" favorites.
                    <br>• Persist your Dark Mode preferences.
                    <br>
                    This data lives on your device and is not sold to third parties.
                </p>
            </div>
            <div class="update-item">
                <h3 class="update-title" style="color: #fff;">3. Third-Party Embeds</h3>
                <p class="update-content">
                    Content on this site may include embedded videos from other services (e.g., YouTube, VidSrc, Dailymotion). Embedded content behaves exactly as if the visitor has visited the other website. These websites may collect data about you, use cookies, and monitor your interaction with that embedded content.
                </p>
            </div>
              <div class="update-item">
        <h3 class="update-title" style="color: #fff;">4. Data Security</h3>
        <p class="update-content">
            We implement industry-standard security measures to protect your data:
            <br>• <strong>HTTPS Encryption:</strong> All data transmission is encrypted using SSL/TLS protocols.
            <br>• <strong>Secure Authentication:</strong> Passwords are hashed using bcrypt. We never store plain-text passwords.
            <br>• <strong>Rate Limiting:</strong> API endpoints are protected against brute-force attacks.
            <br>• <strong>Regular Audits:</strong> We conduct periodic security assessments to identify vulnerabilities.
            <br><br>
            While we strive to protect your information, no method of transmission over the internet is 100% secure.
        </p>
    </div>
              <div class="update-item">
        <h3 class="update-title" style="color: #fff;">5. Legal Basis for Processing (GDPR)</h3>
        <p class="update-content">
            We process personal data based on the following legal grounds:
            <br>• <strong>Consent:</strong> When you explicitly agree to marketing communications or optional features.
            <br>• <strong>Contract:</strong> Processing necessary to provide our streaming service.
            <br>• <strong>Legal Obligation:</strong> Compliance with copyright laws and legal requests.
            <br>• <strong>Legitimate Interest:</strong> Fraud prevention, security, and service improvement.
            <br><br>
            You may withdraw consent at any time, though this may affect service functionality.
        </p>
    </div>
    <div class="update-item">
        <h3 class="update-title" style="color: #fff;">6. Data Retention Policy</h3>
        <p class="update-content">
            We retain your data only as long as necessary:
            <br>• <strong>Active Accounts:</strong> Data retained indefinitely until account deletion.
            <br>• <strong>Inactive Accounts:</strong> Automatically deleted after 24 months of inactivity.
            <br>• <strong>Server Logs:</strong> Automatically purged after 90 days.
            <br>• <strong>Deleted Accounts:</strong> Complete removal within 30 days of deletion request.
            <br><br>
            Backup systems may retain residual data for up to 6 months for disaster recovery purposes.
        </p>
    </div>
       <div class="update-item">
        <h3 class="update-title" style="color: #fff;">7. Advertising & Monetization</h3>
        <p class="update-content">
            <strong>Ad-Free Experience:</strong> Shakzz TV operates on a donation and subscription model. We do not display third-party advertisements or sell ad space.
            <br><br>
            <strong>Affiliate Links:</strong> Some recommendations may include affiliate links to streaming services or merchandise. Clicking these links may generate commission at no additional cost to you.
            <br><br>
            <strong>No Data Selling:</strong> We do not sell, trade, or rent your personal information to third parties for marketing purposes.
        </p>
    </div>
        <div class="update-item">
        <h3 class="update-title" style="color: #fff;">8. Changes to This Policy</h3>
        <p class="update-content">
            We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes via:
            <br>• Email notification to registered users.
            <br>• Prominent banner on the website.
            <br>• Update timestamp at the top of this page.
            <br><br>
            <strong>Last Updated:</strong> February 20, 2026
            <br>
            <strong>Effective Date:</strong> February 20, 2026
            <br><br>
            Continued use of our service after changes constitutes acceptance of the updated policy.
        </p>
    </div>
        </div>
    `,
    contact: `
        <div style="text-align: center; padding: 20px 0;">
            <i class="fa-solid fa-envelope-open-text" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i>
            <h2 style="color: #fff; margin-bottom: 10px;">Contact Support</h2>
            <p style="color: #aaa; max-width: 500px; margin: 0 auto 30px auto;">
                Found a broken link? Want to request a movie? Or just want to report a bug?
                <br>Fill out the form below and our admin team will get back to you within 24 hours.
            </p>
            <form action="https://formspree.io/f/manpwdko" method="POST" style="max-width: 500px; margin: 0 auto; text-align: left;">
                <div style="margin-bottom: 15px;">
                    <input class="contact-input" type="email" name="email" placeholder="Your Email Address" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid #333; color: white; border-radius: 8px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <select class="contact-input" name="subject" style="width: 100%; padding: 12px; background: rgba(30,30,30,1); border: 1px solid #333; color: white; border-radius: 8px;">
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Report Broken Link">Report Broken Link</option>
                        <option value="Content Request">Request Movie/Series</option>
                        <option value="Bug Report">Report a Bug</option>
                    </select>
                </div>
                <div style="margin-bottom: 15px;">
                    <textarea class="contact-input" name="message" rows="5" placeholder="How can we help?" required style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid #333; color: white; border-radius: 8px;"></textarea>
                </div>
                <button type="submit" class="contact-btn" style="width: 100%; padding: 14px; background: #e50914; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Send Message</button>
            </form>
        </div>
    `
};

// --- INTERACTIVE DONATE COMPONENT (BPI -> PAYPAL -> CRYPTO) ---
const DonateContent = () => {
    const [copied, setCopied] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false); 
    const cryptoAddress = "0x53d6f9ca04bb6b2a33911155a2a636b662b20c8e";

    const handleCopy = () => {
        navigator.clipboard.writeText(cryptoAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <p style={{ textAlign: 'center', color: '#ccc', marginBottom: '10px' }}>
                Your support keeps Shakzz Play alive, ad-free, and running smoothly. Thank you!
            </p>

            {/* 1. BPI QR CODE (First) */}
            <div className="update-item" style={{ textAlign: 'center', border: '1px solid #B30000', background: 'rgba(179, 0, 0, 0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                    <i className="fa-solid fa-qrcode" style={{ fontSize: '1.5rem', color: '#B30000' }}></i>
                    <h3 style={{ color: '#fff', margin: 0 }}>Scan to Pay (BPI)</h3>
                </div>
                
                {/* Clickable Image Container */}
                <div 
                    style={{ 
                        background: '#fff', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        display: 'inline-block', 
                        maxWidth: '100%', 
                        cursor: 'zoom-in' 
                    }}
                    onClick={() => setIsZoomed(true)}
                >
                    <img 
                        src="/assets/BPI_Shakzz.png" 
                        alt="BPI QR Code" 
                        style={{ width: '100%', maxWidth: '250px', display: 'block', borderRadius: '4px' }} 
                        onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='block'; }}
                    />
                    <p style={{ display: 'none', color: '#000', fontWeight: 'bold', margin: '10px 0' }}>QR Image Not Found</p>
                </div>
                <p style={{ color: '#ccc', marginTop: '10px', fontSize: '0.8rem' }}>(Click image to zoom)</p>
            </div>

            {/* 2. PAYPAL (Second) */}
            <div className="update-item" style={{ textAlign: 'center', border: '1px solid #00457C', background: 'rgba(0, 69, 124, 0.1)' }}>
                <i className="fa-brands fa-paypal" style={{ fontSize: '2.5rem', color: '#00457C', marginBottom: '15px' }}></i>
                <h3 style={{ color: '#fff', marginBottom: '5px' }}>PayPal</h3>
                <p style={{ color: '#ccc', marginBottom: '15px', fontSize: '0.9rem' }}>Fast and secure donation via PayPal.</p>
                <a href="https://paypal.me/supremeninja104" target="_blank" className="contact-btn" style={{ display: 'block', textDecoration: 'none', background: '#00457C', textAlign: 'center', padding: '12px', borderRadius: '8px' }}>
                    Send to @supremeninja104
                </a>
            </div>

            {/* 3. CRYPTO (Third) */}
            <div className="update-item" style={{ textAlign: 'center', border: '1px solid #627EEA', background: 'rgba(98, 126, 234, 0.1)' }}>
                <i className="fa-brands fa-ethereum" style={{ fontSize: '2.5rem', color: '#627EEA', marginBottom: '15px' }}></i>
                <h3 style={{ color: '#fff', marginBottom: '5px' }}>Crypto (USDT)</h3>
                <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '10px' }}>Network: <strong style={{ color: '#fff' }}>ERC20 (Ethereum)</strong></p>
                
                <div style={{ 
                    background: '#000', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #333', 
                    marginTop: '5px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    gap: '10px'
                }}>
                    <p style={{ color: '#627EEA', fontFamily: 'monospace', fontSize: '0.85rem', margin: 0, lineHeight: '1.4', wordBreak: 'break-all', textAlign: 'left' }}>
                        {cryptoAddress}
                    </p>
                    <button 
                        onClick={handleCopy}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            borderRadius: '4px',
                            padding: '8px',
                            cursor: 'pointer',
                            flexShrink: 0
                        }}
                    >
                        {copied ? <i className="fas fa-check" style={{color: '#46d369'}}></i> : <i className="fas fa-copy"></i>}
                    </button>
                </div>
                <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '8px' }}>
                    {copied ? <span style={{color: '#46d369'}}>Copied to clipboard!</span> : "(Only send ERC20 tokens to this address)"}
                </p>
            </div>

            {/* ZOOM OVERLAY (Full Screen) */}
            {isZoomed && (
                <div 
                    style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.95)', zIndex: 99999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'fadeIn 0.3s ease'
                    }}
                    onClick={() => setIsZoomed(false)}
                >
                    <img 
                        src="/assets/BPI_Shakzz.png" 
                        style={{ maxWidth: '90%', maxHeight: '80%', borderRadius: '8px', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }} 
                    />
                    <span style={{ position: 'absolute', top: '40px', right: '30px', color: '#fff', fontSize: '2rem', cursor: 'pointer', background: 'rgba(0,0,0,0.5)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</span>
                </div>
            )}
        </div>
    );
};

const InfoView = () => {
    const { infoModal, setInfoModal } = useGlobal();

    if (!infoModal.isOpen) return null;

    const titles = {
        about: 'About Us',
        updates: 'Platform Updates',
        contact: 'Contact Support',
        faq: 'Frequently Asked Questions',
        privacy: 'Privacy & Terms',
        donate: 'Support Shakzz Play'
    };

    return (
        <div id="info-modal" className="info-modal active">
            <div className="info-content-wrapper">
                <div className="info-header">
                    <h2 id="info-title">{titles[infoModal.type] || 'Information'}</h2>
                    <span className="close-info" onClick={() => setInfoModal({ ...infoModal, isOpen: false })}>×</span>
                </div>
                
                <div className="info-body" id="info-body">
                    {/* Render Interactive Donate Component OR Static HTML Strings */}
                    {infoModal.type === 'donate' ? (
                        <DonateContent />
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: infoContent[infoModal.type] }}></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfoView;