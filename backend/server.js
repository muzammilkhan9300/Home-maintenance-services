const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// multer — store CV in memory so we can attach it to the email
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
    fileFilter: (req, file, cb) => {
        const allowed = [
            'image/jpeg', 'image/png',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Unsupported file type'));
    }
});

app.use(cors());
app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// ─── Contact Route ──────────────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !phone || !service || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`,
        replyTo: email,
        to: process.env.OWNER_EMAIL,
        subject: `New Service Request: ${service} - from ${name}`,
        text: `
New Service Request from Afnan Property Care Website

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}
Message: ${message}

---
Sent from afnanpropertycare.ae contact form`,
        html: `
      <h2>New Service Request from Afnan Property Care Website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
      <br />
      <hr />
      <p>Sent from afnanpropertycare.ae contact form</p>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send message. Please try again or contact us directly.' });
    }
});

// ─── Career / Job Application Route ─────────────────────────────────────────
app.post('/api/career', upload.single('cv'), async (req, res) => {
    const { firstName, lastName, phone, email, jobTitle, message } = req.body;

    if (!firstName || !lastName || !phone || !email || !jobTitle || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!req.file) {
        return res.status(400).json({ error: 'CV file is required' });
    }

    const mailOptions = {
        from: `"${firstName} ${lastName}" <${process.env.SMTP_USER}>`,
        replyTo: email,
        to: process.env.OWNER_EMAIL,
        subject: `New Job Application: ${jobTitle} — ${firstName} ${lastName}`,
        text: `
New Job Application from Afnan Property Care Website

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Job Title: ${jobTitle}

Cover Letter / Message:
${message}

---
Sent from afnanpropertycare.ae careers form`,
        html: `
      <h2>New Job Application — Afnan Property Care</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Job Title Applied For:</strong> ${jobTitle}</p>
      <br/>
      <p><strong>Cover Letter / Message:</strong></p>
      <p style="white-space:pre-line">${message}</p>
      <br/>
      <hr/>
      <p>Sent from afnanpropertycare.ae careers form</p>
    `,
        attachments: [
            {
                filename: req.file.originalname,
                content: req.file.buffer,
                contentType: req.file.mimetype,
            },
        ],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Career application sent: %s', info.messageId);
        res.status(200).json({ success: true, message: 'Application submitted successfully!' });
    } catch (error) {
        console.error('Error sending career email:', error);
        res.status(500).json({ error: 'Failed to submit application. Please try again.' });
    }
});

// ─── Serve React Frontend ────────────────────────────────────────────────────
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.get(/^(?!\/api).*$/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
