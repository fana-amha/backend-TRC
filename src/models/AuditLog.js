const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  action: {
    type: String,
    required: true
  },
  entityType: String,
  entityId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed // Allow any JSON Object
}, { timestamps: { updatedAt: false } });

module.exports = mongoose.model('AuditLog', AuditLogSchema);
