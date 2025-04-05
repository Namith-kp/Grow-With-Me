// This script runs before React loads
(function() {
  try {
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // Default to dark for all other cases
      document.documentElement.classList.add('dark');
      // Only save if no preference was set before
      if (!savedTheme) localStorage.setItem('theme', 'dark');
    }
  } catch (e) {
    console.error('Theme initialization error:', e);
    // Even on error, try to set dark mode
    document.documentElement.classList.add('dark');
  }
})();