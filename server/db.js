const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Sizin göndərdiyiniz yeni Atlas linki
    const uri = process.env.MONGO_URI || "mongodb+srv://sondeneme:senan123@ewallet.dmlafci.mongodb.net/volpeDB?retryWrites=true&w=majority";
    const conn = await mongoose.connect(uri);
    console.log(`🌍 MongoDB Atlas Qoşuldu: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Xətası: ${error.message}`);
    // Baza olmasa da server sönmür, qonaq rejimi üçün davam edir
  }
};

module.exports = connectDB;