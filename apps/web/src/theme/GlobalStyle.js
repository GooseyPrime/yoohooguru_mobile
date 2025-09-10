import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Inter var';
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
    src: url('/fonts/Inter-Variable.woff2') format('woff2');
  }

  :root {
    --bg: ${({ theme }) => theme.colors.bg};
    --surface: ${({ theme }) => theme.colors.surface};
    --elev: ${({ theme }) => theme.colors.elev};
    --text: ${({ theme }) => theme.colors.text};
    --muted: ${({ theme }) => theme.colors.muted};
    --border: ${({ theme }) => theme.colors.border};
    --pri: ${({ theme }) => theme.colors.pri};
    --succ: ${({ theme }) => theme.colors.succ};
    --warn: ${({ theme }) => theme.colors.warn};
    --err: ${({ theme }) => theme.colors.err};

    --r-sm: 6px; --r-md: 8px; --r-lg: 12px; --r-xl: 16px;
    --t-fast: 120ms; --t-med: 180ms; --t-slow: 240ms;
    
    /* Text sizes */
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: 1.875rem;
    
    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
  }

  html, body, #root { height: 100%; }
  body {
    margin: 0; 
    background: var(--bg); 
    color: var(--text);
    font-family: 'Inter var', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased; 
    -moz-osx-font-smoothing: grayscale;
  }
  * { box-sizing: border-box; }
  a { color: inherit; text-decoration: none; }
  .text-muted { color: var(--muted); }
  .hairline { border: 1px solid var(--border); }

  /* Typography scale - modern, crisp, and well-spaced */
  h1 { 
    font-size: var(--text-3xl);
    font-weight: 700; 
    line-height: 1.2; 
    letter-spacing: -0.025em;
    margin-bottom: 1rem;
  }
  h2 { 
    font-size: var(--text-2xl);
    font-weight: 600; 
    line-height: 1.25; 
    letter-spacing: -0.02em;
    margin-bottom: 0.75rem;
  }
  h3 { 
    font-size: var(--text-xl);
    font-weight: 600; 
    line-height: 1.3; 
    letter-spacing: -0.015em;
    margin-bottom: 0.5rem;
  }
  
  p, body { 
    font-size: var(--text-base);
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  .text-small { 
    font-size: var(--text-sm);
    line-height: 1.5;
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid var(--pri);
    outline-offset: 2px;
    border-radius: calc(var(--r-md) + 2px);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Fallback styles for when custom font fails to load */
  .font-loading-error {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
  }

  /* Ensure the app renders even with styling issues */
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Basic button reset for accessibility */
  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export default GlobalStyle;