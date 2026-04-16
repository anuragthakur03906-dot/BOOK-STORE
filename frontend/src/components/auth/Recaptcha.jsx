import React, { useEffect, useState, useRef } from 'react';

// Component wraps Google reCAPTCHA v2 widget
// - handles loading script, rendering widget, and exposing token
// - parent passes onTokenChange callback and optional action

const Recaptcha = ({ onTokenChange, action = 'submit' }) => {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('Loading reCAPTCHA...');
  const [isVerified, setIsVerified] = useState(false);
  const widgetIdRef = useRef(null); // keeps the widget ID returned by grecaptcha.render
  const isInitializedRef = useRef(false); // prevents double initialization
  const recaptchaRef = useRef(null); // DOM node where reCAPTCHA will render
  
  const SITE_KEY = '6Ld3HyYsAAAAAEwU8yD5deY3boVXcK9KRoFobUGd';

  useEffect(() => {
    // component mount: set up global callback and load script
    console.log('reCAPTCHA v2 Component Mounted');

    // avoid re-initializing if already done
    if (isInitializedRef.current) {
      console.log('Already initialized, skipping...');
      return;
    }

    // global callback invoked by the Google script when ready
    window.onRecaptchaLoadCallback = () => {
      console.log('Global callback fired');
      if (!isInitializedRef.current) {
        setStatus('Ready - Check "I\'m not a robot"');
        initializeWidget();
      }
    };

    loadRecaptchaScript();

    return () => {
      console.log('Cleanup reCAPTCHA');
      // any teardown could go here if needed
    };
  }, []);
  
  const loadRecaptchaScript = () => {
    if (window.grecaptcha && window.grecaptcha.render) {
      console.log(' grecaptcha already loaded');
      if (!isInitializedRef.current) {
        initializeWidget();
      }
      return;
    }
    
    console.log('Loading reCAPTCHA v2 script...');
    setStatus('Loading security check...');
    
    // Remove only if not loaded
    if (!window.grecaptcha) {
      const existingScripts = document.querySelectorAll('script[src*="recaptcha"]');
      existingScripts.forEach(script => {
        if (!script.id.includes('google-recaptcha')) {
          script.remove();
        }
      });
    }
    
    // Check if script already exists
    const existingScript = document.getElementById('google-recaptcha-v2');
    if (existingScript) {
      console.log('Script already exists');
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadCallback&render=explicit`;
    script.async = true;
    script.defer = true;
    script.id = 'google-recaptcha-v2';
    
    script.onload = () => {
      console.log(' reCAPTCHA v2 script loaded');
    };
    
    script.onerror = () => {
      setStatus('Failed to load');
    };
    
    document.head.appendChild(script);
  };
  
  const initializeWidget = () => {
    //  Prevent multiple initialization
    if (isInitializedRef.current) {
      console.log('Widget already initialized');
      return;
    }
    
    if (!window.grecaptcha || !window.grecaptcha.render) {
      console.log('Waiting for grecaptcha...');
      setTimeout(initializeWidget, 100);
      return;
    }
    
    if (!recaptchaRef.current) {
      console.log('Waiting for container...');
      setTimeout(initializeWidget, 100);
      return;
    }
    
    //  Check if element already has widget
    if (recaptchaRef.current.children.length > 0) {
      console.log('Element already has widget');
      isInitializedRef.current = true;
      return;
    }
    
    console.log('Initializing v2 widget...');
    
    try {
      const widgetId = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: SITE_KEY,
        theme: 'light',
        size: 'normal',
        callback: (recaptchaToken) => {
          console.log(' reCAPTCHA verified!');
          setToken(recaptchaToken);
          setIsVerified(true);
          setStatus('✓ Verified');
          if (onTokenChange) onTokenChange(recaptchaToken);
        },
        'expired-callback': () => {
          setToken('');
          setIsVerified(false);
          setStatus('Expired - Re-check');
          if (onTokenChange) onTokenChange('');
        }
      });
      
      widgetIdRef.current = widgetId;
      isInitializedRef.current = true; //  Mark as initialized
      console.log(' Widget created with ID:', widgetId);
      setStatus('Click "I\'m not a robot"');
      
    } catch (error) {
      console.error(' Widget creation error:', error.message);
      setStatus('Error creating widget');
      
      // If already rendered error, mark as initialized
      if (error.message.includes('already been rendered')) {
        isInitializedRef.current = true;
        console.log(' Widget already rendered, marking as initialized');
      }
    }
  };
  
  // reset the current widget and status, useful when user wants to retry
  const handleReset = () => {
    if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.reset) {
      window.grecaptcha.reset(widgetIdRef.current);
      setToken('');
      setIsVerified(false);
      setStatus('Reset - Check again');
      if (onTokenChange) onTokenChange('');
      console.log('reCAPTCHA reset');
    }
  };
  
  // completely tear down and reload the reCAPTCHA script and widget
  const handleReload = () => {
    console.log('Reloading reCAPTCHA...');
    
    // Reset refs
    widgetIdRef.current = null;
    isInitializedRef.current = false;
    
    setToken('');
    setIsVerified(false);
    setStatus('Reloading...');
    
    // Clear container
    if (recaptchaRef.current) {
      recaptchaRef.current.innerHTML = '';
    }
    
    // Remove only our script
    const script = document.getElementById('google-recaptcha-v2');
    if (script) {
      script.remove();
    }
    
    // Remove global callback
    delete window.onRecaptchaLoadCallback;
    
    // Reload after delay
    setTimeout(() => {
      loadRecaptchaScript();
    }, 1000);
  };
  
  // render status indicators, widget container, and control buttons
  return (
    <div className="flex justify-center">
      {/* reCAPTCHA Widget Container - Clean */}
      <div 
        ref={recaptchaRef}
        id={`recaptcha-container-${Date.now()}`}
        style={{ minHeight: '78px' }}
      />
      
      <input
        type="hidden"
        name="g-recaptcha-response"
        value={token || ''}
        required
      />
    </div>
  );
};

export default Recaptcha;