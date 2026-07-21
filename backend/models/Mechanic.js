const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name:     { type: String, required: true },
    phone:    { type: String, required: true },
    location: { type: String, required: true },
    specialization: { type: String },
    experience: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    rating:   { type: Number, default: 0 },
    reviews:  [{ user: String, comment: String, rating: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mechanic', mechanicSchema);
