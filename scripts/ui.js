
// Applies [data-theme] to <html> and persists selection to localStorage

const THEME_KEY = 'clp.theme';

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (_) {
    return null;
  }
}

function setStoredTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (_) {
  
  }
}

function getPreferredTheme() {
  
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') return stored;
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  updateToggleLabel(theme);
}

function updateToggleLabel(theme) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const next = theme === 'dark' ? 'Light' : 'Dark';
  const icon = theme === 'dark' ? '🌙' : '🌞'; 
  btn.setAttribute('aria-pressed', theme === 'dark');
  btn.title = `Switch to ${next} mode`;
  btn.setAttribute('aria-label', `Switch to ${next} mode`);
  btn.innerHTML = `<span aria-hidden="true">${icon}</span><span class="sr-only">Switch to ${next} mode</span>`;
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  setStoredTheme(next);
}

function ensureToggleButtonListener() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.removeEventListener('click', toggleTheme);
  btn.addEventListener('click', toggleTheme);
}

function initTheme() {
  const theme = getPreferredTheme();
  applyTheme(theme);
  ensureToggleButtonListener();
  if (!getStoredTheme() && window.matchMedia) {
    try {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', (e) => {
        const t = e.matches ? 'dark' : 'light';
        applyTheme(t);
      });
    } catch (_) {
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme, { once: true });
} else {
  initTheme();
}

export { toggleTheme, applyTheme };

