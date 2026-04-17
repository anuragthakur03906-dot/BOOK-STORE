/**
 * @file helpers/handlers.js
 * @description Response and data formatting helpers
 */

/**
 * Pagination helper
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Skip and limit values
 */
export const getPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;
  
  return { skip, limit: limitNum };
};

/**
 * Format API response
 * @param {*} data - Response data
 * @param {Object} pagination - Pagination info (optional)
 * @returns {Object} Formatted response
 */
export const formatResponse = (data, pagination = null) => {
  const response = {
    success: true,
    data
  };
  
  if (pagination) {
    response.pagination = pagination;
  }
  
  return response;
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {string} errorCode - Custom error code
 * @returns {Object} Formatted error response
 */
export const formatErrorResponse = (message, statusCode = 500, errorCode = null) => {
  return {
    success: false,
    message,
    statusCode,
    ...(errorCode && { errorCode })
  };
};
