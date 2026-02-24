import React from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';

const FocusWrapper = ({ children, onClick, className = '', style = {}, focusKey }) => {
    const { ref, focused } = useFocusable({
        focusKey,
        onEnterPress: onClick // Allows the TV remote "OK/Enter" button to act like a tap
    });

    return (
        <div
            ref={ref}
            className={`${className} ${focused ? 'tv-focused' : ''}`}
            onClick={onClick}
            style={style}
        >
            {children}
        </div>
    );
};

export default FocusWrapper;