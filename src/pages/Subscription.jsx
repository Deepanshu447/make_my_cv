import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiCheck, FiStar, FiArrowRight, FiCreditCard, FiShield, FiDownload, FiMail, FiLayers, FiUsers } from 'react-icons/fi';
import { processSubscriptionPayment, SUBSCRIPTION_PLANS } from '../services/paymentService';
import { sendSubscriptionConfirmation } from '../services/emailService';
import { trackSubscriptionUpgrade } from '../services/analyticsService';
import './Subscription.css';

const Subscription = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with your CV',
      features: [
        '2 Free CV Templates',
        'Basic CV Builder',
        'Email CV Delivery',
        'Community Support',
        'Standard CV Format'
      ],
      limitations: [
        'Limited to 2 templates',
        'No PDF download',
        'Basic customization'
      ],
      popular: false,
      buttonText: 'Current Plan',
      buttonStyle: 'secondary'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: selectedPlan === 'monthly' ? '$9.99' : '$99.99',
      period: selectedPlan === 'monthly' ? 'per month' : 'per year',
      originalPrice: selectedPlan === 'yearly' ? '$119.88' : null,
      description: 'Unlock all features and premium templates',
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
      ],
      popular: true,
      buttonText: 'Upgrade to Premium',
      buttonStyle: 'primary'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 'Custom',
      period: 'contact us',
      description: 'For teams and organizations',
      features: [
        'Everything in Premium',
        'Team Management',
        'Custom Templates',
        'White-label Solution',
        'API Access',
        'Dedicated Support',
        'Advanced Analytics',
        'Custom Integrations'
      ],
      popular: false,
      buttonText: 'Contact Sales',
      buttonStyle: 'outline'
    }
  ];

  const handleUpgrade = async (planId) => {
    if (planId === 'free') return;
    
    if (planId === 'enterprise') {
      // Handle enterprise contact
      alert('Please contact our sales team at enterprise@cvbuilder.com');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Determine the actual plan ID based on selected billing period
      const actualPlanId = planId === 'premium' 
        ? (selectedPlan === 'monthly' ? 'premium_monthly' : 'premium_yearly')
        : planId;
      
      // Process payment
      const paymentResult = await processSubscriptionPayment(
        actualPlanId,
        user.email,
        user.uid,
        'demo_payment_method' // In real app, this would be from Stripe
      );
      
      if (paymentResult.success) {
        // Update user subscription
        updateUser({ subscription: 'premium' });
        
        // Send confirmation email
        await sendSubscriptionConfirmation(
          user.email,
          user.name,
          actualPlanId
        );
        
        // Track subscription upgrade
        trackSubscriptionUpgrade('free', actualPlanId, user.email);
        
        // Show success message
        alert(paymentResult.message);
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Subscription upgrade error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentPlan = plans.find(plan => 
    (plan.id === 'free' && user.subscription === 'free') ||
    (plan.id === 'premium' && user.subscription === 'premium')
  );

  return (
    <div className="subscription">
      <div className="subscription-container">
        <div className="subscription-header">
          <h1>Choose Your Plan</h1>
          <p>Unlock the full potential of your professional CV</p>
          
          <div className="billing-toggle">
            <span className={selectedPlan === 'monthly' ? 'active' : ''}>Monthly</span>
            <button 
              className="toggle-switch"
              onClick={() => setSelectedPlan(selectedPlan === 'monthly' ? 'yearly' : 'monthly')}
            >
              <div className={`toggle-slider ${selectedPlan === 'yearly' ? 'yearly' : 'monthly'}`}></div>
            </button>
            <span className={selectedPlan === 'yearly' ? 'active' : ''}>
              Yearly
              <span className="discount-badge">Save 17%</span>
            </span>
          </div>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.popular ? 'popular' : ''} ${currentPlan?.id === plan.id ? 'current' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <FiStar />
                  Most Popular
                </div>
              )}
              
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-pricing">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                  {plan.originalPrice && (
                    <span className="original-price">{plan.originalPrice}</span>
                  )}
                </div>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-features">
                <h4>What's included:</h4>
                <ul className="features-list">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="feature-item">
                      <FiCheck className="check-icon" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations && (
                  <>
                    <h4 className="limitations-title">Limitations:</h4>
                    <ul className="limitations-list">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="limitation-item">
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="plan-footer">
                <button
                  className={`btn btn-${plan.buttonStyle} plan-button`}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isProcessing || currentPlan?.id === plan.id}
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {currentPlan?.id === plan.id ? (
                        <>
                          <FiCheck />
                          {plan.buttonText}
                        </>
                      ) : (
                        <>
                          {plan.buttonStyle === 'outline' ? (
                            plan.buttonText
                          ) : (
                            <>
                              <FiArrowRight />
                              {plan.buttonText}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </button>
                
                {plan.id === 'premium' && (
                  <p className="plan-note">
                    Cancel anytime. No hidden fees.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="subscription-features">
          <h2>Why Choose CV Builder Pro?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiLayers />
              </div>
              <h3>Premium Templates</h3>
              <p>Access to 20+ professionally designed templates that stand out to employers.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiDownload />
              </div>
              <h3>PDF Download</h3>
              <p>Download your CV in high-quality PDF format for easy sharing and printing.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiShield />
              </div>
              <h3>ATS Optimized</h3>
              <p>All templates are optimized for Applicant Tracking Systems used by recruiters.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiMail />
              </div>
              <h3>Email Delivery</h3>
              <p>Get your CV delivered directly to your email inbox within 24 hours.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiUsers />
              </div>
              <h3>Expert Support</h3>
              <p>Get priority support from our CV writing experts and career advisors.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FiCreditCard />
              </div>
              <h3>Secure Payment</h3>
              <p>Safe and secure payment processing with industry-standard encryption.</p>
            </div>
          </div>
        </div>

        <div className="subscription-footer">
          <div className="testimonials">
            <h3>What our users say</h3>
            <div className="testimonials-grid">
              <div className="testimonial">
                <p>"The premium templates helped me land my dream job at Google!"</p>
                <div className="testimonial-author">
                  <strong>Sarah Johnson</strong>
                  <span>Software Engineer at Google</span>
                </div>
              </div>
              
              <div className="testimonial">
                <p>"Easy to use and the PDF download feature is exactly what I needed."</p>
                <div className="testimonial-author">
                  <strong>Michael Chen</strong>
                  <span>Product Manager at Microsoft</span>
                </div>
              </div>
              
              <div className="testimonial">
                <p>"Professional templates that made my CV stand out from the competition."</p>
                <div className="testimonial-author">
                  <strong>Emily Rodriguez</strong>
                  <span>Marketing Director at Apple</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="guarantee">
            <div className="guarantee-content">
              <FiShield className="guarantee-icon" />
              <div>
                <h4>30-Day Money-Back Guarantee</h4>
                <p>Not satisfied? Get a full refund within 30 days, no questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
