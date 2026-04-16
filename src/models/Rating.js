const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, { timestamps: { updatedAt: false } });

RatingSchema.index({ resourceId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);
