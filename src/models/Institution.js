const mongoose = require('mongoose');

const InstitutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['University', 'NGO', 'Government', 'ResearchCenter'],
    required: true
  },
  website: String,
  email: String,
  country: String,
  city: String,
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Institution', InstitutionSchema);
