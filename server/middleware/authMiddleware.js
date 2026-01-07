const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    // Qonaq rejimi bypass
    if (token === "guest_token_secret_2025") {
      req.user = { id: "guest_12345", isGuest: true };
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'İcazəsiz giriş' });
    }
  } else {
    res.status(401).json({ message: 'Token yoxdur' });
  }
};

module.exports = { protect };