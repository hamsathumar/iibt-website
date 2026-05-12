# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML website for **IIBT Campus** — an educational institution based in Akkaraipattu, Eastern Province, Sri Lanka. The site was built by A2Labz.

There is no build system, package manager, or framework. Open any `.html` file directly in a browser to preview it, or use a local static server:

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Architecture

### Page Structure
Every HTML page follows this pattern:
1. Load shared CSS (`css/bootstrap.min.css`, `css/style.css`)
2. Empty `<div id="header"></div>` and `<div id="footer"></div>` placeholders
3. Page-specific content
4. JS libraries (jQuery, Bootstrap, WOW.js, Owl Carousel)
5. `js/main.js` (global behaviour)
6. An inline `<script>` that fetches and injects `includes/header.html` and `includes/footer.html` via the Fetch API

**Consequence:** Navigation and footer are defined only in `includes/header.html` and `includes/footer.html`. Edit those files to change nav links or footer content — never duplicate them in individual pages.

### Key Files
- `includes/header.html` — navbar (both upper contact bar and main nav)
- `includes/footer.html` — footer with quick links, contact info, gallery thumbnails
- `css/style.css` — all custom styles; CSS variables defined in `:root` (primary orange `#fb8500`, dark navy `#181d38`, rhino blue `#2b2e63`)
- `js/main.js` — initialises WOW.js, Owl Carousel (header + testimonial), sticky navbar, back-to-top, floating WhatsApp button
- `js/navBarActive.js` — highlights the current page's nav link
- `js/application.js` — handles the student application form logic

### Page Inventory
| File | Purpose |
|---|---|
| `index.html` | Home page |
| `about.html` | About, team, testimonials, partners |
| `programs.html` | Programs listing |
| `program1–6.html` | Individual program detail pages |
| `blogs.html` | Blog listing |
| `blog-post-1–8.html` | Individual blog post pages |
| `contact.html` | Contact form |
| `application.html` | Student application form |
| `verification.html` | Certificate verification (reads `data/certificates.json`) |
| `404.html` | Not-found page |
| `maintenance.html` | Maintenance mode page |

### Image Organisation
`img/` is split into purpose-based subdirectories:
- `img/brand/` — logos and favicon
- `img/team/` — lecturer and staff photos
- `img/affiliates/` — partner/affiliate logos (`aff1–4.png`)
- `img/blog/` — blog post thumbnail images
- `img/programs/` — images used on program detail and home pages
- `img/gallery/` — event photos (field visits, graduation, inauguration, etc.) — not directly referenced in HTML

### Third-party Libraries (CDN + local)
- Bootstrap 5.0.0 (CSS compiled to `css/bootstrap.min.css`; JS from CDN)
- Font Awesome 5.10.0 (CDN)
- Bootstrap Icons 1.4.1 (CDN)
- jQuery 3.4.1 (CDN)
- Owl Carousel (local: `lib/owlcarousel/`)
- WOW.js + Animate.css (local: `lib/wow/`, `lib/animate/`)
- Easing + Waypoints (local: `lib/easing/`, `lib/waypoints/`)
- Poppins font (Google Fonts + cdnfonts CDN)

### SCSS Source
Bootstrap SCSS source lives in `scss/bootstrap/scss/` alongside `scss/bootstrap.scss`. The compiled output is `css/bootstrap.min.css`. Custom styles go into `css/style.css` directly — there is no SCSS compile step for custom styles.

## Conventions
- Brand primary colour: `var(--primary)` / `#fb8500` (orange)
- Section backgrounds alternate between white, `#F9FAFB` (light gray), and `#F2F7FF` (light blue)
- Scroll animations use `class="wow fadeInUp" data-wow-delay="0.Xs"` — requires WOW.js to be initialised
- Owl Carousel instances are initialised in `js/main.js`; use class `testimonial-carousel` for the standard 1/2/3-item responsive carousel
- Active nav link highlighting is handled by `js/navBarActive.js` matching `window.location.pathname` against `href` attributes — keep `href` values as bare filenames (e.g. `about.html`, not `/about.html`)
