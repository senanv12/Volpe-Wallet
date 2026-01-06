const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// <<<<<<< HEAD
const User = require('./models/User'); // Model yolunu yoxlayın

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Qoşulması (volpeDB bazasına)
mongoose.connect('mongodb://localhost:27017/volpeDB')
  .then(() => console.log("MongoDB-yə uğurla qoşuldu!"))
  .catch((err) => console.error("Qoşulma xətası:", err));

// --- 1. LIVE SEARCH ROUTE (Dinamik route-lardan yuxarıda olmalıdır) ---
app.get('/api/users/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2) {
      return res.status(400).json({ message: "Axtarış üçün minimum 2 hərf yazın." });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } }
      ]
    }).select("name username avatar _id").limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Serverdə axtarış xətası baş verdi." });
  }
});

// --- 2. SIGNUP ROUTE (Async funksiya ilə) ---
app.post('/api/users/signup', async (req, res) => {
  try {
    const { fullName, email, password, username } = req.body;
    
    // İstifadəçini yarat və await ilə yadda saxla
    const newUser = new User({ name: fullName, email, password, username });
    const savedUser = await newUser.save();
    
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: "Qeydiyyat xətası: " + error.message });
  }
});

// --- 3. LOGIN ROUTE ---
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ message: "E-poçt və ya şifrə səhvdir." });
    }
  } catch (error) {
    res.status(500).json({ message: "Login xətası." });
  }
});

const PORT = 5000;
// =======
const connectDB = require('./config/db');
// const locales = require('./data/locales'); // Buna ehtiyac qalmadı, settingsRoutes edir
const settingsRoutes = require('./settingsRoutes'); 

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// CORS ayarları (Frontend-dən gələn sorğular üçün vacibdir)
app.use(cors({
    origin: '*', // Təhlükəsizlik üçün gələcəkdə bura Vercel linkinizi yazarsınız
    credentials: true
}));

// --- ROUTES ---

// DÜZƏLİŞ BURADADIR: '/api' əvəzinə '/api/users' yazdıq
app.use('/api/users', require('./routes/authRoutes')); 

app.use('/api/cards', require('./routes/cardRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/friends', require('./routes/friendRoutes')); 
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Settings (Valyuta və Tərcümə)
app.use('/api', settingsRoutes); 

const PORT = process.env.PORT || 5000;
// >>>>>>> 80e1b45fd6db1969ff1b584867a6418e3e8ce138
app.listen(PORT, () => console.log(`Server ${PORT} portunda işləyir...`));