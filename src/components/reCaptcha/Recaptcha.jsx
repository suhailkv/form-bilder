import React, { useEffect, useRef, useState } from 'react';

const Recaptcha = ({ sitekey, callback }) => {
  const recaptchaRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);

  // Load reCAPTCHA script
  useEffect(() => {
    window.onRecaptchaLoad = () => {
      setIsRecaptchaLoaded(true);
    };

    if (!window.grecaptcha) {
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.grecaptcha && window.grecaptcha.render) {
      setIsRecaptchaLoaded(true);
    }

    return () => {
      window.onRecaptchaLoad = null;
    };
  }, []);

  // Render reCAPTCHA widget
  useEffect(() => {
    if (isRecaptchaLoaded && recaptchaRef.current && widgetIdRef.current === null) {
      try {
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: sitekey,
          callback: callback
        });
      } catch (error) {
        console.error('reCAPTCHA render error:', error);
      }
    }

    // Cleanup: reset widget when component unmounts
    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (error) {
          console.error('reCAPTCHA reset error:', error);
        }
      }
    };
  }, [isRecaptchaLoaded, sitekey, callback]);

  return <div ref={recaptchaRef}></div>;
};

export default Recaptcha;