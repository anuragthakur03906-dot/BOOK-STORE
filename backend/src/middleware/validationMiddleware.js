// src/middleware/validationMiddleware.js
import { validationResult } from 'express-validator';

const validate = (validations) => {
  return async (req, res, next) => {
    console.log('Validation middleware - Path:', req.path);
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);

    try {
      // Run all validations
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      console.log('Validation errors array:', errors.array());

      if (errors.isEmpty()) {
        console.log('Validation passed');
        return next();
      }

      console.log('Validation failed - Sending 400 response');
      res.status(400).json({
        success: false,
        errors: errors.array(),
        error: errors.array()[0]?.msg || 'Validation failed'
      });

    } catch (error) {
      console.error('Validation middleware error:', error);
      res.status(500).json({
        success: false,
        error: 'Validation error'
      });
    }
  };
};

export default validate;