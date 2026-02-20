import React from 'react';
import { useVersionCheck } from '../hooks/useVersionCheck';
import './UpdateDialog.css';

const UpdateDialog = () => {
  const {
    updateInfo,
    showUpdateDialog,
    dismissUpdate,
    performUpdate // <--- UPDATED: Using the new function name
  } = useVersionCheck();

  // If dialog shouldn't be shown or no info is available, return nothing
  if (!showUpdateDialog || !updateInfo) return null;

  const { latestVersion, currentVersion, releaseNotes, updateRequired } = updateInfo;

  return (
    <div className="update-overlay">
      <div className="update-card fade-in-up">
        
        {/* Header Image or Icon */}
        <div className="update-header">
          <span className="update-icon">🚀</span>
          <h2>Update Available</h2>
        </div>

        {/* Body Content */}
        <div className="update-body">
          <p className="version-text">
            Version <strong>{latestVersion}</strong> is now available.
            <br />
            <span className="current-text">(You are on v{currentVersion})</span>
          </p>

          {/* Release Notes Section */}
          {releaseNotes && (
            <div className="release-notes-container">
              <h4>What's New:</h4>
              <p>{releaseNotes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="update-actions">
          {/* Only show Cancel if it's NOT a forced update */}
          {!updateRequired && (
            <button className="btn-cancel" onClick={dismissUpdate}>
              Later
            </button>
          )}
          
          {/* UPDATED: Calls performUpdate to open browser */}
          <button className="btn-update" onClick={performUpdate}>
            Download Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateDialog;