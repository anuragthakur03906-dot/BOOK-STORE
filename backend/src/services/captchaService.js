/**
 * @file services/captchaService.js
 * @description CAPTCHA generation and validation service for security
 */

/**
 * Generate simple math captcha
 * @returns {Object} Captcha data
 */
export const generateMathCaptcha = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operators = ['+', '-', '*'];
  const operator = operators[Math.floor(Math.random() * operators.length)];
  
  let answer;
  switch (operator) {
    case '+':
      answer = num1 + num2;
      break;
    case '-':
      answer = num1 - num2;
      break;
    case '*':
      answer = num1 * num2;
      break;
    default:
      answer = num1 + num2;
  }
  
  return {
    question: `${num1} ${operator} ${num2}`,
    answer: answer,
    captchaId: `math_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};

/**
 * Validate math captcha answer
 * @param {Object} captchaData - Captcha data object
 * @param {*} userAnswer - User's answer to validate
 * @returns {boolean} Whether the answer is correct
 */
export const validateMathCaptchaAnswer = (captchaData, userAnswer) => {
  try {
    return parseInt(userAnswer) === captchaData.answer;
  } catch (error) {
    return false;
  }
};
