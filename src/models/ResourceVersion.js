const mongoose = require('mongoose');

const ResourceVersionSchema = new mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  versionNumber: {
    type: Number,
    required: true
  },
  fileURL: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: { updatedAt: false } });

module.exports = mongoose.model('ResourceVersion', ResourceVersionSchema);
