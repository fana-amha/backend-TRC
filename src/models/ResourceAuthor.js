const mongoose = require('mongoose');

const ResourceAuthorSchema = new mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorInstitution: String,
  authorEmail: String,
  authorOrder: Number
});

module.exports = mongoose.model('ResourceAuthor', ResourceAuthorSchema);
