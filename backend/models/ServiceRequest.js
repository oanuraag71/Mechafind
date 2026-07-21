const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic' },
    issue:    { type: String, required: true },
    location: { type: String, required: true },
    status:   { type: String, enum: ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'], default: 'pending' },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
    notes:    { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
