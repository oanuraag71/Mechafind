const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

const normalizeAuthInput = ({ username, email, password, role }) => ({
  username: username?.trim(),
  email: email?.trim().toLowerCase(),
  password,
  role: role === 'mechanic' ? 'mechanic' : 'user',
});

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = normalizeAuthInput(req.body);
    const user = await User.create({ username, email, password, role });

    if (role === 'mechanic') {
      const Mechanic = require('../models/Mechanic');
      await Mechanic.create({
        userId: user.id,
        name: username,
        specialization: req.body.specialization || 'General',
        phone: req.body.phone || '0000000000',
        location: req.body.location || 'Unknown',
      });
    }

    res.status(201).json({ token: signToken(user.id), user: publicUser(user) });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ message: `An account with that ${field} already exists.` });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ token: signToken(user.id), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
