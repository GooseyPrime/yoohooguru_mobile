# Assets

This folder contains the logo and branding assets for yoohoo.guru.

## Logo Files

- `YooHoo.png` - Primary logo image (PNG format)
- `yoohooguru.jpg` - Full branding artwork (JPEG format)

## Usage

The Logo component (`/src/components/Logo.js`) implements the official branding:

- **"Yoohoo"** - Displayed in Amatic SC font (Google Fonts)
- **"Guru"** - Displayed in Sakkal Majalla font (with serif fallbacks)
- **Icon** - 🎯 target emoji as the brand icon

## Typography

The official app name follows this specification:
- `Yoohoo.Guru` where:
  - "Yoohoo" uses Amatic SC font family
  - "Guru" uses Sakkal Majalla font family (with fallbacks: Amiri, Scheherazade New, serif)

## Responsive Behavior

The Logo component includes responsive design:
- Desktop: Horizontal layout with all elements
- Mobile: Adaptive layout for smaller screens
- Configurable: Icon, image, and text can be shown/hidden independently

## Image Optimization Note

Current image files are large. Consider optimizing:
- YooHoo.png: 798 KiB (consider WebP format)
- yoohooguru.jpg: 4.24 MiB (consider compression and WebP format)