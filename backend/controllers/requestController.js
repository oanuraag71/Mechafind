const Request = require('../models/ServiceRequest');
const Mechanic = require('../models/Mechanic');

exports.create = async (req, res) => {
  try {
    if (req.body.mechanicId) {
      const mechanicExists = await Mechanic.findById(req.body.mechanicId);
      if (!mechanicExists)
        return res.status(404).json({ message: 'Selected mechanic was not found.' });
    }
    const r = await Request.create({ ...req.body, ownerId: req.user.id });
    res.status(201).json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const r = await Request.find({ ownerId: req.user.id }).populate('mechanicId');
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMechanicRequests = async (req, res) => {
  try {
    const mechanic = await require('../models/Mechanic').findOne({ userId: req.user.id });
    if (!mechanic) return res.json([]);
    const r = await Request.find({ mechanicId: mechanic.id }).populate('ownerId', 'username phone');
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const r = await Request.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
