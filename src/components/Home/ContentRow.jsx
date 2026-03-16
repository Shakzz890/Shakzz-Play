import React from 'react';
import MovieCard from '../Shared/MovieCard';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

const ContentRow = ({ title, items }) => {
    // Generate a safe string for the focus key (e.g., "Trending TV Shows" -> "trending-tv-shows")
    const safeKey = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'row';

    // 🚀 SPATIAL NAVIGATION: Group the row together!
    const { ref, hasFocusedChild } = useFocusable({
        trackChildren: true, // Tells the engine: "These items belong together horizontally!"
        focusKey: `row-${safeKey}`,
        focusable: false // The row container itself shouldn't be highlighted, only the cards inside it
    });

    if (!items || items.length === 0) return null;

    return (
        <div 
            className="row" 
            ref={ref} // Attach the boundary to the row wrapper
        >
            {/* Optional: We can make the row title change color when you navigate inside the row! */}
            <h2 style={{ opacity: hasFocusedChild ? 1 : 0.8, transition: 'opacity 0.3s' }}>
                <span className="section-indicator"></span> 
                {title} 
                <i className="fa-solid fa-chevron-right" style={{ 
                    transform: hasFocusedChild ? 'translateX(5px)' : 'none',
                    color: hasFocusedChild ? 'var(--accent-color)' : 'inherit'
                }}></i>
            </h2>
            
            <div className="list">
                {items.map(item => (
                    <MovieCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default ContentRow;