const path = require('path');
const fs = require('fs');

const backendEnv = path.join(__dirname, '.env');
const rootEnv = path.join(__dirname, '..', '.env');

if (fs.existsSync(backendEnv)) {
  require('dotenv').config({ path: backendEnv });
} else if (fs.existsSync(rootEnv)) {
  require('dotenv').config({ path: rootEnv });
} else {
  require('dotenv').config();
}

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');

// ── Connect MongoDB ────────────────────────────────────────────────────────
require('./config/db')();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Ensure uploads directory exists ───────────────────────────────────────
const adsUploadDir = path.join(__dirname, 'uploads', 'ads');
if (!fs.existsSync(adsUploadDir)) fs.mkdirSync(adsUploadDir, { recursive: true });

// ── Multer for CV (career form) — memory storage ───────────────────────────
const cvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type'));
  },
});

app.use(cors());
app.use(express.json());

// ── Serve uploaded ad images statically ───────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Nodemailer transporter ─────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err, success) => {
  if (err) {
    console.error('❌ SMTP Connection Error:', err.message);
  } else {
    console.log('✅ SMTP connection is verified and ready');
  }
});

// ── Models (for public endpoints) ─────────────────────────────────────────
const ContactSubmission = require('./models/ContactSubmission');
const CareerApplication = require('./models/CareerApplication');
const Ad               = require('./models/Ad');
const Settings         = require('./models/Settings');
const Plugin           = require('./models/Plugin');
const cache            = require('./config/cache');

// ── Admin Routes ───────────────────────────────────────────────────────────
app.use('/api/admin/auth', require('./routes/adminAuth'));
app.use('/api/admin',      require('./routes/adminApi'));

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Unified Bootstrap — settings + plugins + ads in ONE request
// Cached in Node.js memory after first DB hit → subsequent calls < 5ms
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/bootstrap', async (req, res) => {
  try {
    const cached = cache.getCache();
    if (cached) return res.json(cached);

    const now = new Date();
    const [settings, plugins, ads] = await Promise.all([
      Settings.findOne().select(
        'businessName phone email address whatsappNumber workingHours tradeLicense googleAnalyticsId metaPixelId'
      ),
      Plugin.find({ isActive: true }).select('name code placement'),
      Ad.find({
        isActive: true,
        $and: [
          { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
          { $or: [{ endDate:   null }, { endDate:   { $gte: now } }] },
        ],
      }).select('-__v'),
    ]);

    const data = { settings: settings || {}, plugins: plugins || [], ads: ads || [] };
    cache.setCache(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load bootstrap configuration' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Active Ads (legacy endpoint — kept for backwards compatibility)
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/ads', async (req, res) => {
  try {
    const { placement } = req.query;
    const now = new Date();
    const query = {
      isActive: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate:   null }, { endDate:   { $gte: now } }] },
      ],
    };
    if (placement) query.placement = placement;
    const ads = await Ad.find(query).select('-__v');
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load ads' });
  }
});

