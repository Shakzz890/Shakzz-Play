import React, { useState, useEffect } from 'react';

const BackToTop = ({ containerRef }) => {
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        // If a containerRef is passed, check that element's scroll
        if (containerRef && containerRef.current) {
            const scrolled = containerRef.current.scrollTop;
            setVisible(scrolled > 300);
        } else {
            // Otherwise check the main window scroll
            const scrolled = document.documentElement.scrollTop || window.scrollY;
            setVisible(scrolled > 300);
        }
    };

    const scrollToTop = () => {
        if (containerRef && containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        // If specific container, attach listener to it
        if (containerRef && containerRef.current) {
            const ref = containerRef.current;
            ref.addEventListener('scroll', toggleVisible);
            return () => ref.removeEventListener('scroll', toggleVisible);
        } else {
            // Otherwise attach to window
            window.addEventListener('scroll', toggleVisible);
            return () => window.removeEventListener('scroll', toggleVisible);
        }
    }, [containerRef]);

    return (
        <button 
            className={`back-to-top ${visible ? 'visible' : ''}`} 
            onClick={scrollToTop}
            title="Back to Top"
        >
            <i className="fa-solid fa-arrow-up"></i>
        </button>
    );
};

export default BackToTop;
