// Utility functions for FancySelect

const escapeHTML = (str) => String(str).replace(/"/g, '&quot;');

const getClassNames = (baseClass, conditions = {}) => {
  const classes = [baseClass];
  Object.entries(conditions).forEach(([className, condition]) => {
    if (condition) classes.push(className);
  });
  return classes.join(' ');
};

const replaceEventListener = (element, event, handler) => {
  element.removeEventListener(event, handler);
  element.addEventListener(event, handler);
};

// Make available globally for tests and browser usage
if (typeof global !== 'undefined') {
  global.escapeHTML = escapeHTML;
  global.getClassNames = getClassNames;
  global.replaceEventListener = replaceEventListener;
}

// ES6 module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { escapeHTML, getClassNames, replaceEventListener };
}