// Track ad click
app.post('/api/ads/:id/click', async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { clickCount: 1 } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Track ad view
app.post('/api/ads/:id/view', async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Public testimonials
// ─────────────────────────────────────────────────────────────────────────────
const Testimonial = require('./models/Testimonial');
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch {
    res.status(500).json({ error: 'Failed to load testimonials' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Active notices / banners
// ─────────────────────────────────────────────────────────────────────────────
const Notice = require('./models/Notice');
app.get('/api/notices', async (req, res) => {
  try {
    const now = new Date();
    const notices = await Notice.find({
      isActive: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate:   null }, { endDate:   { $gte: now } }] },
      ],
    }).sort({ createdAt: -1 });
    res.json(notices);
  } catch {
    res.status(500).json({ error: 'Failed to load notices' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Active Custom Plugins / Scripts (legacy — bootstrap is preferred)
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/plugins', async (req, res) => {
  try {
    const active = await Plugin.find({ isActive: true }).select('name code placement');
    res.json(active);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load custom scripts' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Contact Form → save to DB + send email
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name || !email || !phone || !service || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Save to MongoDB
  try { await ContactSubmission.create({ name, email, phone, service, message }); }
  catch (dbErr) { console.error('DB save error (contact):', dbErr.message); }

  // Send email
  try {
    await transporter.sendMail({
      from:    `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to:      process.env.OWNER_EMAIL,
      subject: `New Service Request: ${service} - from ${name}`,
      html: `<h2>New Service Request — Afnan Property Care</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Service:</strong> ${service}</p>
             <p><strong>Message:</strong></p><p>${message}</p>
             <hr/><p><em>Sent from afnanpropertycare.ae contact form</em></p>`,
    });
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error (contact):', error);
    res.status(500).json({
      error: 'Failed to send message.',
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Career Form → save to DB + send email with CV attachment
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/career', (req, res, next) => {
  cvUpload.single('cv')(req, res, (err) => {
    if (err) {
      console.error('Multer upload error:', err.message);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}, async (req, res) => {
  const { firstName, lastName, phone, email, jobTitle, message } = req.body;
  if (!firstName || !lastName || !phone || !email || !jobTitle || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'CV file is required' });
  }

  // Save to MongoDB
  try {
    await CareerApplication.create({ firstName, lastName, phone, email, jobTitle, message, cvFileName: req.file.originalname });
  } catch (dbErr) { console.error('DB save error (career):', dbErr.message); }

  // Send email
  try {
    await transporter.sendMail({
      from:    `"${firstName} ${lastName}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to:      process.env.OWNER_EMAIL,
      subject: `New Job Application: ${jobTitle} — ${firstName} ${lastName}`,
      html: `<h2>New Job Application — Afnan Property Care</h2>
             <p><strong>Name:</strong> ${firstName} ${lastName}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Job Title:</strong> ${jobTitle}</p>
             <p><strong>Cover Letter:</strong></p>
             <p style="white-space:pre-line">${message}</p>
             <hr/><p><em>Sent from afnanpropertycare.ae careers form</em></p>`,
      attachments: [{ filename: req.file.originalname, content: req.file.buffer, contentType: req.file.mimetype }],
    });
    res.status(200).json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Email error (career):', error);
    res.status(500).json({
      error: 'Failed to submit application.',
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
});

// ── PUBLIC: Public settings (for contact info, Meta Pixel & GA4 IDs) ─────────
// Kept as legacy endpoint — frontend now uses /api/bootstrap instead
app.get('/api/settings/public', async (req, res) => {
  try {
    let settings = await Settings.findOne().select(
      'businessName phone email address whatsappNumber workingHours tradeLicense googleAnalyticsId metaPixelId'
    );
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load public settings' });
  }
});

// ── Health Check Endpoint ──────────────────────────────────────────────────
app.get('/api/healthcheck', (req, res) => {
  const mongoose = require('mongoose');
  const fs = require('fs');
  const path = require('path');
  const backendEnv = path.join(__dirname, '.env');
  const rootEnv = path.join(__dirname, '..', '.env');
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    paths: {
      backendEnv,
      backendEnvExists: fs.existsSync(backendEnv),
      rootEnv,
      rootEnvExists: fs.existsSync(rootEnv)
    },
    env: {
      MONGODB_URI: process.env.MONGODB_URI ? 'Defined' : 'Undefined',
      SMTP_HOST: process.env.SMTP_HOST ? 'Defined' : 'Undefined',
      SMTP_PORT: process.env.SMTP_PORT ? 'Defined' : 'Undefined',
      SMTP_USER: process.env.SMTP_USER ? 'Defined' : 'Undefined',
      SMTP_PASS: process.env.SMTP_PASS ? 'Defined' : 'Undefined',
      OWNER_EMAIL: process.env.OWNER_EMAIL ? 'Defined' : 'Undefined',
    }
  });
});

// ── Serve React Frontend (catch-all) ──────────────────────────────────────
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));
app.get(/^(?!\/api).*$/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
