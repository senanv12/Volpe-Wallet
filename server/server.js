const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const cardRoutes = require('./routes/cardRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// MongoDB bağlantısı
connectDB().catch(() => console.log("⚠️ Offline rejim aktivdir."));

app.use(cors());
app.use(express.json());

// Qonaq girişi
app.post('/api/auth/guest-login', (req, res) => {
  res.json({
    _id: "guest_12345",
    name: "Qonaq İstifadəçi",
    username: "guest_volpe",
    email: "guest@volpe.com",
    walletBalance: 1000,
    avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    token: "guest_token_secret_2025",
    isGuest: true
  });
});

// Marşrutlar (Routes)
app.use('/api/auth', authRoutes); // LOGIN/SIGNUP BURADADIR
app.use('/api/cards', cardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server ${PORT} portunda aktivdir.`));