# BREACHMATRIX — Deployment Guide

This project is organized so you can deploy **only the pure website files** without any dev tools, node_modules, or templates.

---

## ⚡ Quick 1-Step Deploy

### Option 1: Drag & Drop (Netlify Drop)
1. Run `npm run build` (or open the existing `dist/` folder).
2. Go to **[Netlify Drop](https://app.netlify.com/drop)**.
3. Drag the entire `dist` folder into the browser window.
4. Your website is live worldwide in seconds!

---

### Option 2: Vercel CLI
Deploy only the `dist` directory:
```bash
# Preview deployment
vercel ./dist

# Production deployment
vercel --prod ./dist
```

---

### Option 3: Cloudflare Pages
1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **Create Application** → **Pages**.
2. Connect your Git repository.
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**.

---

### Option 4: GitHub Pages
1. Push your repository to GitHub.
2. In Repository **Settings** → **Pages**:
   - Set Source to **GitHub Actions** or point to the root directory / `dist` branch.

---

### Option 5: Traditional Web Hosting (cPanel / Apache / Nginx / S3)
Simply upload the contents of the `dist/` folder into your `public_html` or web root:
- `index.html` (Cover / Hero / Home)
- `about.html` (About page)
- `products.html` (Our Products page — Kraft & upcoming software)
- `works.html` (Selected Works page — UI for websites & mobile apps)
- `service.html` (Service page)
- `styles.css`
- `app.js`
- `gsap.min.js`
- `story-bundle.js`
- `/assets` (All images and icons)
- `robots.txt` & `sitemap.xml`

---

## 🛠 Rebuilding `dist/`
Whenever you edit pages or styles, run:
```bash
npm run build
```
This automatically updates and synchronizes all deployable files into `dist/`.
