// Simple local preference memory for which hub a user prefers.
const KEY = 'lastHub'; // 'angels' | 'skillshare'

export function setLastHub(hub) {
  try {
    localStorage.setItem(KEY, hub);
  } catch (error) {
    // Silently fail if localStorage is unavailable (e.g., incognito mode)
    console.warn('Failed to save hub preference:', error);
  }
}

export function getLastHub() {
  try {
    const value = localStorage.getItem(KEY);
    return (value === 'angels' || value === 'skillshare') ? value : null;
  } catch (error) {
    // Silently fail if localStorage is unavailable
    console.warn('Failed to load hub preference:', error);
    return null;
  }
}