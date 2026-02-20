// components/SidebarNav.jsx
import React from 'react';
import { Home, Compass, Tv, User } from 'lucide-react'; // or your icon library

const SidebarNav = ({ currentView, onNavigate, user }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'live', label: 'Live TV', icon: Tv },
  ];

  return (
    <nav className="sidebar-nav">
      {/* Header with Logo on Right */}
      <div className="sidebar-header">
        <img src="/logo.png" alt="Logo" className="sidebar-logo" />
      </div>

      {/* Navigation Items */}
      <div className="sidebar-nav-items">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="nav-icon" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Profile Section at Bottom */}
      <div className="sidebar-profile">
        <div className="sidebar-profile-btn" onClick={() => onNavigate('profile')}>
          <img 
            src={user?.avatar || '/default-avatar.png'} 
            alt="Profile" 
            className="sidebar-avatar" 
          />
          <span className="sidebar-username">{user?.name || 'Profile'}</span>
        </div>
      </div>
    </nav>
  );
};

export default SidebarNav;