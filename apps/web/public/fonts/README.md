# yoohoo.guru Brand Fonts

This folder contains the local font files for the yoohoo.guru branding system.

## Required Font Files

The application expects the following font files for optimal branding:

### Amatic SC (for "Yoohoo" text)
- `AmaticSC-Regular.woff2` (preferred format)
- `AmaticSC-Regular.woff` (fallback format)
- `AmaticSC-Bold.woff2` (preferred format)
- `AmaticSC-Bold.woff` (fallback format)

### Sakkal Majalla (for "Guru" text)
- `SakkalMajalla-Regular.woff2` (preferred format)
- `SakkalMajalla-Regular.woff` (fallback format)
- `SakkalMajalla-Bold.woff2` (preferred format)
- `SakkalMajalla-Bold.woff` (fallback format)

## Font Sources

- **Amatic SC**: Available from Google Fonts (https://fonts.google.com/specimen/Amatic+SC)
- **Sakkal Majalla**: Microsoft system font, available through various font distributors

## Font Loading

Fonts are loaded via CSS `@font-face` declarations in `src/styles/GlobalStyles.js` with `font-display: swap` for optimal performance.

## Fallback System

If local fonts fail to load, the system falls back to:
- Amatic SC → cursive fonts
- Sakkal Majalla → 'Amiri', 'Scheherazade New', serif fonts

## Current Fonts

- `Inter-Variable.woff2` - Used for general body text and UI elements
- `Inter-LICENSE.txt` - License file for Inter font