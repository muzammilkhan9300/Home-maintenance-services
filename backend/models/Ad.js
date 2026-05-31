const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  imageUrl:    { type: String, default: '' },
  linkUrl:     { type: String, default: '' },
  placement: {
    type: String,
    enum: ['hero_banner', 'services_section', 'footer_strip', 'popup', 'sidebar_card'],
    required: true,
  },
  isActive:   { type: Boolean, default: true },
  startDate:  { type: Date, default: null },
  endDate:    { type: Date, default: null },
  clickCount: { type: Number, default: 0 },
  viewCount:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);
