import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCV } from '../contexts/CVContext';
import { FiFileText, FiLayers, FiEye, FiUser, FiClock, FiCheck } from 'react-icons/fi';
import CVValidation from '../components/CVValidation';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { cvData, selectedTemplate, isDataSaved, lastSaved } = useCV();

  const getProgressPercentage = () => {
    let completed = 0;
    let total = 7;

    // Personal info
    if (cvData.personalInfo.fullName && cvData.personalInfo.email) completed++;
    
    // Experience
    if (cvData.experience.length > 0) completed++;
    
    // Education
    if (cvData.education.length > 0) completed++;
    
    // Skills
    if (cvData.skills.length > 0) completed++;
    
    // Template selection
    if (selectedTemplate) completed++;
    
    // Summary
    if (cvData.personalInfo.summary) completed++;
    
    // Additional sections (languages, certifications, projects)
    if (cvData.languages.length > 0 || cvData.certifications.length > 0 || cvData.projects.length > 0) completed++;

    return Math.round((completed / total) * 100);
  };

  const progressPercentage = getProgressPercentage();

  const quickActions = [
    {
      title: 'Fill CV Details',
      description: 'Add your personal information, experience, and education',
      icon: 'FiFileText',
      link: '/cv-form',
      color: 'blue'
    },
    {
      title: 'Choose Template',
      description: 'Select from our professional CV templates',
      icon: 'FiLayers',
      link: '/templates',
      color: 'purple'
    },
    {
      title: 'Preview CV',
      description: 'Review your CV before downloading',
      icon: 'FiEye',
      link: '/preview',
      color: 'green'
    }
  ];

  const recentActivity = [
    {
      action: 'Account Created',
      date: 'Today',
      icon: <FiUser />,
      status: 'completed'
    },
    {
      action: 'Started CV Builder',
      date: 'Today',
      icon: <FiClock />,
      status: 'in-progress'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="dashboard-title">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="dashboard-subtitle">
              Let's create an outstanding CV that gets you noticed
            </p>
            {isDataSaved && (
              <div className="save-status-indicator">
                <FiCheck className="save-icon" />
                <span>All changes saved</span>
              </div>
            )}
            {lastSaved && !isDataSaved && (
              <div className="last-saved-indicator">
                <FiClock className="clock-icon" />
                <span>Last saved: {lastSaved}</span>
              </div>
            )}
          </div>
          
          <div className="user-status">
            <div className="subscription-info">
              <span className={`subscription-badge ${user.subscription}`}>
                {user.subscription === 'premium' ? 'Premium' : 'Free'} Plan
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <div className="progress-section">
              <div className="section-header">
                <h2>CV Progress</h2>
                <span className="progress-percentage">{progressPercentage}%</span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="progress-steps">
                <div className={`progress-step ${cvData.personalInfo.fullName ? 'completed' : ''}`}>
                  <div className="step-icon">
                    {cvData.personalInfo.fullName ? <FiCheck /> : '1'}
                  </div>
                  <span>Personal Info</span>
                </div>
                <div className={`progress-step ${cvData.experience.length > 0 ? 'completed' : ''}`}>
                  <div className="step-icon">
                    {cvData.experience.length > 0 ? <FiCheck /> : '2'}
                  </div>
                  <span>Experience</span>
                </div>
                <div className={`progress-step ${selectedTemplate ? 'completed' : ''}`}>
                  <div className="step-icon">
                    {selectedTemplate ? <FiCheck /> : '3'}
                  </div>
                  <span>Template</span>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="actions-grid">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon === 'FiFileText' ? FiFileText : 
                                       action.icon === 'FiLayers' ? FiLayers : 
                                       action.icon === 'FiEye' ? FiEye : FiFileText;
                  
                  return (
                    <Link 
                      key={index} 
                      to={action.link} 
                      className={`action-card ${action.color}`}
                    >
                      <div className="action-icon"><IconComponent /></div>
                      <h3>{action.title}</h3>
                      <p>{action.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="dashboard-sidebar">
            <CVValidation />
            
            <div className="stats-card">
              <h3>Your Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{cvData.experience.length}</div>
                  <div className="stat-label">Experiences</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{cvData.education.length}</div>
                  <div className="stat-label">Education</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{cvData.skills.length}</div>
                  <div className="stat-label">Skills</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{selectedTemplate ? '1' : '0'}</div>
                  <div className="stat-label">Templates</div>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className={`activity-icon ${activity.status}`}>
                      {activity.icon}
                    </div>
                    <div className="activity-content">
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-date">{activity.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {user.subscription === 'free' && (
              <div className="upgrade-card">
                <h3>Upgrade to Premium</h3>
                <p>Unlock premium templates and advanced features</p>
                <Link to="/subscription" className="btn btn-primary">
                  Upgrade Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
