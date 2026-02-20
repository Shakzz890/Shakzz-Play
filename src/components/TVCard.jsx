import React from 'react';

const TVCard = ({ children, onClick, className, style }) => {
    // This function handles the "Enter" or "OK" button on a remote
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (onClick) onClick();
        }
    };

    return (
        <div 
            className={className} 
            style={style}
            onClick={onClick}
            // 1. Make it focusable by remote
            tabIndex="0" 
            // 2. Listen for "Enter" key
            onKeyDown={handleKeyDown}
            // 3. Optional: Add a class for specific TV styling if needed
            data-tv-component="true"
        >
            {children}
        </div>
    );
};

export default TVCard;