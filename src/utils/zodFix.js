/*
 * This utility helps fix Zod validation errors by providing
 * safe default values for undefined objects
 */

// Add this to your main index.js or App.js to patch potential Zod validation issues
export const patchZodValidation = () => {
  // Override the global Error object to catch and fix Zod errors
  const originalError = window.Error;
  
  window.Error = function(message) {
    // Check if this is a Zod validation error
    if (message && message.includes('ZodError')) {
      console.warn('Intercepted Zod validation error:', message);
      
      // Here we could add specific fixes for known validation issues
      // For example, if we know a specific component is causing issues:
      
      // Check if there are any undefined objects in local storage that should be objects
      const keysToCheck = [
        'nammaTourUser',
        'tourData',
        'searchPreferences',
        'bookingData'
      ];
      
      keysToCheck.forEach(key => {
        const item = localStorage.getItem(key);
        if (item === 'undefined' || item === 'null') {
          console.warn(`Fixing invalid localStorage value for ${key}`);
          localStorage.removeItem(key);
        }
      });
    }
    
    // Call the original Error constructor
    return new originalError(message);
  };
  
  // Preserve prototype and other properties
  window.Error.prototype = originalError.prototype;
  Object.setPrototypeOf(window.Error, originalError);
  
  console.log('Zod validation patch applied');
};

// Helper to ensure objects are valid before validation
export const ensureValidObject = (obj, defaultValue = {}) => {
  if (obj === undefined || obj === null) {
    console.warn('Providing default value for undefined/null object');
    return defaultValue;
  }
  return obj;
};
