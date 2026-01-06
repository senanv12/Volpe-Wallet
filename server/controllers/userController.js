const User = require('../models/User'); // User modelinizi buradan çağırın

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Axtarış sözü daxil edilməyib" });
    }

    // Ad (name) və ya İstifadəçi adına (username) görə axtarış
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } }
      ]
    }).select("name username avatar _id email"); // Yalnız lazım olanları qaytar

    res.json(users);
  } catch (error) {
    console.error("Axtarış xətası:", error);
    res.status(500).json({ message: "Server xətası" });
  }
};

module.exports = { searchUsers };