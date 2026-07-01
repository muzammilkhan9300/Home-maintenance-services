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

    console.log(`[prerender] Navigating to http://localhost:${PORT}/services/ac-cleaning`);
    await page.goto(`http://localhost:${PORT}/services/ac-cleaning`, {
      waitUntil: 'networkidle0',
      timeout: 45000
    });

    // Wait additional time for DOM mounts and CSS animation states to stabilize
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Extract fully rendered HTML from the live DOM
    const htmlContent = await page.content();

    // Define write targets (both URL patterns the page can be reached at)
    const destDir1 = path.join(distPath, 'services', 'ac-cleaning');
    const destDir2 = path.join(distPath, 'ac-cleaning');

    fs.mkdirSync(destDir1, { recursive: true });
    fs.mkdirSync(destDir2, { recursive: true });

    fs.writeFileSync(path.join(destDir1, 'index.html'), htmlContent, 'utf8');
    fs.writeFileSync(path.join(destDir2, 'index.html'), htmlContent, 'utf8');

    console.log(`[prerender] ✅ Static HTML pre-rendered successfully:`);
    console.log(`  - dist/services/ac-cleaning/index.html`);
    console.log(`  - dist/ac-cleaning/index.html`);

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
