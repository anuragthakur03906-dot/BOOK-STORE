import axios from 'axios';

/**
 * Verify reCAPTCHA v2 token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyRecaptcha = async (req, res, next) => {
  try {
    // Skip captcha in development if configured
    if (process.env.SKIP_CAPTCHA === 'true') {
      req.captchaData = { verified: true, skipped: true };
      return next();
    }

    const { captchaToken } = req.body;

    if (!captchaToken) {
      console.log('No captcha token in request');
      return res.status(400).json({
        success: false,
        error: 'Security verification required. Please complete the "I\'m not a robot" check.',
        code: 'CAPTCHA_MISSING'
      });
    }

    // Retrieve secret key for reCAPTCHA v2 verification
    let secretKey = process.env.RECAPTCHA_V2_SECRET_KEY;

    if (!secretKey) {
      // Use test key for development environments
      secretKey = '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe';
    }

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

    const { success, challenge_ts, hostname, 'error-codes': errorCodes } = response.data;

    if (!success) {
      return res.status(400).json({
        success: false,
        error: 'Security verification failed. Please complete the "I\'m not a robot" check again.',
        code: 'CAPTCHA_FAILED',
        details: errorCodes
      });
    }

    req.captchaData = {
      verified: true,
      version: 'v2',
      timestamp: challenge_ts,
      hostname
    };

    next();
  } catch (error) {
    // Allow in development when errors occur
    if (process.env.NODE_ENV !== 'production') {
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