const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB-yə qoşulma cəhdi
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`\n🚀 MongoDB Uğurla Qoşuldu!`);
    console.log(`HOST: ${conn.connection.host}`);
    console.log(`DATABASE: ${conn.connection.name}\n`);
    
  } catch (error) {
    console.error(`\n❌ MongoDB Qoşulma Xətası: ${error.message}`);
    console.log("Məsləhət: MongoDB proqramının kompüterdə açıq olduğundan əmin olun.\n");
    process.exit(1); // Serveri dayandır
  }
};

module.exports = connectDB;