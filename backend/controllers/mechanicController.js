// backend/controllers/mechanicController.js
const Mechanic = require('../models/Mechanic');

exports.getAll = async (req, res) => {
  const mechanics = await Mechanic.find().populate('userId','username email');
  res.json(mechanics);
};
exports.getOne = async (req, res) => {
  const m = await Mechanic.findById(req.params.id);
  if (!m) return res.status(404).json({ message: 'Not found' });
  res.json(m);
};
exports.create = async (req, res) => {
  const m = await Mechanic.create({ ...req.body, userId: req.user._id });
  res.status(201).json(m);
};
exports.update = async (req, res) => {
  const m = await Mechanic.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(m);
};
exports.addReview = async (req, res) => {
  const m = await Mechanic.findById(req.params.id);
  if (!m) return res.status(404).json({ message: 'Not found' });
  const { rating, comment } = req.body;
  m.reviews.push({ userId: req.user._id, rating, comment });
  
  // Update average rating
  const total = m.reviews.reduce((acc, curr) => acc + curr.rating, 0);
  m.rating = (total / m.reviews.length).toFixed(1);
  
  await m.save();
  res.json(m);
};