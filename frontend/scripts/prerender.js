import puppeteer from 'puppeteer-core';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8085;
const distPath = path.resolve(__dirname, '../dist');

// Path to the system Chrome — avoids downloading a separate Chromium binary
const CHROME_PATH =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// Capture the pristine Vite-built shell BEFORE any prerendering starts.
// Routes are prerendered in sequence and each one WRITES its optimized HTML
// back into dist/ (e.g. '/' overwrites dist/index.html). If the catch-all
// below re-read that file from disk, every route prerendered AFTER '/' would
// navigate against the *homepage's* already-optimized markup instead of the
// real SPA shell — silently inheriting the homepage's baked-in resource
// hints (like its hero image preload) into every other page's snapshot.
const pristineIndexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');

// Start Express server to host the build
const app = express();
app.use(express.static(distPath));

// Catch-all route to serve the pristine shell for React router (Express 5 compatible)
app.get(/.*/, (req, res) => {
  res.type('html').send(pristineIndexHtml);
});

// ── Chunks that NEVER need to load on initial paint ──────────────────────────
// These are deferred: they are still loaded but AFTER the page is interactive
const CHUNKS_TO_DEFER = [
  'recharts-',
  'Admin',
  'supabase-',
  'date-fns-',
  'cmdk-',
  'vaul-',
  'admin-widgets-',
  'carousel-',
];

// ── Chunks that are completely removed from preloads (never needed on page load)
const CHUNKS_TO_STRIP_PRELOAD = [
  'recharts-',
  'Admin',
  'supabase-',
  'real_',       // image JS wrappers
  'CareerModal-',
  'services-',   // service list data (not needed on landing page)
  'date-fns-',
  'cmdk-',
  'vaul-',
  'admin-widgets-',
  'carousel-',
  'framer-',
];

function optimizeHtml(htmlContent, routeUrl) {
  // ── 1. Strip duplicate static fallback tags ───────────────────────────────
  if (htmlContent.includes('data-rh="true"')) {
    htmlContent = htmlContent.replace(/<title>Afnan Property Care - Premium Home Maintenance Services in Dubai<\/title>/gi, '');
    htmlContent = htmlContent.replace(/<meta name="description" content="Licensed property maintenance company in Dubai[^"]*"\s*\/?>/gi, '');
    htmlContent = htmlContent.replace(/<meta property="og:title" content="Afnan Property Care - Dubai Home Maintenance"\s*\/?>/gi, '');
    htmlContent = htmlContent.replace(/<meta property="og:description" content="Professional residential property care services in Dubai[^"]*"\s*\/?>/gi, '');
  }

  // ── 1b. Un-flip the Google Fonts link back to non-blocking preload ────────
  // Puppeteer snapshots the DOM AFTER the page's own onload handler already
  // fired and flipped rel="preload" -> rel="stylesheet" (see index.html's
  // "NON-RENDER-BLOCKING ASYNC FONT LOAD" trick). Capturing that post-onload
  // state bakes a RENDER-BLOCKING stylesheet into the static HTML that ships
  // to every real visitor and to Lighthouse/PSI. Detect the tag by its
  // `onload=` attribute (unique to the async link; the <noscript> fallback
  // has no onload and must stay untouched) and force rel back to "preload".
  htmlContent = htmlContent.replace(
    /<link(?=[^>]*\sonload="[^"]*")(?=[^>]*\shref="https:\/\/fonts\.googleapis\.com\/css2\?)([^>]*)>/gi,
    (match, attrs) => `<link rel="preload"${attrs.replace(/\srel="[^"]*"/i, '')}>`
  );

  // ── 2. Strip heavy modulepreload hints (they trigger early fetch of all chunks) ─
  for (const chunk of CHUNKS_TO_STRIP_PRELOAD) {
    const re = new RegExp(`<link rel="modulepreload" as="script" crossorigin="" href="/assets/${chunk}[^"]*">`, 'g');
    htmlContent = htmlContent.replace(re, '');
  }
  // Always strip seo- and tanstack- from preloads (not needed for initial render)
  htmlContent = htmlContent.replace(/<link rel="modulepreload" as="script" crossorigin="" href="\/assets\/seo-[^"]*">/g, '');
  htmlContent = htmlContent.replace(/<link rel="modulepreload" as="script" crossorigin="" href="\/assets\/tanstack-[^"]*">/g, '');
  htmlContent = htmlContent.replace(/<link rel="modulepreload" as="script" crossorigin="" href="\/assets\/forms-[^"]*">/g, '');
  htmlContent = htmlContent.replace(/<link rel="modulepreload" as="script" crossorigin="" href="\/assets\/ui-utils-[^"]*">/g, '');
  htmlContent = htmlContent.replace(/<link rel="modulepreload" as="script" crossorigin="" href="\/assets\/style-utils-[^"]*">/g, '');

  // ── 3. Convert heavy <script type="module"> tags to defer ─────────────────
  // This is CRITICAL for TBT: deferred scripts don't block the main thread
  for (const chunk of CHUNKS_TO_DEFER) {
    const re = new RegExp(`(<script type="module" crossorigin src="/assets/${chunk}[^"]*")>`, 'g');
    htmlContent = htmlContent.replace(re, '$1 defer>');
  }

  // ── 4. Add defer to vendor and non-critical shared chunks ─────────────────
  // vendor, forms, ui-utils, style-utils, tanstack — not needed for first paint
  htmlContent = htmlContent.replace(
    /(<script type="module" crossorigin src="\/assets\/vendor-[^"]*")>/g,
    '$1 defer>'
  );
  htmlContent = htmlContent.replace(
    /(<script type="module" crossorigin src="\/assets\/forms-[^"]*")>/g,
    '$1 defer>'
  );
  htmlContent = htmlContent.replace(
    /(<script type="module" crossorigin src="\/assets\/ui-utils-[^"]*")>/g,
    '$1 defer>'
  );
  htmlContent = htmlContent.replace(
    /(<script type="module" crossorigin src="\/assets\/style-utils-[^"]*")>/g,
    '$1 defer>'
  );
  htmlContent = htmlContent.replace(
    /(<script type="module" crossorigin src="\/assets\/tanstack-[^"]*")>/g,
    '$1 defer>'
  );
  htmlContent = htmlContent.replace(
    /(<script type="module" crossorigin src="\/assets\/seo-[^"]*")>/g,
    '$1 defer>'
  );

  // ── 5. Inject hero image <link rel="preload"> ─────────────────────────────
  const heroImgMatch =
    htmlContent.match(/<img[^>]+src="([^"]+(?:hero|real_|service)[^"]*\.(?:webp|jpg|png))"[^>]*>/i) ||
    htmlContent.match(/<img[^>]+fetchpriority="high"[^>]+src="([^"]+\.(?:webp|jpg|png))"[^>]*>/i) ||
    htmlContent.match(/<img[^>]+src="([^"]+\.(?:webp|jpg|png))"[^>]+fetchpriority="high"[^>]*>/i);

  if (heroImgMatch && heroImgMatch[1] && !htmlContent.includes(`rel="preload" as="image" href="${heroImgMatch[1]}"`)) {
    const preloadTag = `<link rel="preload" as="image" href="${heroImgMatch[1]}" fetchpriority="high" type="image/webp" />`;
    htmlContent = htmlContent.replace('</head>', `${preloadTag}</head>`);
  }

  return htmlContent;
}

