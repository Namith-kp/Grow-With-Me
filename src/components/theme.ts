// Run theme initialization immediately 
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
});

// Initialize theme based on localStorage or default
function initializeTheme() {
  try {
    const savedTheme = localStorage.getItem('theme');
    console.log('Initializing theme, saved theme:', savedTheme);
    
    if (savedTheme === 'light') {
      console.log('Applying light theme');
      document.documentElement.classList.remove('dark');
    } else {
      // Default to dark theme for all other cases
      console.log('Applying dark theme');
      document.documentElement.classList.add('dark');
      if (!savedTheme) localStorage.setItem('theme', 'dark');
    }
  } catch (e) {
    console.error('Error initializing theme:', e);
    // Even on error, try to set dark mode
    document.documentElement.classList.add('dark');
  }
}

// Call it immediately as well
initializeTheme();

// Get the initial theme value
export const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
};

// Apply theme to document and localStorage
export const applyTheme = (theme: 'light' | 'dark'): void => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', theme);
};

// Toggle theme function
export const toggleTheme = (): 'light' | 'dark' => {
  const isDark = document.documentElement.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  applyTheme(newTheme);
  return newTheme;
};