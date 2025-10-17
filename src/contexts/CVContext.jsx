import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { saveCVData, getCVData } from '../firebase/cvData';

const CVContext = createContext();

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};

export const CVProvider = ({ children }) => {
  const { user } = useAuth();
  const [cvData, setCvData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: []
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load CV data from Firebase when user logs in (optimized)
  useEffect(() => {
    if (user?.uid) {
      // Load CV data in background (non-blocking)
      loadCVDataFromFirebase();
    } else {
      // Reset data when user logs out
      setCvData({
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          address: '',
          linkedin: '',
          website: '',
          summary: ''
        },
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        projects: []
      });
      setSelectedTemplate(null);
    }
  }, [user?.uid]);

  const loadCVDataFromFirebase = async () => {
    // Don't set loading to true to avoid blocking UI
    try {
      const result = await getCVData(user.uid);
      if (result.success && result.data) {
        setCvData(result.data);
        setSelectedTemplate(result.data.selectedTemplate || null);
      }
    } catch (error) {
      console.warn('Error loading CV data (possibly offline):', error.message);
      // Try to load from localStorage as fallback when offline
      try {
        const savedCVData = localStorage.getItem('cvBuilderData');
        const savedTemplate = localStorage.getItem('cvBuilderTemplate');
        
        if (savedCVData) {
          setCvData(JSON.parse(savedCVData));
        }
        if (savedTemplate) {
          setSelectedTemplate(JSON.parse(savedTemplate));
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
      }
    }
  };

  // Auto-save function to Firebase with offline fallback
  const saveToFirebase = async (data, template) => {
    if (!user?.uid) {
      // If no user, save to localStorage as fallback
      try {
        localStorage.setItem('cvBuilderData', JSON.stringify(data));
        if (template) {
          localStorage.setItem('cvBuilderTemplate', JSON.stringify(template));
        }
        setIsDataSaved(true);
        setLastSaved(new Date().toLocaleString());
        setTimeout(() => setIsDataSaved(false), 3000);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      return;
    }
    
    try {
      const dataToSave = {
        ...data,
        selectedTemplate: template
      };
      
      const result = await saveCVData(user.uid, dataToSave);
      if (result.success) {
        setIsDataSaved(true);
        setLastSaved(new Date().toLocaleString());
        
        // Also save to localStorage as backup
        try {
          localStorage.setItem('cvBuilderData', JSON.stringify(data));
          if (template) {
            localStorage.setItem('cvBuilderTemplate', JSON.stringify(template));
          }
        } catch (localError) {
          console.warn('Error saving to localStorage:', localError);
        }
        
        // Reset saved status after 3 seconds
        setTimeout(() => setIsDataSaved(false), 3000);
      }
    } catch (error) {
      console.warn('Error saving data to Firebase (possibly offline):', error.message);
      
      // Fallback to localStorage when offline
      try {
        localStorage.setItem('cvBuilderData', JSON.stringify(data));
        if (template) {
          localStorage.setItem('cvBuilderTemplate', JSON.stringify(template));
        }
        setIsDataSaved(true);
        setLastSaved(new Date().toLocaleString() + ' (Offline)');
        setTimeout(() => setIsDataSaved(false), 3000);
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
      }
    }
  };

  // Manual save function
  const saveCVDataManually = async () => {
    await saveToFirebase(cvData, selectedTemplate);
  };

  // Load from file function
  const loadFromFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setCvData(data.cvData || data);
          if (data.selectedTemplate) {
            setSelectedTemplate(data.selectedTemplate);
          }
          saveToFirebase(data.cvData || data, data.selectedTemplate);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  // Export to file function
  const exportToFile = () => {
    const dataToExport = {
      cvData,
      selectedTemplate,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cv-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updatePersonalInfo = (info) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        personalInfo: { ...prev.personalInfo, ...info }
      };
      saveToFirebase(newData, selectedTemplate);
      return newData;
    });
  };

  const addExperience = (experience) => {
    setCvData(prev => {
      const newData = {
        ...prev,
        experience: [...prev.experience, { ...experience, id: Date.now().toString() }]
      };
      saveToFirebase(newData, selectedTemplate);
      return newData;
    });
  };

  const updateExperience = (id, experience) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, ...experience } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = (education) => {
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, { ...education, id: Date.now().toString() }]
    }));
  };

  const updateEducation = (id, education) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, ...education } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = (skill) => {
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, { ...skill, id: Date.now().toString() }]
    }));
  };

  const removeSkill = (id) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const addLanguage = (language) => {
    setCvData(prev => ({
      ...prev,
      languages: [...prev.languages, { ...language, id: Date.now().toString() }]
    }));
  };

  const removeLanguage = (id) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  const addCertification = (certification) => {
    setCvData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { ...certification, id: Date.now().toString() }]
    }));
  };

  const removeCertification = (id) => {
    setCvData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  const addProject = (project) => {
    setCvData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: Date.now().toString() }]
    }));
  };

  const removeProject = (id) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const resetCVData = () => {
    const emptyData = {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        website: '',
        summary: ''
      },
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
      projects: []
    };
    setCvData(emptyData);
    setSelectedTemplate(null);
    saveToFirebase(emptyData, null);
  };

  // Custom setSelectedTemplate function with auto-save
  const setSelectedTemplateWithSave = (template) => {
    setSelectedTemplate(template);
    saveToFirebase(cvData, template);
  };

  const value = {
    cvData,
    selectedTemplate,
    setSelectedTemplate: setSelectedTemplateWithSave,
    isDataSaved,
    lastSaved,
    loading,
    saveCVData: saveCVDataManually,
    loadFromFile,
    exportToFile,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addLanguage,
    removeLanguage,
    addCertification,
    removeCertification,
    addProject,
    removeProject,
    resetCVData
  };

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
};
