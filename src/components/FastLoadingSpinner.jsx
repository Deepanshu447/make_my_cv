import React from 'react';
import './FastLoadingSpinner.css';

const FastLoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  return (
    <div className={`fast-spinner ${size} ${color}`}>
      <div className="spinner-ring"></div>
    </div>
  );
};

export default FastLoadingSpinner;
