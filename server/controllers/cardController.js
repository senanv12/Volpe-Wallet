const Card = require('../models/Card');

// @desc    İstifadəçinin bütün kartlarını gətir
// @route   GET /api/cards
const getCards = async (req, res) => {
  try {
    const cards = await Card.find({ user: req.user.id });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Kartları gətirərkən xəta baş verdi' });
  }
};

// @desc    Yeni kart əlavə et
// @route   POST /api/cards
const addCard = async (req, res) => {
  const { cardNumber, cardHolder, expiry, cvv, cardType, balance } = req.body;

  if (!cardNumber || !cardHolder || !expiry || !cvv) {
    return res.status(400).json({ message: 'Zəhmət olmasa bütün sahələri doldurun' });
  }

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
    res.status(400).json({ message: 'Kart əlavə edilə bilmədi', error: error.message });
  }
};

// @desc    Kartı sil
// @route   DELETE /api/cards/:id
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: 'Kart tapılmadı' });
    }

    if (card.user.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: 'Bu kartı silmək səlahiyyətiniz yoxdur' });
    }

    await card.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Xəta baş verdi' });
  }
};

// ƏN VACİB HİSSƏ: Buranı mütləq yoxlayın!
module.exports = {
  getCards,
  addCard,
  deleteCard
};