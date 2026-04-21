// backend/controllers/authController.js
const User = require('../models/User');
const jwt  = require('jsonwebtoken');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await User.create({ username, email, password, role });
    
    if (role === 'mechanic') {
      const Mechanic = require('../models/Mechanic');
      await Mechanic.create({
        userId: user._id,
        name: username,
        specialization: req.body.specialization || 'General',
        phone: req.body.phone || '0000000000',
        location: req.body.location || 'Unknown'
      });
    }

    res.status(201).json({ token: signToken(user._id), user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: signToken(user._id), user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
