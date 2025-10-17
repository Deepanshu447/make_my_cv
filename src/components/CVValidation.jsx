import React from 'react';
import { useCV } from '../contexts/CVContext';
import { FiCheck, FiAlertCircle, FiInfo } from 'react-icons/fi';
import './CVValidation.css';

const CVValidation = () => {
  const { cvData, selectedTemplate } = useCV();

  const getValidationResults = () => {
    const results = [];
    let score = 0;
    let total = 0;

    // Personal Information
    total++;
    if (cvData.personalInfo.fullName && cvData.personalInfo.email) {
      score++;
      results.push({
        type: 'success',
        icon: <FiCheck />,
        message: 'Personal information complete'
      });
    } else {
      results.push({
        type: 'warning',
        icon: <FiAlertCircle />,
        message: 'Personal information incomplete - add name and email'
      });
    }

    // Professional Summary
    total++;
    if (cvData.personalInfo.summary && cvData.personalInfo.summary.length > 50) {
      score++;
      results.push({
        type: 'success',
        icon: <FiCheck />,
        message: 'Professional summary added'
      });
    } else {
      results.push({
        type: 'warning',
        icon: <FiAlertCircle />,
        message: 'Add a professional summary (50+ characters)'
      });
    }

    // Experience
    total++;
    if (cvData.experience.length > 0) {
      score++;
      results.push({
        type: 'success',
        icon: <FiCheck />,
        message: `${cvData.experience.length} work experience(s) added`
      });
    } else {
      results.push({
        type: 'warning',
        icon: <FiAlertCircle />,
        message: 'Add at least one work experience'
      });
    }

    // Education
    total++;
    if (cvData.education.length > 0) {
      score++;
      results.push({
        type: 'success',
        icon: <FiCheck />,
        message: `${cvData.education.length} education entry(ies) added`
      });
    } else {
      results.push({
        type: 'warning',
        icon: <FiAlertCircle />,
        message: 'Add at least one education entry'
      });
    }

    // Skills
    total++;
    if (cvData.skills.length > 0) {
      score++;
      results.push({
        type: 'success',
        icon: <FiCheck />,
        message: `${cvData.skills.length} skill(s) added`
      });
    } else {
      results.push({
        type: 'warning',
        icon: <FiAlertCircle />,
        message: 'Add relevant skills'
      });
    }

    // Template Selection
    total++;
    if (selectedTemplate) {
      score++;
      results.push({
        type: 'success',
        icon: <FiCheck />,
        message: `Template "${selectedTemplate.name}" selected`
      });
    } else {
      results.push({
        type: 'warning',
        icon: <FiAlertCircle />,
        message: 'Select a CV template'
      });
    }

    // Additional sections (bonus)
    const additionalSections = [
      { name: 'Languages', data: cvData.languages },
      { name: 'Certifications', data: cvData.certifications },
      { name: 'Projects', data: cvData.projects }
    ];

    additionalSections.forEach(section => {
      if (section.data.length > 0) {
        results.push({
          type: 'info',
          icon: <FiInfo />,
          message: `${section.data.length} ${section.name.toLowerCase()} added (optional)`
        });
      }
    });

    return {
      results,
      score,
      total,
      percentage: Math.round((score / total) * 100)
    };
  };

  const validation = getValidationResults();

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 80) return 'Excellent! Your CV is well-structured';
    if (percentage >= 60) return 'Good progress! Add a few more details';
    return 'Keep going! Add more information to strengthen your CV';
  };

  return (
    <div className="cv-validation">
      <div className="validation-header">
        <h3>CV Completeness</h3>
        <div className="validation-score">
          <div 
            className="score-circle"
            style={{ 
              background: `conic-gradient(${getScoreColor(validation.percentage)} ${validation.percentage * 3.6}deg, #e2e8f0 0deg)` 
            }}
          >
            <span className="score-percentage">{validation.percentage}%</span>
          </div>
        </div>
      </div>

      <div className="validation-message">
        <p style={{ color: getScoreColor(validation.percentage) }}>
          {getScoreMessage(validation.percentage)}
        </p>
      </div>

      <div className="validation-results">
        {validation.results.map((result, index) => (
          <div key={index} className={`validation-item ${result.type}`}>
            <div className="validation-icon">
              {result.icon}
            </div>
            <span className="validation-message-text">{result.message}</span>
          </div>
        ))}
      </div>

      <div className="validation-summary">
        <p>
          <strong>{validation.score}</strong> of <strong>{validation.total}</strong> required sections completed
        </p>
      </div>
    </div>
  );
};

export default CVValidation;
