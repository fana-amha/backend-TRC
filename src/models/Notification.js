const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: String,
  type: {
    type: String,
    enum: ['Approval', 'Rejection', 'Comment', 'Rating']
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: { updatedAt: false } });

module.exports = mongoose.model('Notification', NotificationSchema);
