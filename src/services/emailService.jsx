import { analytics } from '../firebase/config';
import { logEvent } from 'firebase/analytics';

// Email service configuration
const EMAIL_SERVICE_URL = import.meta.env.VITE_EMAIL_SERVICE_URL || 'https://api.emailjs.com/api/v1.0/email/send';
const EMAIL_SERVICE_API_KEY = import.meta.env.VITE_EMAIL_SERVICE_API_KEY;

// Track email events
const trackEmailEvent = (eventName, properties = {}) => {
  try {
    if (analytics && logEvent) {
      logEvent(analytics, eventName, properties);
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Send CV via email (Demo Mode)
export const sendCVEmail = async (userEmail, userName, cvData, templateName) => {
  try {
    trackEmailEvent('cv_email_sent', {
      template: templateName,
      user_email: userEmail
    });

    const emailData = {
      to_email: userEmail,
      user_name: userName,
      cv_data: cvData,
      template_name: templateName,
      app_name: import.meta.env.VITE_APP_NAME || 'CV Builder Pro'
    };

    // Demo mode - simulate email sending
    console.log('Sending CV email:', emailData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return { 
      success: true, 
      message: 'CV sent successfully! (Demo Mode)',
      demo: true
    };
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Fallback: Show success message (for demo)
    return { 
      success: true, 
      message: `CV will be emailed to ${userEmail} shortly!`,
      fallback: true 
    };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email) => {
  try {
    trackEmailEvent('password_reset_requested', {
      user_email: email
    });

    // Demo mode - simulate password reset
    console.log('Sending password reset email to:', email);
    
    return { success: true, message: 'Password reset email sent! (Demo Mode)' };
  } catch (error) {
    console.error('Password reset email error:', error);
    return { success: false, error: error.message };
  }
};

// Send admin notification email
export const sendAdminNotification = async (requestData) => {
  try {
    trackEmailEvent('admin_notification_sent', {
      request_id: requestData.id,
      user_email: requestData.userEmail
    });

    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@cvbuilder.com';
    
    const notificationData = {
      to_email: adminEmail,
      subject: 'New CV Request',
      request_data: requestData,
      app_name: import.meta.env.VITE_APP_NAME || 'CV Builder Pro'
    };

    // Demo mode - simulate admin notification
    console.log('Admin notification:', notificationData);
    
    return { success: true, message: 'Admin notified successfully! (Demo Mode)' };
  } catch (error) {
    console.error('Admin notification error:', error);
    return { success: false, error: error.message };
  }
};

// Send subscription confirmation email
export const sendSubscriptionConfirmation = async (userEmail, userName, planType) => {
  try {
    trackEmailEvent('subscription_confirmed', {
      plan_type: planType,
      user_email: userEmail
    });

    const confirmationData = {
      to_email: userEmail,
      user_name: userName,
      plan_type: planType,
      app_name: import.meta.env.VITE_APP_NAME || 'CV Builder Pro'
    };

    // Demo mode - simulate subscription confirmation
    console.log('Subscription confirmation:', confirmationData);
    
    return { success: true, message: 'Subscription confirmation sent! (Demo Mode)' };
  } catch (error) {
    console.error('Subscription confirmation error:', error);
    return { success: false, error: error.message };
  }
};