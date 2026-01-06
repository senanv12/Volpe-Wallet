const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
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
app.listen(PORT, () => console.log(`Server ${PORT} portunda işləyir...`));