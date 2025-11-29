// Environment-aware logging utility
const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  // Only log in development
  dev: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  // Log errors in both environments (but sanitize for production)
  error: (message, error = null) => {
    if (isDevelopment) {
      console.error(message, error);
    } else {
      // In production, log sanitized error without sensitive details
      console.error(message);
    }
  },
  
  // Important system logs (always log but sanitize)
  info: (message) => {
    console.log(message);
  }
};

export default logger;