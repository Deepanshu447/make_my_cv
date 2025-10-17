import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCV } from '../contexts/CVContext';
import { useAuth } from '../contexts/AuthContext';
import { FiDownload, FiEdit3, FiEye, FiArrowLeft, FiArrowRight, FiCheck, FiMail, FiPrinter } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { sendCVEmail } from '../services/emailService';
import { trackPDFDownload, trackCVCompletion } from '../services/analyticsService';
import { 
  NeonTemplate, 
  GlassmorphismTemplate, 
  GradientTemplate, 
  BrutalistTemplate, 
  AIOptimizedTemplate, 
  CarbonTemplate, 
  Minimalist2024Template, 
  StartupTemplate 
} from '../components/templates/ModernTemplates2024';
import './CVPreview.css';

const CVPreview = () => {
  const { cvData, selectedTemplate } = useCV();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleDownloadPDF = async () => {
    if (user.subscription !== 'premium') {
      navigate('/subscription');
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      const cvElement = document.getElementById('cv-preview');
      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `${cvData.personalInfo.fullName || 'CV'}-resume.pdf`;
      pdf.save(fileName);
      
      // Track PDF download
      trackPDFDownload(selectedTemplate, user.email, user.subscription);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleEmailCV = async () => {
    try {
      const result = await sendCVEmail(
        user.email,
        user.name,
        cvData,
        selectedTemplate
      );
      
      if (result.success) {
        alert(result.message);
        // Track CV completion
        trackCVCompletion(selectedTemplate, user.email, Object.keys(cvData).length);
      } else {
        alert('Failed to send CV. Please try again.');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      alert('Failed to send CV. Please try again.');
    }
  };

  const renderCVContent = () => {
    if (!selectedTemplate) {
      return (
        <div className="no-template-selected">
          <h2>No Template Selected</h2>
          <p>Please select a template first to preview your CV.</p>
          <Link to="/templates" className="btn btn-primary">
            Choose Template
          </Link>
        </div>
      );
    }

    switch (selectedTemplate.id) {
      case 'modern':
        return <ModernTemplate cvData={cvData} />;
      case 'classic':
        return <ClassicTemplate cvData={cvData} />;
      case 'creative':
        return <CreativeTemplate cvData={cvData} />;
      case 'minimal':
        return <MinimalTemplate cvData={cvData} />;
      case 'technical':
        return <TechnicalTemplate cvData={cvData} />;
      case 'executive':
        return <ExecutiveTemplate cvData={cvData} />;
      // NEW 2024 TEMPLATES
      case 'neon':
        return <NeonTemplate cvData={cvData} />;
      case 'glassmorphism':
        return <GlassmorphismTemplate cvData={cvData} />;
      case 'gradient':
        return <GradientTemplate cvData={cvData} />;
      case 'brutalist':
        return <BrutalistTemplate cvData={cvData} />;
      case 'ai_optimized':
        return <AIOptimizedTemplate cvData={cvData} />;
      case 'carbon':
        return <CarbonTemplate cvData={cvData} />;
      case 'minimalist_2024':
        return <Minimalist2024Template cvData={cvData} />;
      case 'startup':
        return <StartupTemplate cvData={cvData} />;
      default:
        return <ModernTemplate cvData={cvData} />;
    }
  };

  const canDownload = user?.subscription === 'premium';

  return (
    <div className="cv-preview">
      <div className="preview-container">
        <div className="preview-header">
          <div className="header-left">
            <Link to="/templates" className="back-btn">
              <FiArrowLeft />
              Back to Templates
            </Link>
            <h1>CV Preview</h1>
          </div>
          
          <div className="header-actions">
            <Link to="/cv-form" className="btn btn-secondary">
              <FiEdit3 />
              Edit CV
            </Link>
            
            <button 
              className="btn btn-outline"
              onClick={handleEmailCV}
            >
              <FiMail />
              Email CV
            </button>
            
            <button 
              className={`btn ${canDownload ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="spinner"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FiDownload />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        <div className="preview-content">
          <div className="preview-controls">
            <div className="zoom-controls">
              <button className="zoom-btn" onClick={() => setShowPreview(false)}>
                <FiEye />
                Hide Preview
              </button>
              <button className="zoom-btn" onClick={() => setShowPreview(true)}>
                <FiEye />
                Show Preview
              </button>
            </div>
            
            {!canDownload && (
              <div className="upgrade-notice">
                <FiCheck />
                <span>Upgrade to Premium to download your CV as PDF</span>
                <Link to="/subscription" className="upgrade-link">
                  Upgrade Now
                </Link>
              </div>
            )}
          </div>

          {showPreview && (
            <div className="cv-preview-container">
              <div id="cv-preview" className="cv-document">
                {renderCVContent()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Modern Template Component
const ModernTemplate = ({ cvData }) => (
  <div className="cv-template modern-template">
    <div className="cv-header">
      <h1 className="cv-name">{cvData.personalInfo.fullName || 'Your Name'}</h1>
      <p className="cv-title">Software Engineer</p>
      <div className="contact-info">
        {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
        {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
        {cvData.personalInfo.address && <span>{cvData.personalInfo.address}</span>}
        {cvData.personalInfo.linkedin && <span>{cvData.personalInfo.linkedin}</span>}
        {cvData.personalInfo.website && <span>{cvData.personalInfo.website}</span>}
      </div>
    </div>

    {cvData.personalInfo.summary && (
      <div className="cv-section">
        <h2>Professional Summary</h2>
        <p>{cvData.personalInfo.summary}</p>
      </div>
    )}

    {cvData.experience.length > 0 && (
      <div className="cv-section">
        <h2>Professional Experience</h2>
        {cvData.experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <h3>{exp.position}</h3>
              <div className="experience-meta">
                <span className="company">{exp.company}</span>
                <span className="duration">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
            </div>
            {exp.description && (
              <div className="experience-description">
                <p>{exp.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {cvData.education.length > 0 && (
      <div className="cv-section">
        <h2>Education</h2>
        {cvData.education.map((edu, index) => (
          <div key={index} className="education-item">
            <div className="education-header">
              <h3>{edu.degree}</h3>
              <div className="education-meta">
                <span className="institution">{edu.institution}</span>
                <span className="duration">
                  {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </span>
              </div>
            </div>
            {edu.field && <p className="field">{edu.field}</p>}
            {edu.gpa && <p className="gpa">GPA: {edu.gpa}</p>}
          </div>
        ))}
      </div>
    )}

    {cvData.skills.length > 0 && (
      <div className="cv-section">
        <h2>Skills</h2>
        <div className="skills-grid">
          {cvData.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill.name}</span>
          ))}
        </div>
      </div>
    )}

    {cvData.projects.length > 0 && (
      <div className="cv-section">
        <h2>Projects</h2>
        {cvData.projects.map((project, index) => (
          <div key={index} className="project-item">
            <div className="project-header">
              <h3>{project.name}</h3>
              {project.url && (
                <a href={project.url} className="project-link" target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              )}
            </div>
            {project.description && <p>{project.description}</p>}
            {project.technologies && (
              <div className="project-technologies">
                <strong>Technologies:</strong> {project.technologies}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {cvData.certifications.length > 0 && (
      <div className="cv-section">
        <h2>Certifications</h2>
        {cvData.certifications.map((cert, index) => (
          <div key={index} className="certification-item">
            <h3>{cert.name}</h3>
            <div className="certification-meta">
              <span className="issuer">{cert.issuer}</span>
              {cert.date && <span className="date">{cert.date}</span>}
            </div>
            {cert.credentialId && <p className="credential-id">ID: {cert.credentialId}</p>}
          </div>
        ))}
      </div>
    )}

    {cvData.languages.length > 0 && (
      <div className="cv-section">
        <h2>Languages</h2>
        <div className="languages-list">
          {cvData.languages.map((lang, index) => (
            <div key={index} className="language-item">
              <span className="language-name">{lang.name}</span>
              <span className="language-level">{lang.level}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Classic Template Component
const ClassicTemplate = ({ cvData }) => (
  <div className="cv-template classic-template">
    <div className="cv-header">
      <h1 className="cv-name">{cvData.personalInfo.fullName || 'Your Name'}</h1>
      <div className="contact-info">
        {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
        {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
        {cvData.personalInfo.address && <span>{cvData.personalInfo.address}</span>}
      </div>
    </div>

    {cvData.personalInfo.summary && (
      <div className="cv-section">
        <h2>OBJECTIVE</h2>
        <p>{cvData.personalInfo.summary}</p>
      </div>
    )}

    {cvData.experience.length > 0 && (
      <div className="cv-section">
        <h2>PROFESSIONAL EXPERIENCE</h2>
        {cvData.experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <h3>{exp.position} - {exp.company}</h3>
              <span className="duration">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </span>
            </div>
            {exp.description && <p>{exp.description}</p>}
          </div>
        ))}
      </div>
    )}

    {cvData.education.length > 0 && (
      <div className="cv-section">
        <h2>EDUCATION</h2>
        {cvData.education.map((edu, index) => (
          <div key={index} className="education-item">
            <h3>{edu.degree}</h3>
            <p>{edu.institution} • {edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
            {edu.gpa && <p>GPA: {edu.gpa}</p>}
          </div>
        ))}
      </div>
    )}

    {cvData.skills.length > 0 && (
      <div className="cv-section">
        <h2>SKILLS</h2>
        <p>{cvData.skills.map(skill => skill.name).join(' • ')}</p>
      </div>
    )}
  </div>
);

// Creative Template Component
const CreativeTemplate = ({ cvData }) => (
  <div className="cv-template creative-template">
    <div className="cv-header">
      <div className="header-left">
        <h1 className="cv-name">{cvData.personalInfo.fullName || 'Your Name'}</h1>
        <p className="cv-title">Creative Professional</p>
      </div>
      <div className="header-right">
        <div className="contact-info">
          {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
          {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
          {cvData.personalInfo.website && <span>{cvData.personalInfo.website}</span>}
        </div>
      </div>
    </div>

    {cvData.personalInfo.summary && (
      <div className="cv-section">
        <h2>About Me</h2>
        <p>{cvData.personalInfo.summary}</p>
      </div>
    )}

    {cvData.experience.length > 0 && (
      <div className="cv-section">
        <h2>Experience</h2>
        {cvData.experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <h3>{exp.position}</h3>
              <div className="experience-meta">
                <span className="company">{exp.company}</span>
                <span className="duration">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
            </div>
            {exp.description && <p>{exp.description}</p>}
          </div>
        ))}
      </div>
    )}

    {cvData.projects.length > 0 && (
      <div className="cv-section">
        <h2>Featured Projects</h2>
        <div className="projects-grid">
          {cvData.projects.map((project, index) => (
            <div key={index} className="project-card">
              <h3>{project.name}</h3>
              {project.description && <p>{project.description}</p>}
              {project.technologies && <p className="technologies">{project.technologies}</p>}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// Minimal Template Component
const MinimalTemplate = ({ cvData }) => (
  <div className="cv-template minimal-template">
    <div className="cv-header">
      <h1 className="cv-name">{cvData.personalInfo.fullName || 'Your Name'}</h1>
      <div className="contact-info">
        {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
        {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
      </div>
    </div>

    {cvData.experience.length > 0 && (
      <div className="cv-section">
        <h2>Experience</h2>
        {cvData.experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <h3>{exp.position}</h3>
            <p>{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
            {exp.description && <p>{exp.description}</p>}
          </div>
        ))}
      </div>
    )}

    {cvData.education.length > 0 && (
      <div className="cv-section">
        <h2>Education</h2>
        {cvData.education.map((edu, index) => (
          <div key={index} className="education-item">
            <h3>{edu.degree}</h3>
            <p>{edu.institution} • {edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Technical Template Component
const TechnicalTemplate = ({ cvData }) => (
  <div className="cv-template technical-template">
    <div className="cv-header">
      <h1 className="cv-name">{cvData.personalInfo.fullName || 'Your Name'}</h1>
      <p className="cv-title">Technical Professional</p>
      <div className="contact-info">
        {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
        {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
        {cvData.personalInfo.linkedin && <span>{cvData.personalInfo.linkedin}</span>}
      </div>
    </div>

    {cvData.skills.length > 0 && (
      <div className="cv-section">
        <h2>Technical Skills</h2>
        <div className="skills-categories">
          {cvData.skills.map((skill, index) => (
            <span key={index} className="skill-item">{skill.name}</span>
          ))}
        </div>
      </div>
    )}

    {cvData.experience.length > 0 && (
      <div className="cv-section">
        <h2>Professional Experience</h2>
        {cvData.experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <h3>{exp.position}</h3>
              <div className="experience-meta">
                <span className="company">{exp.company}</span>
                <span className="duration">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
            </div>
            {exp.description && <p>{exp.description}</p>}
          </div>
        ))}
      </div>
    )}

    {cvData.projects.length > 0 && (
      <div className="cv-section">
        <h2>Technical Projects</h2>
        {cvData.projects.map((project, index) => (
          <div key={index} className="project-item">
            <h3>{project.name}</h3>
            {project.description && <p>{project.description}</p>}
            {project.technologies && (
              <div className="project-technologies">
                <strong>Tech Stack:</strong> {project.technologies}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

// Executive Template Component
const ExecutiveTemplate = ({ cvData }) => (
  <div className="cv-template executive-template">
    <div className="cv-header">
      <h1 className="cv-name">{cvData.personalInfo.fullName || 'Your Name'}</h1>
      <p className="cv-title">Executive Leader</p>
      <div className="contact-info">
        {cvData.personalInfo.email && <span>{cvData.personalInfo.email}</span>}
        {cvData.personalInfo.phone && <span>{cvData.personalInfo.phone}</span>}
      </div>
    </div>

    {cvData.personalInfo.summary && (
      <div className="cv-section">
        <h2>Executive Summary</h2>
        <p>{cvData.personalInfo.summary}</p>
      </div>
    )}

    {cvData.experience.length > 0 && (
      <div className="cv-section">
        <h2>Leadership Experience</h2>
        {cvData.experience.map((exp, index) => (
          <div key={index} className="experience-item">
            <div className="experience-header">
              <h3>{exp.position}</h3>
              <div className="experience-meta">
                <span className="company">{exp.company}</span>
                <span className="duration">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
            </div>
            {exp.description && <p>{exp.description}</p>}
          </div>
        ))}
      </div>
    )}

    {cvData.education.length > 0 && (
      <div className="cv-section">
        <h2>Education</h2>
        {cvData.education.map((edu, index) => (
          <div key={index} className="education-item">
            <h3>{edu.degree}</h3>
            <p>{edu.institution} • {edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default CVPreview;
