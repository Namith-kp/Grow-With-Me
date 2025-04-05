import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import '@/components/theme';

const root = createRoot(document.getElementById('root')!)

// Check and apply the theme on page load
// Check and apply the theme on page load
// Check and apply the theme on page load
const theme = localStorage.getItem('theme');
if (localStorage.getItem('theme') !== 'light') {
  document.documentElement.classList.add('dark');
  localStorage.setItem('theme', 'dark');
}

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
