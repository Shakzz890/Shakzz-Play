import React, { useEffect, useRef, useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';

const Loader = () => {
    const { isLoading, loadingMessage } = useGlobal();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isGlitching, setIsGlitching] = useState(false);
    
    // Audio Refs
    const openAudioRef = useRef(null);
    const glitchAudioRef = useRef(null);

    // 1. Play "System Open" Sound on Mount
    useEffect(() => {
        if (isLoading) {
            // Attempt to play the open sound
            openAudioRef.current = new Audio('/assets/sounds/system_open.mp3');
            openAudioRef.current.volume = 0.5;
            
            // Browsers often block auto-play. We catch the error so the app doesn't crash.
            openAudioRef.current.play().catch((error) => {
                console.log("Auto-play prevented by browser. Interaction required.", error);
            });
        }
    }, [isLoading]);

    // 2. Parallax Effect (The window floats/tilts)
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isLoading) return;
            // Calculate rotation based on cursor position
            const rotateY = (e.clientX / window.innerWidth - 0.5) * 10; // -5 to 5 deg
            const rotateX = (e.clientY / window.innerHeight - 0.5) * -10;
            setMousePos({ x: rotateY, y: rotateX });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isLoading]);

    // 3. Handle User Interaction (Click to Glitch)
    const handleScreenClick = () => {
        // Trigger Visual Glitch
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);

        // Trigger Audio (This will work because the USER clicked)
        glitchAudioRef.current = new Audio('/assets/sounds/system_glitch.mp3');
        glitchAudioRef.current.volume = 0.4;
        glitchAudioRef.current.play().catch((e) => console.log("Glitch sound error", e));
        
        // If the open sound was blocked earlier, try playing it now too
        if (openAudioRef.current && openAudioRef.current.paused) {
             openAudioRef.current.play().catch(() => {});
        }
    };

    if (!isLoading) return null;

    return (
        <div 
            id="system-interface-loader" 
            onClick={handleScreenClick}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.85)', // Darker dim for better contrast
                backdropFilter: 'blur(5px)',
                zIndex: 200000,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                perspective: '1500px', // For 3D depth
                fontFamily: "'Rajdhani', 'Outfit', sans-serif",
                cursor: 'pointer'
            }}
        >
            <style>
                {`
                :root {
                    --system-blue: #00EAFF;
                    --system-dark: #050a14;
                    --system-glow: rgba(0, 234, 255, 0.4);
                }

                @keyframes windowOpen {
                    0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }

                @keyframes scanlineMove {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }

                @keyframes pulseText {
                    0%, 100% { opacity: 1; text-shadow: 0 0 10px var(--system-blue); }
                    50% { opacity: 0.6; text-shadow: 0 0 2px var(--system-blue); }
                }

                @keyframes spinRing {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes glitchAnim {
                    0% { transform: translate(0); filter: hue-rotate(0deg); }
                    20% { transform: translate(-5px, 2px); filter: hue-rotate(90deg); }
                    40% { transform: translate(5px, -2px); filter: hue-rotate(180deg); }
                    60% { transform: translate(-2px, 5px); }
                    80% { transform: translate(2px, -5px); }
                    100% { transform: translate(0); filter: hue-rotate(0deg); }
                }

                /* THE SYSTEM WINDOW CONTAINER */
                .system-window {
                    width: 450px;
                    background: linear-gradient(180deg, rgba(6, 15, 30, 0.95) 0%, rgba(2, 6, 12, 0.98) 100%);
                    border: 1px solid var(--system-blue);
                    box-shadow: 0 0 25px rgba(0, 234, 255, 0.15), inset 0 0 20px rgba(0, 234, 255, 0.05);
                    border-radius: 4px;
                    position: relative;
                    overflow: hidden;
                    transform-style: preserve-3d;
                    transition: transform 0.1s ease-out;
                    animation: windowOpen 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }

                .system-window.glitch-active {
                    animation: glitchAnim 0.2s infinite;
                    border-color: #fff;
                }

                /* HEADER BAR */
                .window-header {
                    padding: 12px 20px;
                    border-bottom: 1px solid rgba(0, 234, 255, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: linear-gradient(90deg, rgba(0, 234, 255, 0.1) 0%, transparent 100%);
                }
                
                .header-text {
                    color: var(--system-blue);
                    font-size: 0.9rem;
                    letter-spacing: 2px;
                    font-weight: 700;
                    text-transform: uppercase;
                    text-shadow: 0 0 8px var(--system-glow);
                }

                .exclamation {
                    width: 18px;
                    height: 18px;
                    border: 1px solid var(--system-blue);
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 0.8rem;
                    color: var(--system-blue);
                    box-shadow: 0 0 5px var(--system-blue);
                }

                /* BODY CONTENT */
                .window-body {
                    padding: 40px 30px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                .loading-text {
                    color: #fff;
                    font-size: 1.6rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                    margin-top: 25px;
                    text-shadow: 0 0 10px rgba(0, 234, 255, 0.5);
                }

                .sub-text {
                    color: rgba(0, 234, 255, 0.7);
                    font-size: 0.85rem;
                    margin-top: 8px;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    animation: pulseText 2s infinite;
                }

                /* BLUE SPINNER (The Magic Circle) */
                .system-spinner {
                    width: 60px;
                    height: 60px;
                    border: 2px solid rgba(0, 234, 255, 0.1);
                    border-top: 2px solid var(--system-blue);
                    border-right: 2px solid var(--system-blue);
                    border-radius: 50%;
                    animation: spinRing 1s linear infinite;
                    box-shadow: 0 0 15px var(--system-glow);
                }

                /* SCANLINE EFFECT */
                .scanline {
                    position: absolute;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: rgba(0, 234, 255, 0.3);
                    box-shadow: 0 0 10px var(--system-blue);
                    animation: scanlineMove 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                    opacity: 0;
                    pointer-events: none;
                }

                /* DECORATIVE CORNERS */
                .corner {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    border: 2px solid var(--system-blue);
                    background: transparent;
                }
                .tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
                .tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
                .bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
                .br { bottom: -1px; right: -1px; border-left: none; border-top: none; }
                `}
            </style>

            <div 
                className={`system-window ${isGlitching ? 'glitch-active' : ''}`}
                style={{
                    transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`
                }}
            >
                {/* Decorative Corners */}
                <div className="corner tl"></div>
                <div className="corner tr"></div>
                <div className="corner bl"></div>
                <div className="corner br"></div>

                {/* Header */}
                <div className="window-header">
                    <div className="exclamation">!</div>
                    <span className="header-text">System Notification</span>
                </div>

                {/* Main Content */}
                <div className="window-body">
                    {/* The Blue Spinner */}
                    <div className="system-spinner"></div>

                    <div className="loading-text">
                        Processing Request...
                    </div>
                    <div className="sub-text">
                        {loadingMessage || "Synchronizing Player Data"}
                    </div>

                    {/* Scanline Overlay */}
                    <div className="scanline"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
