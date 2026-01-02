const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Card = require('../models/Card');
const Notification = require('../models/Notification');

// --- TRANSAKSİYALARI GƏTİR ---
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
        $or: [{ user: req.user.id }, { recipient: req.user.id }] 
    }).sort({ createdAt: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- KARTDAN MƏDAXİL/MƏXARİC ---
exports.addTransaction = async (req, res) => {
    const { cardId, amount, type, category } = req.body;
    try {
        const card = await Card.findById(cardId);
        if(!card) return res.status(404).json({message: "Kart tapılmadı"});
        
        const val = Number(amount);

        if(type === 'income') card.balance += val;
        else {
            if(card.balance < val) return res.status(400).json({message: "Kartda balans kifayət etmir"});
            card.balance -= val;
        }
        await card.save();

        const t = await Transaction.create({
            user: req.user.id, cardId, amount: val, type, category, description: category
        });
        res.status(201).json(t);
    } catch(e) { res.status(500).json({message: e.message}); }
};

// --- PUL KÖÇÜRMƏ (TRANSFER) ---
exports.transferMoney = async (req, res) => {
  const { recipientUsername, amount } = req.body;
  const senderId = req.user.id;
  const val = Number(amount);

  if (!recipientUsername || !val || val <= 0) {
      return res.status(400).json({ message: "Məbləğ və istifadəçi adı düzgün deyil" });
  }

  try {
    const sender = await User.findById(senderId);
    
    // Username təmizləmə (@ silinir, boşluqlar silinir)
    const cleanUsername = recipientUsername.replace('@', '').trim();
    
    // Case-insensitive (böyük-kiçik hərf fərqi olmadan) axtarış
    const recipient = await User.findOne({ 
        username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } 
    });

    if (!recipient) return res.status(404).json({ message: "İstifadəçi tapılmadı" });
    if (sender._id.equals(recipient._id)) return res.status(400).json({ message: "Özünüzə pul göndərə bilməzsiniz" });
    if (sender.walletBalance < val) return res.status(400).json({ message: "Pulqabınızda balans kifayət etmir" });

    // 1. Balansları Dəyiş
    sender.walletBalance -= val;
    recipient.walletBalance += val;

    await sender.save();
    await recipient.save();

    // 2. Sender üçün Tarixçə (Expense)
    await Transaction.create({
      user: sender._id, 
      recipient: recipient._id, 
      amount: val, 
      type: 'transfer', // Frontend-də bunu qırmızı göstərəcəyik
      category: 'Köçürmə', 
      description: `${recipient.name}-a göndərildi`
    });

    // 3. Recipient üçün Tarixçə (Income)
    await Transaction.create({
      user: recipient._id, // Sahibi recipient-dir
      recipient: sender._id, // "Kimdən gəlib" sahəsi
      amount: val, 
      type: 'income', // Frontend-də bunu yaşıl göstərəcəyik
      category: 'Gəlir', 
      description: `${sender.name}-dan gələn`
    });

    // 4. Bildiriş Göndər
    await Notification.create({
      recipient: recipient._id, 
      sender: sender._id, 
      type: 'transfer',
      message: `${sender.name} sizə ${val} AZN göndərdi.`
    });

    res.status(200).json({ 
        message: "Köçürmə uğurludur", 
        newBalance: sender.walletBalance 
    });

  } catch (error) {
    console.error("Transfer Error:", error);
    res.status(500).json({ message: "Sistem xətası baş verdi" });
  }
};