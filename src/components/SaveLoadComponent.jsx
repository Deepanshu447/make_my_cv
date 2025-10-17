import React, { useRef } from 'react';
import { useCV } from '../contexts/CVContext';
import { FiSave, FiDownload, FiUpload, FiCheck, FiClock } from 'react-icons/fi';
import './SaveLoadComponent.css';

const SaveLoadComponent = () => {
  const { 
    isDataSaved, 
    lastSaved, 
    saveCVData, 
    loadFromFile, 
    exportToFile 
  } = useCV();
  
  const fileInputRef = useRef(null);

  const handleLoadFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      loadFromFile(file)
        .then(() => {
          alert('CV data loaded successfully!');
        })
        .catch((error) => {
          alert('Error loading file: ' + error.message);
        });
    }
  };

  const handleExportToFile = () => {
    try {
      exportToFile();
      alert('CV data exported successfully!');
    } catch (error) {
      alert('Error exporting file: ' + error.message);
    }
  };

  return (
    <div className="save-load-component">
      <div className="save-load-header">
        <h3>Save & Load</h3>
        {isDataSaved && (
          <div className="save-indicator">
            <FiCheck className="save-icon" />
            <span>Saved!</span>
          </div>
        )}
      </div>

      <div className="save-load-actions">
        <button 
          className="btn btn-secondary save-btn"
          onClick={saveCVData}
        >
          <FiSave />
          Save Now
        </button>

        <button 
          className="btn btn-outline export-btn"
          onClick={handleExportToFile}
        >
          <FiDownload />
          Export Data
        </button>

        <button 
          className="btn btn-outline load-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          <FiUpload />
          Load Data
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleLoadFromFile}
          style={{ display: 'none' }}
        />
      </div>

      {lastSaved && (
        <div className="last-saved">
          <FiClock className="clock-icon" />
          <span>Last saved: {lastSaved}</span>
        </div>
      )}

      <div className="save-info">
        <p>💾 Your CV data is automatically saved as you type</p>
        <p>📁 Export to backup your data or share between devices</p>
        <p>📥 Import to restore from a backup file</p>
      </div>
    </div>
  );
};

export default SaveLoadComponent;
