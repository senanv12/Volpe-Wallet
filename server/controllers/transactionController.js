const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Card = require('../models/Card');
const Notification = require('../models/Notification');

// --- GET TRANSACTIONS ---
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ADD TRANSACTION (CARD) ---
exports.addTransaction = async (req, res) => {
    // ... Bu hissə əvvəlki koddakı kimi qala bilər və ya aşağıdakı kimi sadələşdirin:
    const { cardId, amount, type, category } = req.body;
    try {
        const card = await Card.findById(cardId);
        if(!card) return res.status(404).json({message: "Kart yoxdur"});
        
        if(type === 'income') card.balance += Number(amount);
        else {
            if(card.balance < amount) return res.status(400).json({message: "Balans yoxdur"});
            card.balance -= Number(amount);
        }
        await card.save();

        const t = await Transaction.create({
            user: req.user.id, cardId, amount, type, category, description: category
        });
        res.status(201).json(t);
    } catch(e) { res.status(500).json({message: e.message}); }
};

// --- TRANSFER MONEY (FIX) ---
exports.transferMoney = async (req, res) => {
  const { recipientUsername, amount } = req.body;
  const senderId = req.user.id;
  const val = Number(amount);

  if (!recipientUsername || !val) {
      return res.status(400).json({ message: "İstifadəçi adı və məbləğ mütləqdir" });
  }

  try {
    const sender = await User.findById(senderId);
    
    // Username-də @ varsa təmizləyirik (məsələn: @senan -> senan)
    const cleanUsername = recipientUsername.replace('@', '').trim();
    
    // Case-insensitive (böyük-kiçik hərf fərqi olmadan) axtarış
    const recipient = await User.findOne({ 
        username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } 
    });

    if (!recipient) return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    if (sender._id.equals(recipient._id)) return res.status(400).json({ message: "Özünüzə göndərə bilməzsiniz" });
    if (sender.walletBalance < val) return res.status(400).json({ message: "Balans kifayət etmir" });

    // Köçürmə
    sender.walletBalance -= val;
    recipient.walletBalance += val;

    await sender.save();
    await recipient.save();

    // Tarixçələr
    await Transaction.create({
      user: sender._id, recipient: recipient._id, amount: val, type: 'transfer',
      category: 'Köçürmə', description: `${recipient.name}-a`
    });

    await Transaction.create({
      user: recipient._id, recipient: sender._id, amount: val, type: 'income',
      category: 'Gəlir', description: `${sender.name}-dan`
    });

    // Bildiriş
    await Notification.create({
      recipient: recipient._id, sender: sender._id, type: 'transfer',
      message: `${sender.name} sizə ${val} AZN göndərdi.`
    });

    res.status(200).json({ message: "Uğurlu" });

  } catch (error) {
    console.error("Transfer Error:", error);
    res.status(500).json({ message: error.message });
  }
};