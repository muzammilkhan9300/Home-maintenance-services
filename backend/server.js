const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

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

// ── Models (for public endpoints) ─────────────────────────────────────────
const ContactSubmission = require('./models/ContactSubmission');
const CareerApplication = require('./models/CareerApplication');
const Ad               = require('./models/Ad');

// ── Admin Routes ───────────────────────────────────────────────────────────
app.use('/api/admin/auth', require('./routes/adminAuth'));
app.use('/api/admin',      require('./routes/adminApi'));

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: Active Ads (used by the frontend to display promotions)
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
    res.status(500).json({ error: 'Failed to send message. Please try again or contact us directly.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Career Form → save to DB + send email with CV attachment
// ─────────────────────────────────────────────────────────────────────────────
app.post('/api/career', cvUpload.single('cv'), async (req, res) => {
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
    res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
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
