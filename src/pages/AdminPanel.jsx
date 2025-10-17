import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiUsers, FiMail, FiDownload, FiEye, FiClock, FiCheck, FiX, FiSearch, FiFilter, FiRefreshCw, FiFileText } from 'react-icons/fi';
import { getCVRequests, updateCVRequestStatus } from '../firebase/cvData';
import { sendAdminNotification } from '../services/emailService';
import { trackAdminAction } from '../services/analyticsService';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [cvRequests, setCvRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [previewModal, setPreviewModal] = useState({ isOpen: false, request: null });

  // Load CV requests from Firebase
  useEffect(() => {
    loadCVRequests();
  }, []);

  const loadCVRequests = async () => {
    setIsLoading(true);
    try {
      const result = await getCVRequests();
      if (result.success) {
        setCvRequests(result.data || []);
      } else {
        console.error('Failed to load CV requests:', result.error);
        // Fallback to mock data for demo
        loadMockData();
      }
    } catch (error) {
      console.error('Error loading CV requests:', error);
      // Fallback to mock data for demo
      loadMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadMockData = () => {
    const mockRequests = [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john.doe@email.com',
        templateId: 'modern',
        templateName: 'Modern Professional',
        subscription: 'premium',
        status: 'pending',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        personalInfo: {
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          address: 'New York, NY'
        },
        experience: [
          {
            company: 'Tech Corp',
            position: 'Senior Developer',
            startDate: '2020-01-01',
            endDate: '2024-01-01',
            description: 'Led development of web applications'
          }
        ],
        education: [
          {
            institution: 'University of Technology',
            degree: 'Bachelor of Science in Computer Science',
            startDate: '2016-09-01',
            endDate: '2020-06-01'
          }
        ]
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        userEmail: 'jane.smith@email.com',
        templateId: 'classic',
        templateName: 'Classic Executive',
        subscription: 'free',
        status: 'completed',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-14T16:45:00Z',
        personalInfo: {
          fullName: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+1 (555) 987-6543'
        },
        experience: [
          {
            company: 'Business Inc',
            position: 'Marketing Manager',
            startDate: '2019-03-01',
            endDate: '',
            current: true,
            description: 'Managed marketing campaigns and team of 5'
          }
        ]
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Mike Johnson',
        userEmail: 'mike.johnson@email.com',
        templateId: 'creative',
        templateName: 'Creative Portfolio',
        subscription: 'premium',
        status: 'in_progress',
        createdAt: '2024-01-16T09:15:00Z',
        updatedAt: '2024-01-16T11:30:00Z',
        personalInfo: {
          fullName: 'Mike Johnson',
          email: 'mike.johnson@email.com',
          phone: '+1 (555) 456-7890'
        }
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setCvRequests(mockRequests);
      setIsLoading(false);
    }, 1000);
  };

  const tabs = [
    { id: 'pending', label: 'Pending Requests', count: cvRequests.filter(r => r.status === 'pending').length },
    { id: 'in_progress', label: 'In Progress', count: cvRequests.filter(r => r.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: cvRequests.filter(r => r.status === 'completed').length },
    { id: 'all', label: 'All Requests', count: cvRequests.length }
  ];

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      // Update status in Firebase
      const result = await updateCVRequestStatus(requestId, newStatus);
      
      if (result.success) {
        // Update local state
        setCvRequests(prev => 
          prev.map(request => 
            request.id === requestId 
              ? { ...request, status: newStatus, updatedAt: new Date().toISOString() }
              : request
          )
        );
        
        // Track admin action
        trackAdminAction('status_update', user.email, requestId);
        
        // Send notification if status changed to completed
        if (newStatus === 'completed') {
          const request = cvRequests.find(r => r.id === requestId);
          if (request) {
            await sendAdminNotification(request);
          }
        }
      } else {
        console.error('Failed to update status:', result.error);
        alert('Failed to update status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const handlePreviewCV = (request) => {
    setPreviewModal({ isOpen: true, request });
  };

  const closePreviewModal = () => {
    setPreviewModal({ isOpen: false, request: null });
  };

  const handleEmailCV = (request) => {
    // In a real app, this would trigger an email to be sent
    alert(`CV will be emailed to ${request.userEmail}`);
    handleStatusChange(request.id, 'completed');
    closePreviewModal();
  };

  const handleDownloadCV = (request) => {
    // In a real app, this would generate and download the CV PDF
    alert(`Downloading CV for ${request.userName}`);
  };

  const filteredRequests = cvRequests.filter(request => {
    const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'yellow', icon: <FiClock />, label: 'Pending' },
      in_progress: { color: 'blue', icon: <FiRefreshCw />, label: 'In Progress' },
      completed: { color: 'green', icon: <FiCheck />, label: 'Completed' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`status-badge ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSubscriptionBadge = (subscription) => {
    return (
      <span className={`subscription-badge ${subscription}`}>
        {subscription === 'premium' ? 'Premium' : 'Free'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="admin-panel loading">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage CV requests and user submissions</p>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <FiUsers />
            </div>
            <div className="stat-content">
              <div className="stat-value">{cvRequests.length}</div>
              <div className="stat-label">Total Requests</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiClock />
            </div>
            <div className="stat-content">
              <div className="stat-value">{cvRequests.filter(r => r.status === 'pending').length}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiRefreshCw />
            </div>
            <div className="stat-content">
              <div className="stat-value">{cvRequests.filter(r => r.status === 'in_progress').length}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiCheck />
            </div>
            <div className="stat-content">
              <div className="stat-value">{cvRequests.filter(r => r.status === 'completed').length}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        <div className="admin-controls">
          <div className="search-filter">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-dropdown">
              <FiFilter className="filter-icon" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.id);
                setFilterStatus(tab.id === 'all' ? 'all' : tab.id);
              }}
            >
              {tab.label}
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="requests-table">
          <div className="table-header">
            <div className="header-cell">User</div>
            <div className="header-cell">Template</div>
            <div className="header-cell">Subscription</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Created</div>
            <div className="header-cell">Actions</div>
          </div>
          
          <div className="table-body">
            {filteredRequests.map(request => (
              <div key={request.id} className="table-row">
                <div className="table-cell user-cell">
                  <div className="user-info">
                    <div className="user-name">{request.userName}</div>
                    <div className="user-email">{request.userEmail}</div>
                  </div>
                </div>
                
                <div className="table-cell">
                  <div className="template-info">
                    <div className="template-name">{request.templateName}</div>
                    <div className="template-id">{request.templateId}</div>
                  </div>
                </div>
                
                <div className="table-cell">
                  {getSubscriptionBadge(request.subscription)}
                </div>
                
                <div className="table-cell">
                  {getStatusBadge(request.status)}
                </div>
                
                <div className="table-cell">
                  <div className="date-info">
                    <div className="created-date">{formatDate(request.createdAt)}</div>
                    {request.updatedAt !== request.createdAt && (
                      <div className="updated-date">Updated: {formatDate(request.updatedAt)}</div>
                    )}
                  </div>
                </div>
                
                <div className="table-cell actions-cell">
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handlePreviewCV(request)}
                    >
                      <FiEye />
                      Preview
                    </button>
                    
                    {request.status === 'pending' && (
                      <button 
                        className="action-btn progress-btn"
                        onClick={() => handleStatusChange(request.id, 'in_progress')}
                      >
                        <FiRefreshCw />
                        Start
                      </button>
                    )}
                    
                    {request.status === 'in_progress' && (
                      <button 
                        className="action-btn email-btn"
                        onClick={() => handleEmailCV(request)}
                      >
                        <FiMail />
                        Email CV
                      </button>
                    )}
                    
                    {request.status !== 'completed' && (
                      <button 
                        className="action-btn complete-btn"
                        onClick={() => handleStatusChange(request.id, 'completed')}
                      >
                        <FiCheck />
                        Complete
                      </button>
                    )}
                    
                    <button 
                      className="action-btn download-btn"
                      onClick={() => handleDownloadCV(request)}
                    >
                      <FiDownload />
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredRequests.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <FiUsers />
            </div>
            <h3>No requests found</h3>
            <p>No CV requests match your current filters.</p>
          </div>
        )}
      </div>

      {/* CV Preview Modal */}
      {previewModal.isOpen && (
        <div className="preview-modal-overlay" onClick={closePreviewModal}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <div className="preview-user-info">
                <h2>CV Preview - {previewModal.request.userName}</h2>
                <p>{previewModal.request.userEmail}</p>
                <div className="preview-template-info">
                  <span className="template-badge">{previewModal.request.templateName}</span>
                  <span className="subscription-badge">{previewModal.request.subscription}</span>
                </div>
              </div>
              <button className="close-modal-btn" onClick={closePreviewModal}>
                <FiX />
              </button>
            </div>

            <div className="preview-modal-body">
              <div className="cv-preview-content">
                <div className="cv-preview-header">
                  <h1>{previewModal.request.personalInfo.fullName}</h1>
                  <div className="contact-preview">
                    <p>📧 {previewModal.request.personalInfo.email}</p>
                    {previewModal.request.personalInfo.phone && (
                      <p>📱 {previewModal.request.personalInfo.phone}</p>
                    )}
                    {previewModal.request.personalInfo.address && (
                      <p>📍 {previewModal.request.personalInfo.address}</p>
                    )}
                  </div>
                </div>

                {previewModal.request.personalInfo.summary && (
                  <div className="cv-preview-section">
                    <h3>Professional Summary</h3>
                    <p>{previewModal.request.personalInfo.summary}</p>
                  </div>
                )}

                {previewModal.request.experience && previewModal.request.experience.length > 0 && (
                  <div className="cv-preview-section">
                    <h3>Experience</h3>
                    {previewModal.request.experience.map((exp, index) => (
                      <div key={index} className="experience-preview">
                        <h4>{exp.position} - {exp.company}</h4>
                        <p className="experience-dates">
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </p>
                        {exp.description && <p>{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {previewModal.request.education && previewModal.request.education.length > 0 && (
                  <div className="cv-preview-section">
                    <h3>Education</h3>
                    {previewModal.request.education.map((edu, index) => (
                      <div key={index} className="education-preview">
                        <h4>{edu.degree}</h4>
                        <p>{edu.institution}</p>
                        <p className="education-dates">
                          {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                        </p>
                        {edu.gpa && <p>GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                )}

                <div className="preview-template-info-bottom">
                  <p><strong>Template:</strong> {previewModal.request.templateName}</p>
                  <p><strong>Subscription:</strong> {previewModal.request.subscription}</p>
                  <p><strong>Created:</strong> {formatDate(previewModal.request.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="preview-modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={closePreviewModal}
              >
                Close
              </button>
              
              <button 
                className="btn btn-outline"
                onClick={() => handleDownloadCV(previewModal.request)}
              >
                <FiDownload />
                Download PDF
              </button>
              
              {previewModal.request.status === 'in_progress' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleEmailCV(previewModal.request)}
                >
                  <FiMail />
                  Email CV
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
