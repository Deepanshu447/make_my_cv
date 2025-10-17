import React from 'react';
import './ModernTemplates2024.css';

// Neon Futuristic Template
export const NeonTemplate = ({ cvData }) => {
  const { personalInfo, experience, education, skills, languages, certifications, projects } = cvData;

  return (
    <div className="cv-template neon-template">
      <div className="neon-container">
        {/* Header with Neon Accents */}
        <header className="neon-header">
          <div className="neon-glow">
            <h1 className="neon-name">{personalInfo.fullName || 'Your Name'}</h1>
            <p className="neon-title">{personalInfo.summary || 'Professional Summary'}</p>
          </div>
          <div className="neon-contact">
            <div className="contact-item">
              <span className="neon-icon">📧</span>
              {personalInfo.email || 'email@example.com'}
            </div>
            <div className="contact-item">
              <span className="neon-icon">📱</span>
              {personalInfo.phone || '+1 (555) 123-4567'}
            </div>
            <div className="contact-item">
              <span className="neon-icon">🌐</span>
              {personalInfo.website || 'yourwebsite.com'}
            </div>
          </div>
        </header>

        {/* Experience Section */}
        <section className="neon-section">
          <h2 className="neon-section-title">💼 Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="neon-item">
              <div className="neon-item-header">
                <h3 className="neon-item-title">{exp.position || 'Position'}</h3>
                <span className="neon-company">{exp.company || 'Company'}</span>
                <span className="neon-date">{exp.startDate} - {exp.endDate || 'Present'}</span>
              </div>
              <p className="neon-description">{exp.description || 'Job description'}</p>
            </div>
          ))}
        </section>

        {/* Education Section */}
        <section className="neon-section">
          <h2 className="neon-section-title">🎓 Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="neon-item">
              <h3 className="neon-item-title">{edu.degree || 'Degree'}</h3>
              <span className="neon-company">{edu.institution || 'Institution'}</span>
              <span className="neon-date">{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </section>

        {/* Skills Section */}
        <section className="neon-section">
          <h2 className="neon-section-title">⚡ Skills</h2>
          <div className="neon-skills">
            {skills.map((skill, index) => (
              <span key={index} className="neon-skill">{skill}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Glassmorphism Template
export const GlassmorphismTemplate = ({ cvData }) => {
  const { personalInfo, experience, education, skills } = cvData;

  return (
    <div className="cv-template glassmorphism-template">
      <div className="glass-container">
        {/* Header */}
        <header className="glass-header">
          <div className="glass-card">
            <h1 className="glass-name">{personalInfo.fullName || 'Your Name'}</h1>
            <p className="glass-title">{personalInfo.summary || 'Professional Summary'}</p>
            <div className="glass-contact">
              <span>{personalInfo.email || 'email@example.com'}</span>
              <span>{personalInfo.phone || '+1 (555) 123-4567'}</span>
              <span>{personalInfo.website || 'yourwebsite.com'}</span>
            </div>
          </div>
        </header>

        {/* Experience */}
        <section className="glass-section">
          <h2 className="glass-section-title">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="glass-card">
              <h3>{exp.position || 'Position'}</h3>
              <p className="glass-company">{exp.company || 'Company'}</p>
              <p className="glass-date">{exp.startDate} - {exp.endDate || 'Present'}</p>
              <p className="glass-description">{exp.description || 'Job description'}</p>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="glass-section">
          <h2 className="glass-section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="glass-card">
              <h3>{edu.degree || 'Degree'}</h3>
              <p className="glass-company">{edu.institution || 'Institution'}</p>
              <p className="glass-date">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="glass-section">
          <h2 className="glass-section-title">Skills</h2>
          <div className="glass-skills">
            {skills.map((skill, index) => (
              <span key={index} className="glass-skill">{skill}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Gradient Modern Template
export const GradientTemplate = ({ cvData }) => {
  const { personalInfo, experience, education, skills } = cvData;

  return (
    <div className="cv-template gradient-template">
      <div className="gradient-container">
        {/* Header */}
        <header className="gradient-header">
          <h1 className="gradient-name">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="gradient-title">{personalInfo.summary || 'Professional Summary'}</p>
          <div className="gradient-contact">
            <span>{personalInfo.email || 'email@example.com'}</span>
            <span>{personalInfo.phone || '+1 (555) 123-4567'}</span>
            <span>{personalInfo.website || 'yourwebsite.com'}</span>
          </div>
        </header>

        {/* Experience */}
        <section className="gradient-section">
          <h2 className="gradient-section-title">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="gradient-item">
              <h3>{exp.position || 'Position'}</h3>
              <p className="gradient-company">{exp.company || 'Company'}</p>
              <p className="gradient-date">{exp.startDate} - {exp.endDate || 'Present'}</p>
              <p className="gradient-description">{exp.description || 'Job description'}</p>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="gradient-section">
          <h2 className="gradient-section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="gradient-item">
              <h3>{edu.degree || 'Degree'}</h3>
              <p className="gradient-company">{edu.institution || 'Institution'}</p>
              <p className="gradient-date">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="gradient-section">
          <h2 className="gradient-section-title">Skills</h2>
          <div className="gradient-skills">
            {skills.map((skill, index) => (
              <span key={index} className="gradient-skill">{skill}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Brutalist Bold Template
export const BrutalistTemplate = ({ cvData }) => {
  const { personalInfo, experience, education, skills } = cvData;

  return (
    <div className="cv-template brutalist-template">
      <div className="brutalist-container">
        {/* Header */}
        <header className="brutalist-header">
          <h1 className="brutalist-name">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className="brutalist-title">{personalInfo.summary || 'PROFESSIONAL SUMMARY'}</p>
          <div className="brutalist-contact">
            <span>{personalInfo.email || 'EMAIL@EXAMPLE.COM'}</span>
            <span>{personalInfo.phone || '+1 (555) 123-4567'}</span>
            <span>{personalInfo.website || 'YOURWEBSITE.COM'}</span>
          </div>
        </header>

        {/* Experience */}
        <section className="brutalist-section">
          <h2 className="brutalist-section-title">EXPERIENCE</h2>
          {experience.map((exp, index) => (
            <div key={index} className="brutalist-item">
              <h3>{exp.position || 'POSITION'}</h3>
              <p className="brutalist-company">{exp.company || 'COMPANY'}</p>
              <p className="brutalist-date">{exp.startDate} - {exp.endDate || 'PRESENT'}</p>
              <p className="brutalist-description">{exp.description || 'JOB DESCRIPTION'}</p>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="brutalist-section">
          <h2 className="brutalist-section-title">EDUCATION</h2>
          {education.map((edu, index) => (
            <div key={index} className="brutalist-item">
              <h3>{edu.degree || 'DEGREE'}</h3>
              <p className="brutalist-company">{edu.institution || 'INSTITUTION'}</p>
              <p className="brutalist-date">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="brutalist-section">
          <h2 className="brutalist-section-title">SKILLS</h2>
          <div className="brutalist-skills">
            {skills.map((skill, index) => (
              <span key={index} className="brutalist-skill">{skill.toUpperCase()}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// AI Optimized Template
export const AIOptimizedTemplate = ({ cvData }) => {
  const { personalInfo, experience, education, skills } = cvData;

  return (
    <div className="cv-template ai-optimized-template">
      <div className="ai-container">
        {/* Header */}
        <header className="ai-header">
          <h1 className="ai-name">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="ai-title">{personalInfo.summary || 'Professional Summary'}</p>
          <div className="ai-contact">
            <span>{personalInfo.email || 'email@example.com'}</span>
            <span>{personalInfo.phone || '+1 (555) 123-4567'}</span>
            <span>{personalInfo.website || 'yourwebsite.com'}</span>
          </div>
        </header>

        {/* Experience */}
        <section className="ai-section">
          <h2 className="ai-section-title">Professional Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="ai-item">
              <h3>{exp.position || 'Position'}</h3>
              <p className="ai-company">{exp.company || 'Company'}</p>
              <p className="ai-date">{exp.startDate} - {exp.endDate || 'Present'}</p>
              <p className="ai-description">{exp.description || 'Job description'}</p>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="ai-section">
          <h2 className="ai-section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="ai-item">
              <h3>{edu.degree || 'Degree'}</h3>
              <p className="ai-company">{edu.institution || 'Institution'}</p>
              <p className="ai-date">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="ai-section">
          <h2 className="ai-section-title">Technical Skills</h2>
          <div className="ai-skills">
            {skills.map((skill, index) => (
              <span key={index} className="ai-skill">{skill}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Carbon Dark Template
export const CarbonTemplate = ({ cvData }) => {
  const { personalInfo, experience, education, skills } = cvData;

  return (
    <div className="cv-template carbon-template">
      <div className="carbon-container">
        {/* Header */}
        <header className="carbon-header">
          <h1 className="carbon-name">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="carbon-title">{personalInfo.summary || 'Professional Summary'}</p>
          <div className="carbon-contact">
            <span>{personalInfo.email || 'email@example.com'}</span>
            <span>{personalInfo.phone || '+1 (555) 123-4567'}</span>
            <span>{personalInfo.website || 'yourwebsite.com'}</span>
          </div>
        </header>

        {/* Experience */}
        <section className="carbon-section">
          <h2 className="carbon-section-title">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="carbon-item">
              <h3>{exp.position || 'Position'}</h3>
              <p className="carbon-company">{exp.company || 'Company'}</p>
              <p className="carbon-date">{exp.startDate} - {exp.endDate || 'Present'}</p>
              <p className="carbon-description">{exp.description || 'Job description'}</p>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="carbon-section">
          <h2 className="carbon-section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="carbon-item">
              <h3>{edu.degree || 'Degree'}</h3>
              <p className="carbon-company">{edu.institution || 'Institution'}</p>
              <p className="carbon-date">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="carbon-section">
          <h2 className="carbon-section-title">Skills</h2>
          <div className="carbon-skills">
            {skills.map((skill, index) => (
              <span key={index} className="carbon-skill">{skill}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Minimalist 2024 Template
export const Minimalist2024Template = ({ cvData }) => {
  const { personalInfo, experience, education, skills } = cvData;

  return (
    <div className="cv-template minimalist-2024-template">
      <div className="minimalist-2024-container">
        {/* Header */}
        <header className="minimalist-2024-header">
          <h1 className="minimalist-2024-name">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="minimalist-2024-title">{personalInfo.summary || 'Professional Summary'}</p>
          <div className="minimalist-2024-contact">
            <span>{personalInfo.email || 'email@example.com'}</span>
            <span>{personalInfo.phone || '+1 (555) 123-4567'}</span>
            <span>{personalInfo.website || 'yourwebsite.com'}</span>
          </div>
        </header>

        {/* Experience */}
        <section className="minimalist-2024-section">
          <h2 className="minimalist-2024-section-title">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="minimalist-2024-item">
              <h3>{exp.position || 'Position'}</h3>
              <p className="minimalist-2024-company">{exp.company || 'Company'}</p>
              <p className="minimalist-2024-date">{exp.startDate} - {exp.endDate || 'Present'}</p>
              <p className="minimalist-2024-description">{exp.description || 'Job description'}</p>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="minimalist-2024-section">
          <h2 className="minimalist-2024-section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="minimalist-2024-item">
              <h3>{edu.degree || 'Degree'}</h3>
              <p className="minimalist-2024-company">{edu.institution || 'Institution'}</p>
              <p className="minimalist-2024-date">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="minimalist-2024-section">
          <h2 className="minimalist-2024-section-title">Skills</h2>
          <div className="minimalist-2024-skills">
            {skills.map((skill, index) => (
              <span key={index} className="minimalist-2024-skill">{skill}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// Startup Dynamic Template
export const StartupTemplate = ({ cvData }) => {
  const { personalInfo, experience, education, skills } = cvData;

  return (
    <div className="cv-template startup-template">
      <div className="startup-container">
        {/* Header */}
        <header className="startup-header">
          <h1 className="startup-name">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="startup-title">{personalInfo.summary || 'Professional Summary'}</p>
          <div className="startup-contact">
            <span>{personalInfo.email || 'email@example.com'}</span>
            <span>{personalInfo.phone || '+1 (555) 123-4567'}</span>
            <span>{personalInfo.website || 'yourwebsite.com'}</span>
          </div>
        </header>

        {/* Experience */}
        <section className="startup-section">
          <h2 className="startup-section-title">Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="startup-item">
              <h3>{exp.position || 'Position'}</h3>
              <p className="startup-company">{exp.company || 'Company'}</p>
              <p className="startup-date">{exp.startDate} - {exp.endDate || 'Present'}</p>
              <p className="startup-description">{exp.description || 'Job description'}</p>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="startup-section">
          <h2 className="startup-section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="startup-item">
              <h3>{edu.degree || 'Degree'}</h3>
              <p className="startup-company">{edu.institution || 'Institution'}</p>
              <p className="startup-date">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="startup-section">
          <h2 className="startup-section-title">Skills</h2>
          <div className="startup-skills">
            {skills.map((skill, index) => (
              <span key={index} className="startup-skill">{skill}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
