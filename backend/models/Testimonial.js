const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  customerName:     { type: String, required: true, trim: true },
  customerLocation: { type: String, default: 'Dubai, UAE', trim: true },
  rating:           { type: Number, min: 1, max: 5, default: 5 },
  reviewText:       { type: String, required: true, trim: true },
  serviceId:        { type: String, default: '' },
  isPublished:      { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
