import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCV } from '../contexts/CVContext';
import { useAuth } from '../contexts/AuthContext';
import { FiCheck, FiStar, FiEye, FiArrowRight, FiLock } from 'react-icons/fi';
import './TemplateSelection.css';

const TemplateSelection = () => {
  const { cvData, selectedTemplate, setSelectedTemplate } = useCV();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const templates = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and contemporary design perfect for tech and creative industries',
      category: 'free',
      image: '/api/placeholder/400/500',
      preview: 'modern-preview',
      features: ['Clean layout', 'Professional typography', 'Easy to customize'],
      trending: false
    },
    {
      id: 'classic',
      name: 'Classic Executive',
      description: 'Traditional and formal design ideal for corporate and finance roles',
      category: 'free',
      image: '/api/placeholder/400/500',
      preview: 'classic-preview',
      features: ['Traditional layout', 'Conservative styling', 'Corporate approved'],
      trending: false
    },
    {
      id: 'creative',
      name: 'Creative Portfolio',
      description: 'Bold and artistic design for designers, artists, and creative professionals',
      category: 'premium',
      image: '/api/placeholder/400/500',
      preview: 'creative-preview',
      features: ['Unique layout', 'Visual elements', 'Portfolio integration'],
      trending: false
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Ultra-minimal design with focus on content and readability',
      category: 'free',
      image: '/api/placeholder/400/500',
      preview: 'minimal-preview',
      features: ['Minimal design', 'Focus on content', 'Easy to read'],
      trending: false
    },
    {
      id: 'technical',
      name: 'Technical Specialist',
      description: 'Structured layout perfect for engineers and technical roles',
      category: 'premium',
      image: '/api/placeholder/400/500',
      preview: 'technical-preview',
      features: ['Technical sections', 'Skills focus', 'Project highlights'],
      trending: false
    },
    {
      id: 'executive',
      name: 'Executive Summary',
      description: 'High-level design for senior executives and C-level positions',
      category: 'premium',
      image: '/api/placeholder/400/500',
      preview: 'executive-preview',
      features: ['Executive layout', 'Leadership focus', 'Achievement highlights'],
      trending: false
    },
    // NEW 2024 TEMPLATES
    {
      id: 'neon',
      name: 'Neon Futuristic',
      description: 'Bold neon accents with dark theme - perfect for tech startups and gaming industry',
      category: 'premium',
      image: '/api/placeholder/400/500',
      preview: 'neon-preview',
      features: ['Neon accents', 'Dark theme', 'Futuristic design', 'Gaming industry'],
      trending: true,
      new: true
    },
    {
      id: 'glassmorphism',
      name: 'Glassmorphism',
      description: 'Modern glass effect with blur and transparency - trending in 2024',
      category: 'premium',
      image: '/api/placeholder/400/500',
      preview: 'glassmorphism-preview',
      features: ['Glass effect', 'Blur effects', 'Transparency', 'Modern UI'],
      trending: true,
      new: true
    },
    {
      id: 'gradient',
      name: 'Gradient Modern',
      description: 'Beautiful gradient backgrounds with modern typography',
      category: 'premium',
      image: '/api/placeholder/400/500',
      preview: 'gradient-preview',
      features: ['Gradient backgrounds', 'Modern typography', 'Colorful design'],
      trending: true,
      new: true
    },
    {
      id: 'brutalist',
      name: 'Brutalist Bold',
      description: 'Bold, geometric design with strong typography - perfect for designers',
      category: 'premium',
      image: '/api/placeholder/400/500',
      preview: 'brutalist-preview',
      features: ['Bold typography', 'Geometric shapes', 'Strong contrast', 'Designer focused'],
      trending: true,
      new: true
    },
    {
      id: 'ai_optimized',
      name: 'AI Optimized',
      description: 'ATS-friendly design optimized for AI resume screening systems',
      category: 'premium',
      image: '/api/placeholder/400/500',
      preview: 'ai-optimized-preview',
      features: ['ATS optimized', 'AI friendly', 'Keyword focused', '2024 standard'],
      trending: true,
      new: true
    },
    {
      id: 'carbon',
      name: 'Carbon Dark',
      description: 'Professional dark theme with carbon fiber aesthetics',
      category: 'premium',
      image: '/api/placeholder/400/500',
      preview: 'carbon-preview',
      features: ['Dark theme', 'Carbon aesthetics', 'Professional look', 'Tech industry'],
      trending: true,
      new: true
    },
    {
      id: 'minimalist_2024',
      name: 'Minimalist 2024',
      description: 'Ultra-clean design with micro-interactions and modern spacing',
      category: 'free',
      image: '/api/placeholder/400/500',
      preview: 'minimalist-2024-preview',
      features: ['Ultra-clean', 'Micro-interactions', 'Modern spacing', 'Free template'],
      trending: true,
      new: true
    },
    {
      id: 'startup',
      name: 'Startup Dynamic',
      description: 'Dynamic layout perfect for startup founders and entrepreneurs',
      category: 'premium',
      image: '/api/placeholder/400/500',
      preview: 'startup-preview',
      features: ['Dynamic layout', 'Startup focused', 'Entrepreneur friendly', 'Innovation theme'],
      trending: true,
      new: true
    }
  ];

  const handleSelectTemplate = (template) => {
    if (template.category === 'premium' && user.subscription !== 'premium') {
      navigate('/subscription');
      return;
    }
    setSelectedTemplate(template);
    navigate('/preview');
  };

  const handlePreview = (template) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  const isTemplateLocked = (template) => {
    return template.category === 'premium' && user.subscription !== 'premium';
  };

  const canAccessTemplate = (template) => {
    return template.category === 'free' || user.subscription === 'premium';
  };

  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const getFilteredTemplates = () => {
    switch (activeFilter) {
      case 'free':
        return templates.filter(template => template.category === 'free');
      case 'premium':
        return templates.filter(template => template.category === 'premium');
      case 'trending':
        return templates.filter(template => template.trending);
      case 'new':
        return templates.filter(template => template.new);
      default:
        return templates;
    }
  };

  return (
    <div className="template-selection">
      <div className="template-container">
        <div className="template-header">
          <h1>Choose Your CV Template</h1>
          <p>Select from our collection of professional CV templates</p>
          
          {selectedTemplate && (
            <div className="selected-template-notice">
              <FiCheck className="check-icon" />
              <span>Template "{selectedTemplate.name}" is currently selected</span>
            </div>
          )}
        </div>

        <div className="template-filters">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All Templates
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'free' ? 'active' : ''}`}
              onClick={() => handleFilterChange('free')}
            >
              Free
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'premium' ? 'active' : ''}`}
              onClick={() => handleFilterChange('premium')}
            >
              Premium
            </button>
            <button 
              className={`filter-tab trending ${activeFilter === 'trending' ? 'active' : ''}`}
              onClick={() => handleFilterChange('trending')}
            >
              🔥 Trending
            </button>
            <button 
              className={`filter-tab new ${activeFilter === 'new' ? 'active' : ''}`}
              onClick={() => handleFilterChange('new')}
            >
              ✨ New 2024
            </button>
          </div>
          
          {user.subscription !== 'premium' && (
            <Link to="/subscription" className="upgrade-link">
              <FiStar />
              Upgrade to Premium
            </Link>
          )}
        </div>

        <div className="templates-grid">
          {getFilteredTemplates().map((template) => (
            <div key={template.id} className={`template-card ${isTemplateLocked(template) ? 'locked' : ''} ${template.trending ? 'trending' : ''} ${template.new ? 'new' : ''}`}>
              <div className="template-image">
                <div className="template-preview-placeholder">
                  <div className="preview-content">
                    <div className="preview-header">
                      <div className="preview-name">John Doe</div>
                      <div className="preview-title">Software Engineer</div>
                    </div>
                    <div className="preview-sections">
                      <div className="preview-section">
                        <div className="section-title">Experience</div>
                        <div className="section-content">Senior Developer at Tech Corp</div>
                      </div>
                      <div className="preview-section">
                        <div className="section-title">Education</div>
                        <div className="section-content">BS Computer Science</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Template Badges */}
                <div className="template-badges">
                  {template.new && (
                    <span className="badge new-badge">✨ New 2024</span>
                  )}
                  {template.trending && (
                    <span className="badge trending-badge">🔥 Trending</span>
                  )}
                  {template.category === 'premium' && (
                    <span className="badge premium-badge">⭐ Premium</span>
                  )}
                </div>
                
                {isTemplateLocked(template) && (
                  <div className="template-overlay">
                    <FiLock className="lock-icon" />
                    <span>Premium Template</span>
                  </div>
                )}
                
                <div className="template-actions">
                  <button 
                    className="action-btn preview-btn"
                    onClick={() => handlePreview(template)}
                  >
                    <FiEye />
                    Preview
                  </button>
                  
                  {canAccessTemplate(template) ? (
                    <button 
                      className={`action-btn select-btn ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                      onClick={() => handleSelectTemplate(template)}
                    >
                      {selectedTemplate?.id === template.id ? (
                        <>
                          <FiCheck />
                          Selected
                        </>
                      ) : (
                        <>
                          <FiArrowRight />
                          Select
                        </>
                      )}
                    </button>
                  ) : (
                    <button 
                      className="action-btn upgrade-btn"
                      onClick={() => navigate('/subscription')}
                    >
                      <FiStar />
                      Upgrade
                    </button>
                  )}
                </div>
              </div>
              
              <div className="template-info">
                <div className="template-meta">
                  <h3>{template.name}</h3>
                  <span className={`template-category ${template.category}`}>
                    {template.category === 'premium' ? 'Premium' : 'Free'}
                  </span>
                </div>
                
                <p className="template-description">{template.description}</p>
                
                <div className="template-features">
                  {template.features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedTemplate && (
          <div className="template-actions-footer">
            <Link to="/cv-form" className="btn btn-secondary">
              Back to CV Form
            </Link>
            <Link to="/preview" className="btn btn-primary">
              Preview CV
            </Link>
          </div>
        )}
      </div>

      {previewTemplate && (
        <div className="template-preview-modal" onClick={closePreview}>
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h2>Preview: {previewTemplate.name}</h2>
              <button className="close-btn" onClick={closePreview}>×</button>
            </div>
            
            <div className="preview-modal-body">
              <div className="template-preview-large">
                <div className="preview-cv">
                  <div className="cv-header">
                    <h1>John Doe</h1>
                    <p>Software Engineer</p>
                    <div className="contact-info">
                      <span>john.doe@email.com</span>
                      <span>+1 (555) 123-4567</span>
                      <span>linkedin.com/in/johndoe</span>
                    </div>
                  </div>
                  
                  <div className="cv-section">
                    <h2>Professional Summary</h2>
                    <p>Experienced software engineer with 5+ years in full-stack development...</p>
                  </div>
                  
                  <div className="cv-section">
                    <h2>Experience</h2>
                    <div className="experience-item">
                      <h3>Senior Developer</h3>
                      <p>Tech Corp • 2020 - Present</p>
                      <ul>
                        <li>Led development of web applications</li>
                        <li>Mentored junior developers</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="cv-section">
                    <h2>Education</h2>
                    <div className="education-item">
                      <h3>Bachelor of Science in Computer Science</h3>
                      <p>University of Technology • 2018</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="preview-modal-footer">
              {canAccessTemplate(previewTemplate) ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    handleSelectTemplate(previewTemplate);
                    closePreview();
                  }}
                >
                  Select This Template
                </button>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    closePreview();
                    navigate('/subscription');
                  }}
                >
                  Upgrade to Use This Template
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelection;
