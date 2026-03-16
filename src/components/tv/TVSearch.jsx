// src/components/tv/TVSearch.jsx
import React, { useState, useEffect } from 'react';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useInput } from '../../utils/InputManager';
import TVButton from './TVButton';

// 🚀 EXTRACTED SUB-COMPONENT: Handles the complex TV Input logic
const FocusableInput = ({ value, setValue, onCancel, placeholder }) => {
  const { ref, focused, setFocus } = useFocusable({
    focusKey: 'search-input-field',
    onEnterPress: () => {
      // CRITICAL FOR TVs: This forces the TV's native virtual keyboard to pop up!
      ref.current?.focus(); 
    }
  });

  // Automatically tell the engine to focus this input the moment the search bar expands
  useEffect(() => {
    setFocus('search-input-field');
  }, [setFocus]);

  const handleKeyDown = (e) => {
    // If the user hits Escape (Back button on remote), cancel the search
    if (e.key === 'Escape' || e.key === 'GoBack') {
      onCancel();
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      // Apply your existing CSS class + the tv-focused highlight
      className={`tv-search-input ${focused ? 'tv-focused' : ''}`}
      style={{ flex: 1 }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      onClick={() => {
        setFocus('search-input-field');
      }}
    />
  );
};

// =========================================================
// MAIN SEARCH COMPONENT
// =========================================================
const TVSearch = ({ onSearch, placeholder = 'Search...', initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);
  const [isActive, setIsActive] = useState(false);
  const { platform } = useInput(); // Just needed for UI conditional rendering

  // Using Norigin's setFocus here so we can bounce focus back to the trigger button
  const { setFocus: setGlobalFocus } = useFocusable();

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSearch?.(value);
    
    if (platform.isTV) {
      setIsActive(false);
      // Bounce focus back to the trigger button after searching
      setTimeout(() => setGlobalFocus('search-trigger-btn'), 50); 
    }
  };

  const handleCancel = () => {
    setIsActive(false);
    // Bounce focus back to the trigger button after canceling
    setTimeout(() => setGlobalFocus('search-trigger-btn'), 50);
  };

  // State 1: The collapsed "Search" button (TV Only)
  if (!isActive && platform.isTV) {
    return (
      <TVButton 
        focusKey="search-trigger-btn"
        onClick={() => setIsActive(true)}
        className="tv-search-trigger"
        icon="🔍"
        variant="secondary"
      >
        {placeholder}
      </TVButton>
    );
  }

  // State 2: The expanded Search Form
  return (
    <form className="tv-search-container" onSubmit={handleSubmit}>
      <div className="tv-search-input-wrapper">
        
        <FocusableInput 
          value={value}
          setValue={setValue}
          onCancel={handleCancel}
          placeholder={placeholder}
        />

        {platform.isTV && (
          <TVButton 
            focusKey="search-cancel-btn"
            onClick={handleCancel}
            variant="ghost"
            size="small"
          >
            Cancel
          </TVButton>
        )}
      </div>
    </form>
  );
};

export default TVSearch;