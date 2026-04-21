// backend/models/ServiceRequest.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  ownerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mechanicId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic', required: true },
  vehicleInfo: { type: String, required: true },
  description: { type: String, required: true },
  isEmergency: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending','accepted','rejected','completed'],
    default: 'pending'
  },
  rating: { type: Number },
  reviewText: { type: String },
  requestDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', requestSchema);