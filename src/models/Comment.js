const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Visible', 'Hidden', 'Flagged'],
    default: 'Visible'
  }
}, { timestamps: { updatedAt: false } });

module.exports = mongoose.model('Comment', CommentSchema);
