const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminAuth = require('../middleware/adminAuth');

const ContactSubmission = require('../models/ContactSubmission');
const CareerApplication = require('../models/CareerApplication');
const Ad = require('../models/Ad');
const Testimonial = require('../models/Testimonial');
const Notice = require('../models/Notice');
const Settings = require('../models/Settings');
const Plugin = require('../models/Plugin');

const router = express.Router();

// ── Multer for ad images ──────────────────────────────────────────────────────
const adsDir = path.join(__dirname, '../uploads/ads');
if (!fs.existsSync(adsDir)) fs.mkdirSync(adsDir, { recursive: true });

const adImageUpload = multer({
  storage: multer.diskStorage({
    destination: adsDir,
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, unique + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) cb(null, true);
    else cb(new Error('Images only (jpg, png, webp, gif)'));
  },
});

// All routes below require admin JWT
router.use(adminAuth);

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalLeads, todayLeads, newLeads, weekLeads,
      totalApplications, newApplications,
      activeAds, totalAds,
      publishedTestimonials, activeNotices,
      activePlugins, totalPlugins,
    ] = await Promise.all([
      ContactSubmission.countDocuments(),
      ContactSubmission.countDocuments({ createdAt: { $gte: today } }),
      ContactSubmission.countDocuments({ status: 'new' }),
      ContactSubmission.countDocuments({ createdAt: { $gte: weekAgo } }),
      CareerApplication.countDocuments(),
      CareerApplication.countDocuments({ status: 'new' }),
      Ad.countDocuments({ isActive: true }),
      Ad.countDocuments(),
      Testimonial.countDocuments({ isPublished: true }),
      Notice.countDocuments({ isActive: true }),
      Plugin.countDocuments({ isActive: true }),
      Plugin.countDocuments(),
    ]);

    res.json({
      totalLeads, todayLeads, newLeads, weekLeads,
      totalApplications, newApplications,
      activeAds, totalAds,
      publishedTestimonials, activeNotices,
      activePlugins, totalPlugins,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// RECENT ACTIVITY (for dashboard feed)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/recent', async (req, res) => {
  try {
    const [recentLeads, recentApps] = await Promise.all([
      ContactSubmission.find().sort({ createdAt: -1 }).limit(5).select('name email service status createdAt'),
      CareerApplication.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email jobTitle status createdAt'),
    ]);
    res.json({ recentLeads, recentApps });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTACTS / LEADS
// ─────────────────────────────────────────────────────────────────────────────
router.get('/contacts', async (req, res) => {
  try {
    const { status, service, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (service && service !== 'all') query.service = service;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await ContactSubmission.countDocuments(query);
    const contacts = await ContactSubmission.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ contacts, total, pages: Math.ceil(total / parseInt(limit)), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/contacts/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'read', 'replied', 'archived'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const contact = await ContactSubmission.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!contact) return res.status(404).json({ error: 'Not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/contacts/:id', async (req, res) => {
  try {
    await ContactSubmission.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// CAREER APPLICATIONS
// ─────────────────────────────────────────────────────────────────────────────
router.get('/careers', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName:  { $regex: search, $options: 'i' } },
        { email:     { $regex: search, $options: 'i' } },
        { jobTitle:  { $regex: search, $options: 'i' } },
      ];
    }
    const total = await CareerApplication.countDocuments(query);
    const applications = await CareerApplication.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json({ applications, total, pages: Math.ceil(total / parseInt(limit)), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/careers/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'reviewing', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const app = await CareerApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/careers/:id', async (req, res) => {
  try {
    await CareerApplication.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADS
// ─────────────────────────────────────────────────────────────────────────────
router.get('/ads', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ads', adImageUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/ads/${req.file.filename}`;
    if (data.isActive !== undefined) data.isActive = data.isActive === 'true' || data.isActive === true;
    if (data.startDate === '') data.startDate = null;
    if (data.endDate === '') data.endDate = null;
    const ad = await Ad.create(data);
    res.status(201).json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/ads/:id', adImageUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/ads/${req.file.filename}`;
    if (data.isActive !== undefined) data.isActive = data.isActive === 'true' || data.isActive === true;
    if (data.startDate === '') data.startDate = null;
    if (data.endDate === '') data.endDate = null;
    const ad = await Ad.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!ad) return res.status(404).json({ error: 'Not found' });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/ads/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (ad?.imageUrl?.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', ad.imageUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/testimonials', async (req, res) => {
  try {
    const t = await Testimonial.create(req.body);
    res.status(201).json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/testimonials/:id', async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!t) return res.status(404).json({ error: 'Not found' });
    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// NOTICES
// ─────────────────────────────────────────────────────────────────────────────
router.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/notices', async (req, res) => {
  try {
    const n = await Notice.create(req.body);
    res.status(201).json(n);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/notices/:id', async (req, res) => {
  try {
    const n = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!n) return res.status(404).json({ error: 'Not found' });
    res.json(n);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/notices/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PLUGINS
// ─────────────────────────────────────────────────────────────────────────────
router.get('/plugins', async (req, res) => {
  try {
    const plugins = await Plugin.find().sort({ createdAt: -1 });
    res.json(plugins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/plugins', async (req, res) => {
  try {
    const p = await Plugin.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/plugins/:id', async (req, res) => {
  try {
    const p = await Plugin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/plugins/:id', async (req, res) => {
  try {
    await Plugin.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────
router.get('/analytics', async (req, res) => {
  try {
    const days = parseInt(req.query.period) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [dailyLeads, byService, byStatus, dailyApplications, appByStatus, adStats] = await Promise.all([
      ContactSubmission.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      ContactSubmission.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$service', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      ContactSubmission.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      CareerApplication.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      CareerApplication.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Ad.find({ isActive: true }).select('title clickCount viewCount placement'),
    ]);

    res.json({ dailyLeads, byService, byStatus, dailyApplications, appByStatus, adStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
router.get('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (settings) {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    } else {
      settings = await Settings.create(req.body);
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
