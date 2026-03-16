import React, { useState, useEffect } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

const BackToTop = ({ containerRef }) => {
    const [visible, setVisible] = useState(false);

    // 🚀 SPATIAL NAVIGATION
    const { ref, focused, setFocus: setGlobalFocus } = useFocusable({
        focusable: visible, // CRITICAL: Tells the D-pad to ignore it when hidden!
        focusKey: 'back-to-top-btn',
        onEnterPress: () => handleScrollToTop()
    });

    const toggleVisible = () => {
        if (containerRef && containerRef.current) {
            const scrolled = containerRef.current.scrollTop;
            setVisible(scrolled > 300);
        } else {
            const scrolled = document.documentElement.scrollTop || window.scrollY;
            setVisible(scrolled > 300);
        }
    };

    const handleScrollToTop = () => {
        if (containerRef && containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Smart TV UX: Since the button will disappear when we scroll up,
        // we bounce the focus back to the top navigation bar so the cursor isn't lost.
        setTimeout(() => setGlobalFocus('nav-home'), 100);
    };

    useEffect(() => {
        if (containerRef && containerRef.current) {
            const refEl = containerRef.current;
            refEl.addEventListener('scroll', toggleVisible);
            return () => refEl.removeEventListener('scroll', toggleVisible);
        } else {
            window.addEventListener('scroll', toggleVisible);
            return () => window.removeEventListener('scroll', toggleVisible);
        }
    }, [containerRef]);

    return (
        <button 
            ref={ref}
            className={`back-to-top ${visible ? 'visible' : ''} ${focused ? 'tv-focused' : ''}`} 
            onClick={() => {
                setGlobalFocus('back-to-top-btn');
                handleScrollToTop();
            }}
            title="Back to Top"
            aria-hidden={!visible} // Hides from screen readers when invisible
        >
            <i className="fa-solid fa-arrow-up"></i>
        </button>
    );
};

export default BackToTop;