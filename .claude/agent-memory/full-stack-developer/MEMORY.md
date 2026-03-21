# Vamos JT Tours - Full Stack Developer Memory

## Architecture Overview

**Stack:** Astro 5 + React 19 + Tailwind CSS 4 + Supabase + Netlify SSR

**Key Files:**
- `src/layouts/Layout.astro` - Main layout with SEO, fonts, meta
- `src/pages/index.astro` - Homepage with parallel data fetching
- `src/components/HeroSlider.tsx` - Hero section with video/image
- `src/components/TourFilter.tsx` - Tour filtering and display
- `src/lib/supabase-tours.ts` - Tour data fetching

## Performance Optimizations Applied

### Data Fetching
- All homepage API calls are parallelized with `Promise.all()`
- Supabase queries use field selection (not `select('*')`)
- Separate functions for listings vs detail pages

### React Hydration
- `HeroSlider`: `client:visible` (lazy hydrate)
- `Header`: `client:idle` (low priority)
- `TourFilter`: `client:visible` (when in viewport)
- `Footer`: `client:visible` (when in viewport)

### Media Optimization
- Testimonial images served locally as WebP (100x100px)
- Hero video uses `preload="none"` with IntersectionObserver
- Poster image uses optimized JPG format

## Project Patterns

### State Management
- Uses `nanostores` for global state (`language`, `theme`)
- Persistent language preference with `@nanostores/persistent`

### Styling
- Tailwind CSS 4 with custom theme in `global.css`
- Glassmorphism effects with `backdrop-filter: blur()`
- Dark mode by default (class-based)

### Component Hydration Directives
- `client:load` - Only for above-fold critical content (AVOID)
- `client:visible` - Recommended for most components
- `client:idle` - For non-critical UI (headers, footers)
- `client:only` - For components that must render client-side

## API Structure

### Tours API (`/api/tours`)
- GET: List all active tours
- POST: Create tour (admin)

### Newsletter API (`/api/newsletter/subscribe`)
- POST: Subscribe email to newsletter

## Image Guidelines

### Testimonials
- Location: `/public/images/testimonials/`
- Format: WebP
- Size: 100x100px (cropped to face)

### Hero
- Video: MP4 with poster JPG
- Mobile: Static image
- Desktop: Video with lazy loading

## SEO Implementation

### JSON-LD Schemas
- Organization schema
- Website schema
- FAQ schema (from WordPress API)
- Breadcrumb schema

### Meta Tags
- OpenGraph full support
- Twitter cards
- Geo location tags
- Canonical URLs