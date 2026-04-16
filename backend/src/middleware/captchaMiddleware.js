import axios from 'axios';

export const verifyRecaptcha = async (req, res, next) => {
  try {
    // Skip in development if needed
    if (process.env.SKIP_CAPTCHA === 'true') {
      console.log(' Skipping captcha verification (SKIP_CAPTCHA=true)');
      req.captchaData = { verified: true, skipped: true };
      return next();
    }

    const { captchaToken } = req.body;

    console.log('Captcha v2 verification started');
    console.log(`Token present: ${!!captchaToken}`);

    // Debug: Check all recaptcha-related env variables
    console.log('[DEBUG] Environment check - RECAPTCHA_V2_SECRET_KEY:', process.env.RECAPTCHA_V2_SECRET_KEY ? 'Present' : 'Missing');

    if (!captchaToken) {
      console.log('No captcha token in request');
      return res.status(400).json({
        success: false,
        error: 'Security verification required. Please complete the "I\'m not a robot" check.',
        code: 'CAPTCHA_MISSING'
      });
    }

    // Retrieve secret key for Recaptcha v2 verification
    let secretKey = process.env.RECAPTCHA_V2_SECRET_KEY;

    if (!secretKey) {
      console.warn('RECAPTCHA_V2_SECRET_KEY not found in .env, using v2 test secret key for development');
      secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
      console.log(`Using test key ending with: ...${secretKey.substring(secretKey.length - 6)}`);
    } else {
      console.log(`Using production key ending with: ...${secretKey.substring(secretKey.length - 6)}`);
    }

    console.log('Verifying v2 captcha with Google API...');

    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';

    const response = await axios.post(verificationUrl, null, {
      params: {
        secret: secretKey,
        response: captchaToken,
        remoteip: req.ip || req.connection.remoteAddress
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Google API response:', {
      success: response.data.success,
      hostname: response.data.hostname,
      errorCodes: response.data['error-codes']
    });

    const { success, challenge_ts, hostname, 'error-codes': errorCodes } = response.data;

    if (!success) {
      console.log('Captcha v2 verification failed:', errorCodes);
      return res.status(400).json({
        success: false,
        error: 'Security verification failed. Please complete the "I\'m not a robot" check again.',
        code: 'CAPTCHA_FAILED',
        details: errorCodes
      });
    }

    console.log('Captcha v2 verified successfully');

    req.captchaData = {
      verified: true,
      version: 'v2',
      timestamp: challenge_ts,
      hostname
    };

    next();
  } catch (error) {
    console.error('Captcha v2 verification error execution:', error.message);

    // Allow in development
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Allowing development mode to bypass verification errors');
      req.captchaData = { verified: true, testMode: true };
      return next();
    }

    res.status(500).json({
      success: false,
      error: 'Security verification error',
      code: 'CAPTCHA_INTERNAL_ERROR'
    });
  }
};