import React, { useEffect, useState, useRef } from 'react';
import { useThemeContext } from '../../context/ThemeContext.jsx';

const Recaptcha = ({ onTokenChange, action = 'submit' }) => {
  const { mode } = useThemeContext();
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('Security verify...');
  const widgetIdRef = useRef(null);
  const isInitializedRef = useRef(false);
  const recaptchaRef = useRef(null);
  
  // Site key from environment variable
  const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Ld3HyYsAAAAAEwU8yD5deY3boVXcK9KRoFobUGd';

  useEffect(() => {
    loadRecaptchaScript();
    window.onRecaptchaLoadCallback = () => {
      if (!isInitializedRef.current) initializeWidget();
    };
  }, []);

  // Update theme when mode changes
  useEffect(() => {
    if (isInitializedRef.current) {
        // Unfortunately v2 doesn't support dynamic theme switching without re-rendering
        // So we just stick to the initial or manually reload if needed. 
        // For simplicity, we choose light/dark based on the first load.
    }
  }, [mode]);

  const loadRecaptchaScript = () => {
    if (window.grecaptcha && window.grecaptcha.render) {
      if (!isInitializedRef.current) initializeWidget();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadCallback&render=explicit`;
    script.async = true;
    script.defer = true;
    script.id = 'google-recaptcha-v2';
    document.head.appendChild(script);
  };
  
  const initializeWidget = () => {
    if (isInitializedRef.current || !window.grecaptcha?.render || !recaptchaRef.current) {
      if (!isInitializedRef.current) setTimeout(initializeWidget, 100);
      return;
    }
    
    try {
      const widgetId = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: SITE_KEY,
        theme: mode === 'dark' ? 'dark' : 'light',
        size: 'normal',
        callback: (t) => {
          setToken(t);
          setStatus('✓ Verified');
          if (onTokenChange) onTokenChange(t);
        },
        'expired-callback': () => {
          setToken('');
          setStatus('Session Expired');
          if (onTokenChange) onTokenChange('');
        }
      });
      widgetIdRef.current = widgetId;
      isInitializedRef.current = true;
    } catch (error) {
       console.error('reCAPTCHA render error');
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <div 
        ref={recaptchaRef}
        style={{ minHeight: '78px' }}
        className="w-full flex justify-center"
      />
      <input type="hidden" name="g-recaptcha-response" value={token || ''} required />
      {!token && <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest animate-pulse">{status}</span>}
    </div>
  );
};

export default Recaptcha;