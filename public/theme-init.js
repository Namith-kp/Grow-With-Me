// This script runs before React loads
(function() {
    try {
      var savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // Default to dark if no preference
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      }
    } catch (e) {
      console.error('Theme initialization error:', e);
    }
  })();