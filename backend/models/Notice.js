const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title:     { type: String, required: true, trim: true },
  content:   { type: String, required: true, trim: true },
  type:      { type: String, enum: ['info', 'warning', 'promo'], default: 'info' },
  isActive:  { type: Boolean, default: true },
  startDate: { type: Date, default: null },
  endDate:   { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
