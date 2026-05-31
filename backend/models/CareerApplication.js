const mongoose = require('mongoose');

const careerApplicationSchema = new mongoose.Schema({
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  email:      { type: String, required: true, trim: true, lowercase: true },
  phone:      { type: String, required: true, trim: true },
  jobTitle:   { type: String, required: true, trim: true },
  message:    { type: String, required: true, trim: true },
  cvFileName: { type: String, default: '' },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'shortlisted', 'rejected'],
    default: 'new',
  },
}, { timestamps: true });

module.exports = mongoose.model('CareerApplication', careerApplicationSchema);
