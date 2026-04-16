const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  abstract: String,
  doi: String,
  keywords: [String],
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution'
  },
  fileURL: String,
  thumbnailURL: String,
  language: String,
  publicationDate: Date,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  visibility: {
    type: String,
    enum: ['Public', 'Restricted'],
    default: 'Public'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0.0
  },
  version: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
