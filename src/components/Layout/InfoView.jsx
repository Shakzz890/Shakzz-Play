import React, { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import emailjs from '@emailjs/browser'; // ADD THIS IMPORT

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
            <h3 class="update-title">🚀 Official Release v1.0</h3>
            <span class="update-date">2026-02-22</span>
        </div>
        <p class="update-content">
            <strong>System Online:</strong> Shakzz Play is now officially live! After extensive beta testing, we're proud to deliver a stable, high-performance streaming experience.
            <br><br>
            <strong>What's New:</strong>
            <br>• Complete UI/UX overhaul with Shadow Monarch dark theme
            <br>• Optimized video player with multi-server backup system
            <br>• Live TV with 100+ channels 
            <br>• Advanced search with filters (Type, Region, Sort)
            <br>• "Continue Watching" and "My List" personalization
            <br>• Improved mobile responsiveness across all devices
            <br>• Faster load times and reduced buffering
            <br>• Bug fixes and stability improvements
            <br><br>
        </p>
    </div>
        <div class="update-item">
            <div class="update-header">
                <h3 class="update-title"> Beta Release</h3>
                <span class="update-date">2026-02-20</span>
            </div>
       <p class="update-content"><strong>System Initialization: Beta v1.0.</strong> Your ultimate entertainment platform is online. Watch your favorite dramas, series, anime, and Live TV in high quality. Equipped with multi-server backup links and offline safety protocols. Thank you for being a beta tester!</p>
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
            <strong>Effective Date:</strong> February 20, 2026b
            <br><br>
            Continued use of our service after changes constitutes acceptance of the updated policy.
        </p>
    </div>
        </div>
    `
    // REMOVED: contact - now uses ContactContent component
};

// --- SOLO LEVELING STYLE CONTACT FORM WITH AUTO-REPLY ---
const ContactContent = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [isSending, setIsSending] = useState(false);
    const [status, setStatus] = useState(null);
    const [systemLogs, setSystemLogs] = useState([]);

    const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1475184614438993982/QgAq9o2i8iCLPHDwpF6HUAa-e7nEyT6AOvTgd-7PVNJetyJuFmUp_kuIFT-ko3xPMGOE  ';

    // EmailJS config
    const EMAILJS_SERVICE_ID = 'service_341fbji';
    const EMAILJS_TEMPLATE_ID = 'template_zpao0dk'; // Replace with your template ID
    const EMAILJS_AUTO_REPLY_TEMPLATE_ID = 'template_iehtcwp'; // Create this for auto-reply
    const EMAILJS_PUBLIC_KEY = 'sY62_SPQO2ivADWIT';

    // Add system log
    const addLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        setSystemLogs(prev => [...prev.slice(-4), { time: timestamp, message, type }]);
    };

    const sendToEmailJS = async (data) => {
        // Send to admin
        const adminResponse = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                from_name: data.name,
                from_email: data.email,
                subject: `[SHAKZZ PLAY] ${data.subject}`,
                message: data.message,
                reply_to: data.email
            },
            EMAILJS_PUBLIC_KEY
        );

        // Send auto-reply to user (works on free tier!)
        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_AUTO_REPLY_TEMPLATE_ID,
                {
                    to_name: data.name,
                    to_email: data.email,
                    subject: data.subject,
                    reply_message: getAutoReplyMessage(data.name, data.subject)
                },
                EMAILJS_PUBLIC_KEY
            );
        } catch (err) {
            console.log('Auto-reply failed (non-critical):', err);
        }

        return adminResponse.status === 200;
    };

    const getAutoReplyMessage = (name, subject) => {
        return `
Hunter ${name},

Your request [${subject}] has been received by the Shadow Monarch system.

⚡ STATUS: QUEUED
📊 PRIORITY: S-RANK
⏱️ RESPONSE TIME: Within 24 hours

Our guild administrators are analyzing your transmission. Do not attempt to send duplicate requests - this may trigger the system's anti-spam protocols.

May the shadows guide you,
SHAKZZ PLAY System
        `.trim();
    };

    const sendToDiscord = async (data) => {
        const message = {
            content: '```SYSTEM ALERT: EMERGENCY TRANSMISSION```',
            embeds: [{
                title: '⚠️ SHAKZZ PLAY CONTACT [FALLBACK]',
                color: 0xff0000,
                fields: [
                    { name: '👤 Hunter Name', value: data.name, inline: true },
                    { name: '📧 Email', value: data.email, inline: true },
                    { name: '📌 Subject', value: data.subject },
                    { name: '📝 Message', value: data.message.length > 1000 ? data.message.substring(0, 1000) + '...' : data.message }
                ],
                footer: { 
                    text: `SYSTEM TIME: ${new Date().toLocaleString()} | EmailJS Quota Exceeded`,
                    icon_url: 'https://cdn.discordapp.com/emojis/123456789.png  '
                },
                timestamp: new Date().toISOString()
            }]
        };

        const response = await fetch(DISCORD_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });
        return response.ok;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setStatus(null);
        addLog('Initializing transmission...', 'info');

        try {
            addLog('Connecting to Shadow Monarch servers...', 'info');
            const sent = await sendToEmailJS(formData);
            
            if (sent) {
                addLog('Transmission successful!', 'success');
                setStatus({ 
                    type: 'success', 
                    title: 'SYSTEM: MESSAGE TRANSMITTED',
                    message: 'Your request has been logged. Check your email for confirmation.',
                    fallback: false 
                });
                setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
            } else {
                throw new Error('Transmission failed');
            }
        } catch (err) {
            addLog('Primary channel failed. Switching to emergency protocol...', 'warning');
            
            try {
                const discordSent = await sendToDiscord(formData);
                
                if (discordSent) {
                    addLog('Emergency transmission complete!', 'warning');
                    setStatus({ 
                        type: 'warning', 
                        title: 'SYSTEM: EMERGENCY MODE',
                        message: 'Message saved to backup servers. Manual reply required.',
                        fallback: true 
                    });
                    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                } else {
                    throw new Error('All channels failed');
                }
            } catch (discordErr) {
                addLog('CRITICAL: All transmission channels offline', 'error');
                setStatus({ 
                    type: 'error', 
                    title: 'SYSTEM: CRITICAL FAILURE',
                    message: 'Unable to establish connection. Please try again later.',
                    fallback: false 
                });
            }
        } finally {
            setIsSending(false);
            setTimeout(() => setStatus(null), 8000);
        }
    };

    const getStatusColor = () => {
        if (!status) return '#888';
        if (status.type === 'success') return '#46d369';
        if (status.type === 'warning') return '#f5c518';
        return '#ef4444';
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px', 
            maxWidth: '500px', 
            margin: '0 auto',
            fontFamily: 'Orbitron, sans-serif'
        }}>
            {/* System Header */}
            <div style={{ 
                textAlign: 'center',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(0,0,0,0.3) 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, #a855f7, transparent)',
                    animation: 'scan 2s linear infinite'
                }} />
                <i className="fa-solid fa-tower-broadcast" style={{ 
                    fontSize: '2.5rem', 
                    color: '#a855f7',
                    textShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
                    marginBottom: '10px',
                    display: 'block'
                }}></i>
                <h2 style={{ 
                    color: '#fff', 
                    marginBottom: '5px', 
                    fontSize: '1.3rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                }}>
                    Shadow Monarch
                </h2>
                <p style={{ 
                    color: '#a855f7', 
                    fontSize: '0.75rem',
                    letterSpacing: '3px'
                }}>
                    SECURE COMMUNICATION CHANNEL
                </p>
            </div>

            {/* System Logs */}
            <div style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid #333',
                borderRadius: '8px',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '0.75rem'
            }}>
                <div style={{ color: '#666', marginBottom: '8px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>
                    SYSTEM LOGS:
                </div>
                {systemLogs.length === 0 ? (
                    <div style={{ color: '#444' }}>{'>'} System standby...</div>
                ) : (
                    systemLogs.map((log, i) => (
                        <div key={i} style={{ 
                            color: log.type === 'success' ? '#46d369' : log.type === 'warning' ? '#f5c518' : log.type === 'error' ? '#ef4444' : '#888',
                            marginBottom: '4px'
                        }}>
                            [{log.time}] {log.message}
                        </div>
                    ))
                )}
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Name - CLEAR LABEL */}
                <div style={{ position: 'relative' }}>
                    <label style={{
                        position: 'absolute',
                        left: '12px',
                        top: '-8px',
                        background: '#050505',
                        padding: '0 6px',
                        color: '#a855f7',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Your Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        disabled={isSending}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'rgba(168, 85, 247, 0.05)',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '0.95rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'all 0.3s',
                            fontFamily: 'inherit'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                        onBlur={(e) => e.target.style.borderColor = '#333'}
                    />
                </div>

                {/* Email - CLEAR LABEL */}
                <div style={{ position: 'relative' }}>
                    <label style={{
                        position: 'absolute',
                        left: '12px',
                        top: '-8px',
                        background: '#050505',
                        padding: '0 6px',
                        color: '#a855f7',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Email Address *
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        disabled={isSending}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'rgba(168, 85, 247, 0.05)',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '0.95rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'all 0.3s',
                            fontFamily: 'inherit'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                        onBlur={(e) => e.target.style.borderColor = '#333'}
                    />
                </div>

                {/* Subject - CLEAR LABEL */}
                <div style={{ position: 'relative' }}>
                    <label style={{
                        position: 'absolute',
                        left: '12px',
                        top: '-8px',
                        background: '#050505',
                        padding: '0 6px',
                        color: '#a855f7',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Subject *
                    </label>
                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                        disabled={isSending}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'rgba(30,30,30,1)',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '0.95rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                            appearance: 'none',
                            fontFamily: 'inherit',
                            cursor: 'pointer',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg  ' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23a855f7' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 16px center'
                        }}
                    >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Report Broken Link">Report Broken Link</option>
                        <option value="Content Request">Content Request</option>
                        <option value="Bug Report">Bug Report</option>
                    </select>
                </div>

                {/* Message - CLEAR LABEL */}
                <div style={{ position: 'relative' }}>
                    <label style={{
                        position: 'absolute',
                        left: '12px',
                        top: '-8px',
                        background: '#050505',
                        padding: '0 6px',
                        color: '#a855f7',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Message *
                    </label>
                    <textarea
                        name="message"
                        rows="5"
                        placeholder="How can we help you today?"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                        disabled={isSending}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'rgba(168, 85, 247, 0.05)',
                            border: '1px solid #333',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '0.95rem',
                            outline: 'none',
                            resize: 'vertical',
                            minHeight: '120px',
                            boxSizing: 'border-box',
                            fontFamily: 'inherit',
                            transition: 'all 0.3s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#a855f7'}
                        onBlur={(e) => e.target.style.borderColor = '#333'}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSending}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: isSending ? '#1a1a1a' : 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                        color: '#fff',
                        border: isSending ? '1px solid #333' : '1px solid rgba(168, 85, 247, 0.5)',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '1rem',
                        cursor: isSending ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: isSending ? 'none' : '0 0 20px rgba(168, 85, 247, 0.3)',
                        transition: 'all 0.3s'
                    }}
                >
                    {isSending ? (
                        <>
                            <i className="fas fa-circle-notch fa-spin"></i>
                            Sending...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane"></i>
                            Send Message
                        </>
                    )}
                </button>

                {/* Status Message */}
                {status && (
                    <div style={{
                        padding: '16px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.5)',
                        border: `1px solid ${getStatusColor()}`,
                        borderLeft: `4px solid ${getStatusColor()}`,
                        color: '#fff',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: `linear-gradient(90deg, transparent, ${getStatusColor()}, transparent)`
                        }} />
                        <div style={{ 
                            fontSize: '0.75rem', 
                            color: getStatusColor(),
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            marginBottom: '5px'
                        }}>
                            {status.title}
                        </div>
                        <div style={{ fontSize: '0.9rem' }}>
                            {status.message}
                        </div>
                        {status.fallback && (
                            <div style={{ 
                                fontSize: '0.7rem', 
                                marginTop: '8px', 
                                color: '#888',
                                borderTop: '1px solid #333',
                                paddingTop: '8px'
                            }}>
                                ⚠️ Emergency protocol active. Response may be delayed.
                            </div>
                        )}
                    </div>
                )}
            </form>

            {/* Footer Note */}
            <p style={{ 
                textAlign: 'center', 
                color: '#444', 
                fontSize: '0.65rem',
                letterSpacing: '1px',
                textTransform: 'uppercase'
            }}>
                <i className="fas fa-shield-alt" style={{ marginRight: '5px', color: '#a855f7' }}></i>
                Secured by Shadow Monarch Protocol • Response within 24h
            </p>
        </div>
    );
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
                    <h3 style={{ color: '#fff', margin: 0 }}>Scan to Donate (BPI)</h3>
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

            {/* 2. CRYPTO (Third) */}
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

    // RENDER CONTENT BASED ON TYPE
    const renderContent = () => {
        switch (infoModal.type) {
            case 'donate':
                return <DonateContent />;
            case 'contact':
                return <ContactContent />;
            default:
                return <div dangerouslySetInnerHTML={{ __html: infoContent[infoModal.type] }}></div>;
        }
    };

    return (
        <div id="info-modal" className="info-modal active">
            <div className="info-content-wrapper">
                <div className="info-header">
                    <h2 id="info-title">{titles[infoModal.type] || 'Information'}</h2>
                    <span className="close-info" onClick={() => setInfoModal({ ...infoModal, isOpen: false })}>×</span>
                </div>
                
                <div className="info-body" id="info-body">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default InfoView;