// Generates a random numeric of desired length
export const generateRandomDigit = (length = 6) => {
  if (length < 1) return 0;

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
};

// Returns a string ID based on current timestamp + random suffix
export const generateTimestampID = () => {
  const now = Date.now();
  const rand = Math.floor(Math.random() * 1000);
  return `${now}${rand}`;
};

// Capitalizes the first letter of a string
export const capitalizeFirst = (str = '') => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Generates a random hex color code
export const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

// Checks if an object is empty
export const isEmptyObject = (obj = {}) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

// Converts a hex color code to RGB format
export const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};
