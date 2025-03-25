// Theme utility functions

// Initialize theme on page load before React renders
(() => {
  try {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
      // Only use light mode if explicitly set
      document.documentElement.classList.remove('dark');
    } else {
      // In all other cases, default to dark mode
      document.documentElement.classList.add('dark');
      // Also save it to localStorage so it persists
      localStorage.setItem('theme', 'dark');
    }
    
    // Log the current theme state to console for debugging
    console.log('Theme initialized:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  } catch (e) {
    // Make sure dark mode is set even if there's an error
    document.documentElement.classList.add('dark');
    console.error('Error initializing theme, defaulting to dark:', e);
  }
})();

// Get the current theme from localStorage or system preference
export const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  
  // Always check document class first
  if (document.documentElement.classList.contains('dark')) {
    return 'dark';
  }
  
  // If no dark class found, check localStorage for explicit light preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    return 'light';
  }
  
  // Default to dark mode in all other cases
  return 'dark';
};

// Apply theme to document
export const applyTheme = (theme: 'light' | 'dark'): void => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Save preference to localStorage
  localStorage.setItem('theme', theme);
  console.log('Theme applied:', theme);
};

// Toggle between light and dark theme
export const toggleTheme = (): 'light' | 'dark' => {
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  applyTheme(newTheme);
  return newTheme;
};