import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Local Font Face Declarations for yoohoo.guru Branding */
  @font-face {
    font-family: 'Amatic SC';
    src: url('/fonts/AmaticSC-Regular.woff2') format('woff2'),
         url('/fonts/AmaticSC-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Amatic SC';
    src: url('/fonts/AmaticSC-Bold.woff2') format('woff2'),
         url('/fonts/AmaticSC-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Sakkal Majalla';
    src: url('/fonts/SakkalMajalla-Regular.woff2') format('woff2'),
         url('/fonts/SakkalMajalla-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Sakkal Majalla';
    src: url('/fonts/SakkalMajalla-Bold.woff2') format('woff2'),
         url('/fonts/SakkalMajalla-Bold.woff') format('woff');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Inter';
    src: url('/fonts/Inter-Variable.woff2') format('woff2-variations');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }

  :root {
    /* Brand Colors */
    --yoohoo-blue: #007BFF;
    --growth-green: #28A745;
    --energy-orange: #FD7E14;
    
    /* Semantic Colors */
    --primary: var(--yoohoo-blue);
    --secondary: var(--growth-green);
    --accent: var(--energy-orange);
    --success: #28A745;
    --warning: #FFC107;
    --error: #DC3545;
    --info: #17A2B8;
    
    /* Dark Theme Colors */
    --background: #0f0f23;
    --surface: #1a1a35;
    --surface-secondary: #242447;
    --text: #FFFFFF;
    --text-secondary: #B8B8CC;
    --text-muted: #8A8A9E;
    --border: #2A2A4A;
    --card-bg: #1e1e3a;
    --input-bg: #252548;
    --nav-bg: rgba(15, 15, 35, 0.95);
    
    /* Light Theme Colors (when needed) */
    --light-background: #F8F9FA;
    --light-surface: #FFFFFF;
    --light-text: #212529;
    --light-text-secondary: #6C757D;
    
    /* Neutral Colors */
    --white: #FFFFFF;
    --light-gray: #F8F9FA;
    --gray-100: #F1F3F4;
    --gray-200: #E9ECEF;
    --gray-300: #DEE2E6;
    --gray-400: #CED4DA;
    --gray-500: #ADB5BD;
    --gray-600: #6C757D;
    --gray-700: #495057;
    --gray-800: #343A40;
    --gray-900: #212529;
    --black: #000000;
    
    /* Typography */
    --font-primary: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
    --font-heading: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
    
    /* Font Sizes */
    --text-xs: 0.75rem;
    --text-sm: 0.875rem;
    --text-base: 1rem;
    --text-lg: 1.125rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.5rem;
    --text-3xl: 1.875rem;
    --text-4xl: 2.25rem;
    --text-5xl: 3rem;
    
    /* Font Weights */
    --font-light: 300;
    --font-normal: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;
    
    /* Spacing */
    --space-1: 0.25rem;
    --space-2: 0.5rem;
    --space-3: 0.75rem;
    --space-4: 1rem;
    --space-5: 1.25rem;
    --space-6: 1.5rem;
    --space-8: 2rem;
    --space-10: 2.5rem;
    --space-12: 3rem;
    --space-16: 4rem;
    --space-20: 5rem;
    
    /* Border Radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.5rem;
    --radius-full: 9999px;
    
    /* Shadows for Dark Theme */
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
    
    /* Transitions */
    --transition-fast: 150ms ease-in-out;
    --transition-normal: 250ms ease-in-out;
    --transition-slow: 350ms ease-in-out;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-primary);
    font-size: var(--text-base);
    font-weight: var(--font-normal);
    line-height: 1.6;
    color: var(--text);
    background-color: var(--background);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color var(--transition-normal), color var(--transition-normal);
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: var(--font-semibold);
    line-height: 1.25;
    margin-bottom: var(--space-4);
    color: var(--text);
  }

  h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); }
  h2 { font-size: var(--text-3xl); }
  h3 { font-size: var(--text-2xl); }
  h4 { font-size: var(--text-xl); }
  h5 { font-size: var(--text-lg); }
  h6 { font-size: var(--text-base); }

  /* Utility Classes */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-4);
  }

  .text-center { text-align: center; }
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }

  /* Enhanced Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
    }
    70% {
      transform: scale(1.05);
      box-shadow: 0 0 0 20px rgba(0, 123, 255, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
    }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* Professional scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--surface);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: var(--radius-full);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
  }
`;

export default GlobalStyles;