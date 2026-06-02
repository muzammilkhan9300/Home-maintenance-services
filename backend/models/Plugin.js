const mongoose = require('mongoose');

const pluginSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  code:        { type: String, required: true, trim: true },
  placement:   { type: String, enum: ['head', 'body_start', 'body_end'], default: 'head' },
  isActive:    { type: Boolean, default: true },
  description: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Plugin', pluginSchema);
