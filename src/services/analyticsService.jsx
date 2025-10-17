import { analytics } from '../firebase/config';
import { logEvent } from 'firebase/analytics';

// Analytics service for tracking user behavior and app metrics

// Track user authentication events
export const trackAuthEvent = (eventName, properties = {}) => {
  try {
    if (analytics && logEvent) {
      logEvent(analytics, eventName, {
        ...properties,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Track CV building events
export const trackCVEvent = (eventName, properties = {}) => {
  try {
    if (analytics && logEvent) {
      logEvent(analytics, eventName, {
        ...properties,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Track subscription events
export const trackSubscriptionEvent = (eventName, properties = {}) => {
  try {
    if (analytics && logEvent) {
      logEvent(analytics, eventName, {
        ...properties,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Track admin events
export const trackAdminEvent = (eventName, properties = {}) => {
  try {
    if (analytics && logEvent) {
      logEvent(analytics, eventName, {
        ...properties,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Specific tracking functions
export const trackUserRegistration = (method, userEmail) => {
  trackAuthEvent('user_registration', {
    method: method, // 'email', 'google'
    user_email: userEmail
  });
};

export const trackUserLogin = (method, userEmail) => {
  trackAuthEvent('user_login', {
    method: method,
    user_email: userEmail
  });
};

export const trackCVCreation = (templateId, userEmail) => {
  trackCVEvent('cv_creation_started', {
    template_id: templateId,
    user_email: userEmail
  });
};

export const trackCVCompletion = (templateId, userEmail, sectionsCompleted) => {
  trackCVEvent('cv_completed', {
    template_id: templateId,
    user_email: userEmail,
    sections_completed: sectionsCompleted
  });
};

export const trackPDFDownload = (templateId, userEmail, subscriptionType) => {
  trackCVEvent('pdf_downloaded', {
    template_id: templateId,
    user_email: userEmail,
    subscription_type: subscriptionType
  });
};

export const trackTemplateSelection = (templateId, userEmail, subscriptionType) => {
  trackCVEvent('template_selected', {
    template_id: templateId,
    user_email: userEmail,
    subscription_type: subscriptionType
  });
};

export const trackSubscriptionUpgrade = (fromPlan, toPlan, userEmail) => {
  trackSubscriptionEvent('subscription_upgraded', {
    from_plan: fromPlan,
    to_plan: toPlan,
    user_email: userEmail
  });
};

export const trackAdminAction = (action, adminEmail, targetUser) => {
  trackAdminEvent('admin_action', {
    action: action,
    admin_email: adminEmail,
    target_user: targetUser
  });
};

export const trackPageView = (pageName, userEmail) => {
  trackAuthEvent('page_view', {
    page_name: pageName,
    user_email: userEmail
  });
};

export const trackError = (errorType, errorMessage, userEmail) => {
  trackAuthEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    user_email: userEmail
  });
};

// Performance tracking
export const trackPerformance = (metricName, value, userEmail) => {
  trackAuthEvent('performance_metric', {
    metric_name: metricName,
    metric_value: value,
    user_email: userEmail
  });
};

// Custom event tracking
export const trackCustomEvent = (eventName, properties = {}) => {
  try {
    if (analytics && logEvent) {
      logEvent(analytics, eventName, {
        ...properties,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};
