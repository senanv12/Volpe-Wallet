const Card = require('../models/Card');

// Bütün kartları gətir (Qonaq və ya Real User)
const getCards = async (req, res) => {
  try {
    // Əgər istifadəçi qonaqdırsa, statik kartlar qaytar
    if (req.user.isGuest) {
      const banks = ["Kapital Bank", "ABB", "Pasha Bank", "LeoBank", "Unibank"];
      const guestCards = banks.map((bank, i) => ({
        _id: `guest_card_${i}`,
        cardNumber: `4127 **** **** ${1111 + i * 111}`,
        cardHolder: "GUEST USER",
        expiry: "01/30",
        balance: 500 + (i * 250),
        bankName: bank,
        cardType: i % 2 === 0 ? "Visa" : "MasterCard",
        theme: "dark"
      }));
      return res.json(guestCards);
    }

    // Real istifadəçidirsə bazadan gətir
    const cards = await Card.find({ user: req.user.id });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Kartlar yüklənmədi' });
  }
};

// Kart əlavə et (Offline rejimdə deaktivdir)
const addCard = async (req, res) => {
  if (req.user.isGuest) {
    return res.status(403).json({ message: "Qonaq rejimində kart əlavə edilə bilməz." });
  }

  const { cardNumber, cardHolder, expiry, cvv, cardType, balance } = req.body;
  try {
    const card = await Card.create({
      user: req.user.id,
      cardNumber,
      cardHolder,
      expiry,
      cvv,
      cardType: cardType || 'default',
      balance: balance || 0
    });
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ message: 'Kart əlavə edilmədi' });
  }
};

const deleteCard = async (req, res) => {
  if (req.user.isGuest) return res.status(403).json({ message: "Qonaq rejimində silmə funksiyası bağlıdır." });
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Kart silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Xəta baş verdi' });
  }
};

// Eksport siyahısının tam olduğundan əmin olun
module.exports = { getCards, addCard, deleteCard };