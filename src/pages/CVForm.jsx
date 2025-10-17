import React, { useState } from 'react';
import { useCV } from '../contexts/CVContext';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLinkedin, FiGlobe, FiPlus, FiTrash2, FiEdit3, FiSave } from 'react-icons/fi';
import SaveLoadComponent from '../components/SaveLoadComponent';
import './CVForm.css';

const CVForm = () => {
  const { cvData, updatePersonalInfo, addExperience, updateExperience, removeExperience, addEducation, updateEducation, removeEducation, addSkill, removeSkill, addLanguage, removeLanguage, addCertification, removeCertification, addProject, removeProject } = useCV();
  const { user } = useAuth();
  
  const [activeSection, setActiveSection] = useState('personal');
  const [editingItem, setEditingItem] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: <FiUser /> },
    { id: 'experience', label: 'Experience', icon: <FiEdit3 /> },
    { id: 'education', label: 'Education', icon: <FiSave /> },
    { id: 'skills', label: 'Skills', icon: <FiPlus /> },
    { id: 'languages', label: 'Languages', icon: <FiGlobe /> },
    { id: 'certifications', label: 'Certifications', icon: <FiTrash2 /> },
    { id: 'projects', label: 'Projects', icon: <FiLinkedin /> }
  ];

  const handlePersonalInfoChange = (field, value) => {
    updatePersonalInfo({ [field]: value });
  };

  const handleAddExperience = () => {
    addExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false
    });
  };

  const handleUpdateExperience = (id, field, value) => {
    updateExperience(id, { [field]: value });
  };

  const handleAddEducation = () => {
    addEducation({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      current: false
    });
  };

  const handleUpdateEducation = (id, field, value) => {
    updateEducation(id, { [field]: value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill({ name: newSkill.trim(), level: 'Intermediate' });
      setNewSkill('');
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      addLanguage({ name: newLanguage.trim(), level: 'Intermediate' });
      setNewLanguage('');
    }
  };

  const handleAddCertification = () => {
    addCertification({
      name: '',
      issuer: '',
      date: '',
      credentialId: ''
    });
  };

  const handleAddProject = () => {
    addProject({
      name: '',
      description: '',
      technologies: '',
      url: '',
      startDate: '',
      endDate: ''
    });
  };

  const renderPersonalInfo = () => (
    <div className="form-section">
      <h2>Personal Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            className="form-input"
            value={cvData.personalInfo.fullName}
            onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-input"
            value={cvData.personalInfo.email}
            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-input"
            value={cvData.personalInfo.phone}
            onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-input"
            value={cvData.personalInfo.address}
            onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
            placeholder="Enter your address"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">LinkedIn</label>
          <input
            type="url"
            className="form-input"
            value={cvData.personalInfo.linkedin}
            onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Website</label>
          <input
            type="url"
            className="form-input"
            value={cvData.personalInfo.website}
            onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label className="form-label">Professional Summary</label>
        <textarea
          className="form-input form-textarea"
          value={cvData.personalInfo.summary}
          onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
          placeholder="Write a brief summary of your professional background and goals..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="form-section">
      <div className="section-header">
        <h2>Work Experience</h2>
        <button className="btn btn-primary" onClick={handleAddExperience}>
          <FiPlus /> Add Experience
        </button>
      </div>
      
      {cvData.experience.map((exp, index) => (
        <div key={exp.id} className="form-card">
          <div className="card-header">
            <h3>Experience #{index + 1}</h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => removeExperience(exp.id)}
            >
              <FiTrash2 /> Remove
            </button>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Company *</label>
              <input
                type="text"
                className="form-input"
                value={exp.company}
                onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                placeholder="Company name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Position *</label>
              <input
                type="text"
                className="form-input"
                value={exp.position}
                onChange={(e) => handleUpdateExperience(exp.id, 'position', e.target.value)}
                placeholder="Job title"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={exp.startDate}
                onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={exp.endDate}
                onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => handleUpdateExperience(exp.id, 'current', e.target.checked)}
                />
                Currently working here
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              value={exp.description}
              onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
              placeholder="Describe your responsibilities and achievements..."
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderEducation = () => (
    <div className="form-section">
      <div className="section-header">
        <h2>Education</h2>
        <button className="btn btn-primary" onClick={handleAddEducation}>
          <FiPlus /> Add Education
        </button>
      </div>
      
      {cvData.education.map((edu, index) => (
        <div key={edu.id} className="form-card">
          <div className="card-header">
            <h3>Education #{index + 1}</h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => removeEducation(edu.id)}
            >
              <FiTrash2 /> Remove
            </button>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Institution *</label>
              <input
                type="text"
                className="form-input"
                value={edu.institution}
                onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                placeholder="University/School name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input
                type="text"
                className="form-input"
                value={edu.degree}
                onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                placeholder="Bachelor's, Master's, etc."
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Field of Study</label>
              <input
                type="text"
                className="form-input"
                value={edu.field}
                onChange={(e) => handleUpdateEducation(edu.id, 'field', e.target.value)}
                placeholder="Computer Science, Business, etc."
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">GPA</label>
              <input
                type="text"
                className="form-input"
                value={edu.gpa}
                onChange={(e) => handleUpdateEducation(edu.id, 'gpa', e.target.value)}
                placeholder="3.5/4.0"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={edu.startDate}
                onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={edu.endDate}
                onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
                disabled={edu.current}
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={edu.current}
                  onChange={(e) => handleUpdateEducation(edu.id, 'current', e.target.checked)}
                />
                Currently studying
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkills = () => (
    <div className="form-section">
      <div className="section-header">
        <h2>Skills</h2>
      </div>
      
      <div className="add-skill-container">
        <div className="form-group">
          <label className="form-label">Add New Skill</label>
          <div className="input-with-button">
            <input
              type="text"
              className="form-input"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter skill name (e.g., JavaScript, Python, React)"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
            />
            <button 
              className="btn btn-primary"
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
            >
              <FiPlus /> Add
            </button>
          </div>
        </div>
      </div>
      
      {cvData.skills.length > 0 && (
        <>
          <h3>Your Skills</h3>
          <div className="skills-grid">
            {cvData.skills.map((skill) => (
              <div key={skill.id} className="skill-item">
                <span>{skill.name}</span>
                <button 
                  className="remove-btn"
                  onClick={() => removeSkill(skill.id)}
                  title="Remove skill"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderLanguages = () => (
    <div className="form-section">
      <div className="section-header">
        <h2>Languages</h2>
      </div>
      
      <div className="add-language-container">
        <div className="form-group">
          <label className="form-label">Add New Language</label>
          <div className="input-with-button">
            <input
              type="text"
              className="form-input"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Enter language (e.g., English, Spanish, French)"
              onKeyPress={(e) => e.key === 'Enter' && handleAddLanguage()}
            />
            <button 
              className="btn btn-primary"
              onClick={handleAddLanguage}
              disabled={!newLanguage.trim()}
            >
              <FiPlus /> Add
            </button>
          </div>
        </div>
      </div>
      
      {cvData.languages.length > 0 && (
        <>
          <h3>Your Languages</h3>
          <div className="languages-grid">
            {cvData.languages.map((language) => (
              <div key={language.id} className="language-item">
                <span>{language.name}</span>
                <button 
                  className="remove-btn"
                  onClick={() => removeLanguage(language.id)}
                  title="Remove language"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderCertifications = () => (
    <div className="form-section">
      <div className="section-header">
        <h2>Certifications</h2>
        <button className="btn btn-primary" onClick={handleAddCertification}>
          <FiPlus /> Add Certification
        </button>
      </div>
      
      {cvData.certifications.map((cert, index) => (
        <div key={cert.id} className="form-card">
          <div className="card-header">
            <h3>Certification #{index + 1}</h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => removeCertification(cert.id)}
            >
              <FiTrash2 /> Remove
            </button>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Certification Name</label>
              <input
                type="text"
                className="form-input"
                value={cert.name}
                onChange={(e) => addCertification({...cert, name: e.target.value})}
                placeholder="Certification name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Issuing Organization</label>
              <input
                type="text"
                className="form-input"
                value={cert.issuer}
                onChange={(e) => addCertification({...cert, issuer: e.target.value})}
                placeholder="Organization name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Issue Date</label>
              <input
                type="date"
                className="form-input"
                value={cert.date}
                onChange={(e) => addCertification({...cert, date: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Credential ID</label>
              <input
                type="text"
                className="form-input"
                value={cert.credentialId}
                onChange={(e) => addCertification({...cert, credentialId: e.target.value})}
                placeholder="Optional credential ID"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProjects = () => (
    <div className="form-section">
      <div className="section-header">
        <h2>Projects</h2>
        <button className="btn btn-primary" onClick={handleAddProject}>
          <FiPlus /> Add Project
        </button>
      </div>
      
      {cvData.projects.map((project, index) => (
        <div key={project.id} className="form-card">
          <div className="card-header">
            <h3>Project #{index + 1}</h3>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => removeProject(project.id)}
            >
              <FiTrash2 /> Remove
            </button>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Project Name</label>
              <input
                type="text"
                className="form-input"
                value={project.name}
                onChange={(e) => addProject({...project, name: e.target.value})}
                placeholder="Project name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Technologies Used</label>
              <input
                type="text"
                className="form-input"
                value={project.technologies}
                onChange={(e) => addProject({...project, technologies: e.target.value})}
                placeholder="React, Node.js, Python, etc."
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Project URL</label>
              <input
                type="url"
                className="form-input"
                value={project.url}
                onChange={(e) => addProject({...project, url: e.target.value})}
                placeholder="https://github.com/username/project"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={project.startDate}
                onChange={(e) => addProject({...project, startDate: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={project.endDate}
                onChange={(e) => addProject({...project, endDate: e.target.value})}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              value={project.description}
              onChange={(e) => addProject({...project, description: e.target.value})}
              placeholder="Describe the project and your role..."
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalInfo();
      case 'experience':
        return renderExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      case 'languages':
        return renderLanguages();
      case 'certifications':
        return renderCertifications();
      case 'projects':
        return renderProjects();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="cv-form">
      <div className="cv-form-container">
        <div className="form-sidebar">
          <h2>CV Sections</h2>
          <nav className="section-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`section-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="form-content">
          <div className="content-header">
            <h1>Build Your CV</h1>
            <p>Fill in your information to create a professional resume</p>
          </div>
          
          <SaveLoadComponent />
          
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default CVForm;
