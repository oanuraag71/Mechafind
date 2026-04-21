// backend/models/Mechanic.js
const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:           { type: String, required: true },
  specialization: { type: String, required: true },
  phone:          { type: String, required: true },
  location:       { type: String },
  coordinates:    { 
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 }
  },
  isAvailable:    { type: Boolean, default: true },
  rating:         { type: Number, default: 0 },
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Mechanic', mechanicSchema);