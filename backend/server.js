const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

app.post('/api/contact', async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !phone || !service || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Email setup
    const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`, // Sender address (it must be an authorized email or the user will send a bounced email if DMARC is strict)
        replyTo: email,
        to: process.env.OWNER_EMAIL, // Receiver email
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
        res.status(500).json({ error: 'Failed to send the email.' });
    }
});

// Serve the React frontend from the built dist folder
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Catch-all route to serve index.html for React Router
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
