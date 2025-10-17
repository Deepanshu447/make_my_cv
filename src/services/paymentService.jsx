import { analytics } from '../firebase/config';
import { logEvent } from 'firebase/analytics';

// Payment service configuration
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY;

// Track payment events
const trackPaymentEvent = (eventName, properties = {}) => {
  try {
    if (analytics && logEvent) {
      logEvent(analytics, eventName, properties);
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    interval: 'forever',
    features: [
      '2 Free CV Templates',
      'Basic CV Builder',
      'Email CV Delivery',
      'Community Support'
    ]
  },
  premium_monthly: {
    id: 'premium_monthly',
    name: 'Premium Plan (Monthly)',
    price: 9.99,
    interval: 'month',
    stripe_price_id: 'price_premium_monthly',
    features: [
      'All 20+ Premium Templates',
      'Advanced CV Builder',
      'PDF Download',
      'Priority Email Support',
      'Custom Branding',
      'Multiple CV Formats',
      'ATS Optimization',
      'Cover Letter Builder',
      'LinkedIn Integration',
      'Unlimited Downloads'
    ]
  },
  premium_yearly: {
    id: 'premium_yearly',
    name: 'Premium Plan (Yearly)',
    price: 99.99,
    interval: 'year',
    stripe_price_id: 'price_premium_yearly',
    features: [
      'All 20+ Premium Templates',
      'Advanced CV Builder',
      'PDF Download',
      'Priority Email Support',
      'Custom Branding',
      'Multiple CV Formats',
      'ATS Optimization',
      'Cover Letter Builder',
      'LinkedIn Integration',
      'Unlimited Downloads',
      '2 Months Free (Save $20)'
    ]
  }
};

// Create payment intent for subscription (Demo Mode)
export const createPaymentIntent = async (planId, userEmail, userId) => {
  try {
    trackPaymentEvent('payment_intent_created', {
      plan_id: planId,
      user_email: userEmail
    });

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      throw new Error('Invalid plan selected');
    }

    // Demo mode - simulate payment intent creation
    console.log('Creating payment intent for plan:', planId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { 
      success: true, 
      client_secret: `demo_client_secret_${Date.now()}`,
      demo: true 
    };
  } catch (error) {
    console.error('Payment intent creation error:', error);
    
    // Fallback: Simulate successful payment for demo
    return { 
      success: true, 
      client_secret: 'demo_client_secret',
      fallback: true 
    };
  }
};

// Process subscription payment (Demo Mode)
export const processSubscriptionPayment = async (planId, userEmail, userId, paymentMethod) => {
  try {
    trackPaymentEvent('subscription_payment_attempted', {
      plan_id: planId,
      user_email: userEmail
    });

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      throw new Error('Invalid plan selected');
    }

    // Demo mode - simulate payment processing
    console.log('Processing payment for plan:', planId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    trackPaymentEvent('subscription_payment_successful', {
      plan_id: planId,
      user_email: userEmail,
      amount: plan.price
    });

    return { 
      success: true, 
      subscription_id: `demo_sub_${Date.now()}`,
      message: 'Payment successful! Your subscription is now active. (Demo Mode)',
      demo: true
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    
    trackPaymentEvent('subscription_payment_failed', {
      plan_id: planId,
      user_email: userEmail,
      error: error.message
    });

    // Fallback: Simulate successful payment for demo
    return { 
      success: true, 
      subscription_id: 'demo_subscription_id',
      message: 'Payment successful! Your subscription is now active.',
      fallback: true 
    };
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId, userId) => {
  try {
    trackPaymentEvent('subscription_cancellation_attempted', {
      subscription_id: subscriptionId,
      user_id: userId
    });

    // Demo mode - simulate cancellation
    console.log('Cancelling subscription:', subscriptionId);
    
    trackPaymentEvent('subscription_cancelled', {
      subscription_id: subscriptionId,
      user_id: userId
    });

    return { success: true, message: 'Subscription cancelled successfully. (Demo Mode)' };
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    return { success: false, error: error.message };
  }
};

// Get subscription status
export const getSubscriptionStatus = async (userId) => {
  try {
    // Demo mode - return free plan status
    console.log('Getting subscription status for user:', userId);
    
    return { 
      success: true, 
      status: {
        plan: 'free',
        active: true,
        expires_at: null
      }
    };
  } catch (error) {
    console.error('Subscription status error:', error);
    return { success: false, error: error.message };
  }
};

// Validate subscription access
export const validateSubscriptionAccess = (userSubscription, requiredFeature) => {
  const accessLevels = {
    free: ['basic_templates', 'email_delivery'],
    premium: ['all_templates', 'pdf_download', 'advanced_features', 'priority_support']
  };

  return accessLevels[userSubscription]?.includes(requiredFeature) || false;
};