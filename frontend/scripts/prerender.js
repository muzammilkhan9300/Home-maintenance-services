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

// Start Express server to host the build
const app = express();
app.use(express.static(distPath));

// Catch-all route to serve index.html for React router (Express 5 compatible)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

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
      'ac-ventilation',
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

      // Wait additional time for DOM mounts and CSS animation states to stabilize
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Extract fully rendered HTML from the live DOM
      let htmlContent = await page.content();

      // Clean up duplicate template fallback tags if React Helmet dynamic tags are present
      if (htmlContent.includes('data-rh="true"')) {
        // Remove static fallback title from index.html template
        htmlContent = htmlContent.replace(/<title>Afnan Property Care - Premium Home Maintenance Services in Dubai<\/title>/gi, '');
        // Remove static fallback description from index.html template
        htmlContent = htmlContent.replace(/<meta name="description" content="Licensed property maintenance company in Dubai[^"]*"\s*\/?>/gi, '');
        // Remove static fallback OG tags from index.html template
        htmlContent = htmlContent.replace(/<meta property="og:title" content="Afnan Property Care - Dubai Home Maintenance"\s*\/?>/gi, '');
        htmlContent = htmlContent.replace(/<meta property="og:description" content="Professional residential property care services in Dubai[^"]*"\s*\/?>/gi, '');
      }

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
