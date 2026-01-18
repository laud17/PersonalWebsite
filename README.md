# Lennon Audrain Portfolio Website

A modern, professional portfolio website with refined editorial aesthetics.

## Features

- **Responsive Design**: Works beautifully on all devices
- **Smooth Animations**: Scroll-triggered animations and transitions
- **Clean Code**: Well-organized HTML, CSS, and JavaScript
- **Fast Loading**: Optimized performance
- **Accessible**: Semantic HTML and proper contrast ratios

## Design Details

- **Aesthetic**: Editorial/refined with organic warmth
- **Typography**: 
  - Display: Cormorant Garamond (elegant serif)
  - Body: Crimson Pro (readable serif)
  - Sans-serif: Work Sans (modern accents)
- **Color Palette**: Warm earth tones with cream backgrounds
- **Animations**: Subtle fade-ins, slides, and hover effects

## Files Included

- `index.html` - Main HTML structure
- `styles.css` - Complete styling
- `script.js` - Interactive functionality

## Deployment Options

### Option 1: Deploy to Wix (Temporary - Until November)

1. **Using Custom HTML Embed**:
   - In Wix Editor, click (+) Add Elements
   - Go to Embed → Custom Embeds → HTML iframe
   - Copy sections of the HTML and paste into custom HTML elements
   - Note: This is limited - full page structure won't work in Wix

2. **Using Wix Velo (Code)**:
   - Enable Wix Velo (Developer Mode)
   - Add custom elements to pages
   - Embed CSS in the page settings
   - Note: Still constrained by Wix's framework

### Option 2: Preview Locally (Right Now)

1. **Simple Method**:
   - Download all three files to a folder
   - Double-click `index.html` to open in your browser
   - All features will work!

2. **Local Server Method** (Recommended):
   ```bash
   # If you have Python installed:
   python -m http.server 8000
   
   # Or if you have Node.js:
   npx serve
   ```
   - Then visit `http://localhost:8000` in your browser

### Option 3: Deploy to Proper Hosting (November 2025)

#### Free Options:
1. **Netlify** (Recommended):
   - Drag and drop your folder at netlify.com/drop
   - Or connect to GitHub for automatic updates
   - Free custom domain support
   - Instant deployment

2. **Vercel**:
   - Similar to Netlify
   - Great performance
   - Free tier available

3. **GitHub Pages**:
   - Free hosting from GitHub
   - Perfect for static sites
   - Custom domain support

#### Paid Options:
1. **Traditional Web Hosting**:
   - Bluehost, SiteGround, HostGator, etc.
   - Upload via FTP
   - Full control

2. **Cloudflare Pages**:
   - Fast global CDN
   - Free tier available
   - Excellent performance

## Customization Guide

### Update Content

**Publications**: Edit lines 73-123 in `index.html`
**About Section**: Edit lines 129-152 in `index.html`
**Contact Info**: Edit lines 177-201 in `index.html`

### Change Colors

Edit the CSS variables in `styles.css` (lines 1-13):
```css
--color-primary: #2c1810;    /* Main dark color */
--color-accent: #c17d4a;     /* Accent/link color */
--color-background: #faf8f5; /* Page background */
```

### Add Blog Posts

Replace the blog placeholder (lines 162-168 in `index.html`) with actual blog post cards following the publication card structure.

### Update Images

Replace image URLs in `index.html` with your own:
- Hero image: Line 46
- Book cover: Line 58
- Publication images: Lines 75, 86, 97

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Fully responsive

## Performance

- Lightweight: ~30KB total (before images)
- Fast loading: Uses Google Fonts CDN
- Optimized animations: CSS-based for smooth performance
- Responsive images: Loads appropriately sized images

## Adding Features

### Contact Form
To add a working contact form, you'll need:
1. Backend service (Formspree, Netlify Forms, or EmailJS)
2. Replace the contact section with a form element
3. Add form handling in JavaScript

### Blog Integration
For a full blog, consider:
1. Static site generator (Hugo, Jekyll, 11ty)
2. Headless CMS (Contentful, Strapi, Sanity)
3. Or keep it simple with markdown files

## Maintenance

- Update publication dates/links as needed
- Add new publications to the grid
- Update professional information in About section
- Refresh images periodically

## Questions?

For deployment help or customization questions, you can:
- Check documentation for your chosen hosting platform
- Use browser developer tools (F12) to test changes
- Preview locally before deploying

---

**Current Version**: 1.0
**Last Updated**: January 2025
**Built with**: HTML5, CSS3, Vanilla JavaScript
