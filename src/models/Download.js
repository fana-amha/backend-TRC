const mongoose = require('mongoose');

const DownloadSchema = new mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  downloadDate: {
    type: Date,
    default: Date.now
  },
  ipAddress: String
});

module.exports = mongoose.model('Download', DownloadSchema);
