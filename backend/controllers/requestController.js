// backend/controllers/requestController.js
const Request = require('../models/ServiceRequest');

exports.create = async (req, res) => {
  try {
    const r = await Request.create({ ...req.body, ownerId: req.user._id });
    res.status(201).json(r);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.getMyRequests = async (req, res) => {
  try {
    const r = await Request.find({ ownerId: req.user._id }).populate('mechanicId');
    res.json(r || []);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.getMechanicRequests = async (req, res) => {
  try {
    const mechanic = await require('../models/Mechanic').findOne({ userId: req.user._id });
    if (!mechanic) return res.json([]);
    const r = await Request.find({ mechanicId: mechanic._id }).populate('ownerId','username phone');
    res.json(r || []);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateStatus = async (req, res) => {
  try {
    const r = await Request.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json(r);
  } catch (err) { res.status(500).json({ message: err.message }); }
};