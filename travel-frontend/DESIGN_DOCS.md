# LuxeTravel - Design Documentation

## 🎨 Design Inspiration

This project is inspired by [ASMALLWORLD](https://www.asmallworld.com/), a luxury travel community platform, adapted with a purple color scheme on light backgrounds.

## ✨ Key Features Implemented

### 1. **Navigation Header**
- **Centered Navigation**: Logo on left, menu items centered, auth buttons on right
- **Menu Items**: Collection, Bespoke, Editorials, Events, Membership
- **Sticky Header**: Remains visible while scrolling
- **Mobile Responsive**: Hamburger menu for mobile devices
- **Purple Accents**: Hover states use purple-600

### 2. **Video Hero Section**
- **Full-Screen Video Background**: Auto-playing, looped, muted video
- **Video File**: `/public/11490-230853032_small.mp4`
- **Overlay**: Dark overlay for text readability
- **Hero Title**: "Travel Discover Belong" with purple accent
- **CTA Button**: Rounded full button with white outline

### 3. **Color Scheme**
- **Primary Purple**: `purple-600` (#9333ea)
- **Light Background**: `gray-50`, white, and `purple-50`
- **Accents**: Purple gradients (purple-600 to purple-800)
- **Text**: Gray-900 for headings, gray-600 for body

### 4. **Typography**
- **Display Font**: Garamond (from `/Fonts/GARA.TTF`)
- **Body Font**: SourceCode (from `/Fonts/SourceCodeVariable-Roman.otf`)
- **Font Usage**:
  - Headings: `font-display` (Garamond)
  - Body: `font-serif` (Garamond)
  - UI Elements: `font-sans` (SourceCode)

### 5. **Feature Sections**
- **Three Main Features**: Styled with large icons and descriptive text
- **Alternating Layout**: Image-text alternating pattern
- **Purple Gradient Cards**: Feature cards with purple-100 to purple-50 gradient
- **Icons**: Large purple icons (Plane, Globe, Users)

### 6. **Member Benefits Grid**
- **6 Benefit Cards**: 3 columns on desktop, responsive on mobile
- **Icons**: Purple background circles with white icons
- **Content**: VIP benefits, Global community, Events, Inspiration, etc.

### 7. **Footer**
- **5-Column Layout**: Company, Travel, Support, Legal, Newsletter
- **Social Media Icons**: Facebook, Instagram, Twitter, YouTube, LinkedIn
- **Newsletter Signup**: Email input with subscribe button
- **Dark Theme**: Gray-900 background with gray-300 text
- **Purple Hover**: Links hover to purple-400

## 🎯 Brand Identity

### Logo
- **Name**: LuxeTravel
- **Font**: Garamond (font-display)
- **Color**: purple-600
- **Style**: Bold, tracking-tight

### Button Styles
1. **Primary**: `bg-purple-600`, rounded-full, shadow
2. **Secondary**: `bg-white`, `text-purple-600`, bordered
3. **Outline**: Transparent with white border, hover fills white

### Card Styles
- **Border Radius**: rounded-xl
- **Shadow**: shadow-md, hover:shadow-xl
- **Transition**: Smooth 300ms transitions

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎬 Video Specifications

- **Location**: `/public/11490-230853032_small.mp4`
- **Attributes**: autoPlay, loop, muted, playsInline
- **Object Fit**: cover (fills container)
- **Overlay**: 40% black opacity

## 🎨 Tailwind Custom Classes

### Container
```css
.container-custom {
  max-w-7xl mx-auto px-6 sm:px-8 lg:px-12
}
```

### Section Padding
```css
.section-padding {
  py-16 md:py-24
}
```

### Button Primary
```css
.btn-primary {
  px-8 py-3 bg-purple-600 text-white rounded-full
  hover:bg-purple-700 shadow-md hover:shadow-lg
}
```

### Button Outline
```css
.btn-outline {
  px-8 py-3 bg-transparent text-white rounded-full
  border-2 border-white hover:bg-white hover:text-purple-600
}
```

## 📐 Layout Structure

```
Header (Sticky)
├── Logo (Left)
├── Nav Menu (Center)
└── Auth Buttons (Right)

Hero Section (Full Screen Video)
├── Video Background
├── Overlay
└── Content (Centered)

Content Sections
├── Tagline
├── Features (Alternating)
├── Benefits Grid
└── CTA

Footer
├── Links Grid (5 columns)
├── Newsletter
└── Social + Copyright
```

## 🔤 Font Loading

Fonts are loaded via @font-face in `index.css`:

```css
@font-face {
  font-family: 'Garamond';
  src: url('/Fonts/GARA.TTF') format('truetype');
}

@font-face {
  font-family: 'SourceCode';
  src: url('/Fonts/SourceCodeVariable-Roman.otf') format('opentype');
}
```

## 🌈 Color Palette

### Purple Shades
- 50: #faf5ff (lightest)
- 100: #f3e8ff
- 200: #e9d5ff
- 300: #d8b4fe
- 400: #c084fc
- 500: #a855f7
- 600: #9333ea (primary)
- 700: #7e22ce
- 800: #6b21a8
- 900: #581c87
- 950: #3b0764 (darkest)

## 🚀 Running the Project

```bash
cd travel-frontend
npm run dev
```

Access at: **http://localhost:5174/**

## 📝 Future Enhancements

- [ ] Add more page templates (Collection, Bespoke, etc.)
- [ ] Implement user authentication UI
- [ ] Add destination cards/listings
- [ ] Create events calendar
- [ ] Build editorial blog section
- [ ] Add booking flow
- [ ] Integrate with backend API
- [ ] Add animation effects
- [ ] Implement image galleries
- [ ] Create member dashboard

## 🎯 Key Differences from ASMALLWORLD

1. **Purple Theme**: Purple instead of their neutral colors
2. **Font Choice**: Garamond + SourceCode (custom fonts)
3. **Video Hero**: Full-screen video background
4. **Simplified**: Focused on core features for MVP

## 📦 Dependencies

- React 18
- Vite
- Tailwind CSS v3.4
- React Router DOM
- Lucide React (icons)
- Axios (API calls)
- date-fns (date utilities)

---

**Design Philosophy**: Luxurious, clean, and elegant with purple accents on light backgrounds, inspired by high-end travel communities.

