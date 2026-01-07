const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


exports.registerUser = async (req, res) => {
  const { fullName, email, password, username } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Bütün sahələri doldurun' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Bu e-poçt artıq qeydiyyatdan keçib' });


    const finalUsername = username || email.split('@')[0];
    const usernameExists = await User.findOne({ username: finalUsername });
    if (usernameExists) return res.status(400).json({ message: 'Bu istifadəçi adı artıq tutulub' });

 
    const user = await User.create({
      name: fullName,
      email,
      username: finalUsername,
      password: password, 
      walletBalance: 100 
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        walletBalance: user.walletBalance,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) { 
      res.json({
        _id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        walletBalance: user.walletBalance,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'E-poçt və ya şifrə yanlışdır' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.searchUsers = async (req, res) => {
  const keyword = req.query.query
    ? {
        $or: [
          { name: { $regex: req.query.query, $options: 'i' } },
          { username: { $regex: req.query.query, $options: 'i' } },
        ],
      }
    : {};

  try {
    const users = await User.find(keyword)
                            .find({ _id: { $ne: req.user._id } })
                            .select('name username avatar email _id');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.avatar) user.avatar = req.body.avatar;
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        walletBalance: updatedUser.walletBalance,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};