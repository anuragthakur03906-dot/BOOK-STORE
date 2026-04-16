/**
 * Captcha Utility Functions
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
 */
export const validateMathCaptchaAnswer = (captchaData, userAnswer) => {
  try {
    return parseInt(userAnswer) === captchaData.answer;
  } catch (error) {
    return false;
  }
};

/**
 * Rate limiting with captcha
 */
export const shouldShowCaptcha = (req) => {
  // Implement logic to decide when to show captcha
  // Based on failed attempts, IP, etc.
  return false; // Default
};