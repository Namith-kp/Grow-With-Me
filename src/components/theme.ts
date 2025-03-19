export const toggleTheme = () => {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.remove(currentTheme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };