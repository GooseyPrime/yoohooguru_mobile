const theme = {
  colors: {
    bg: '#040118',
    surface: '#0A0B1E',
    elev: '#111225',
    text: '#E8EDF2',
    muted: '#9AA7B2',
    border: '#1A1D35',
    pri: '#00c78c',
    succ: '#00c78c',
    warn: '#F5B950',
    err: '#F26D6D',
    accent: '#00c78c'
  },
  radius: { sm: 6, md: 8, lg: 12, xl: 16 },
  shadow: {
    card: '0 4px 20px rgba(0,0,0,.25)',
    lg: '0 8px 32px rgba(0,0,0,.3)',
    xl: '0 12px 48px rgba(0,0,0,.35)'
  },
  motion: {
    fast: '120ms', med: '180ms', slow: '240ms',
    in: 'cubic-bezier(.2,.7,.25,1)', out: 'cubic-bezier(.3,.1,.2,1)'
  },
  fonts: {
    sans: `'Inter var', Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`
  }
};

export default theme;