const server = app.listen(PORT, async () => {
  console.log(`[prerender] Local server running on port ${PORT}`);
  try {
    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });
    const page = await browser.newPage();

    // Set screen size
    await page.setViewport({ width: 1280, height: 900 });

    const serviceIds = [
      'ac-cleaning',
      'building-cleaning',
      'painting',
      'electrical',
      'plumbing',
      'sanitary-pipes',
      'tiling',
      'property-care',
      'systems-maintenance',
      'plaster-works'
    ];

    const routesToPrerender = [
      { url: '/', dest: [distPath] },
      { url: '/services', dest: [path.join(distPath, 'services')] },
      { url: '/about', dest: [path.join(distPath, 'about')] },
      { url: '/contact', dest: [path.join(distPath, 'contact')] },
    ];

    // Add all service detail pages to prerender list
    for (const id of serviceIds) {
      const destDirs = [path.join(distPath, 'services', id)];
      if (id === 'ac-cleaning') {
        destDirs.push(path.join(distPath, 'ac-cleaning'));
      }
      routesToPrerender.push({ url: `/services/${id}`, dest: destDirs });
    }

    for (const item of routesToPrerender) {
      console.log(`[prerender] Navigating to http://localhost:${PORT}${item.url}`);
      await page.goto(`http://localhost:${PORT}${item.url}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      // Wait for DOM mounts and CSS animation states to stabilize
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Extract fully rendered HTML from the live DOM
      let htmlContent = await page.content();

      // Apply all optimizations
      htmlContent = optimizeHtml(htmlContent, item.url);

      for (const destDir of item.dest) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.writeFileSync(path.join(destDir, 'index.html'), htmlContent, 'utf8');
        console.log(`[prerender] ✅ Static HTML pre-rendered: ${path.relative(distPath, path.join(destDir, 'index.html'))}`);
      }
    }

    await browser.close();
  } catch (error) {
    console.error(`[prerender] ❌ Error during pre-rendering:`, error.message);
    // Non-fatal: the normal SPA build still works even without prerender
  } finally {
    server.close(() => {
      console.log(`[prerender] Local server stopped`);
      process.exit(0);
    });
  }
});
