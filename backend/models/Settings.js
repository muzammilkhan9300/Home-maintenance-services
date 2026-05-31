const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  businessName:     { type: String, default: 'Afnan Property Care Services' },
  phone:            { type: String, default: '+971-504200736' },
  email:            { type: String, default: 'info@maresidentialpropertycareservicellc.com' },
  address:          { type: String, default: 'Rolex Twin Tower - 33 Baniyas Rd - Al Rigga - Deira - Dubai' },
  whatsappNumber:   { type: String, default: '971504200736' },
  workingHours:     { type: String, default: 'Monday – Saturday: 9 AM – 5 PM' },
  tradeLicense:     { type: String, default: '1571076' },
  googleAnalyticsId:{ type: String, default: '' },
  metaPixelId:      { type: String, default: '' },
  smtpUser:         { type: String, default: '' },
  smtpPass:         { type: String, default: '' },
  ownerEmail:       { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
