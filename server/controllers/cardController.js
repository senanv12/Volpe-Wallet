const Card = require('../models/Card');


const getCards = async (req, res) => {
  try {

    const cards = await Card.find({ user: req.user.id });
    res.status(200).json(cards);
  } catch (error) {
    console.error("Kartları gətirərkən xəta:", error);
    res.status(500).json({ message: 'Server xətası: Kartlar yüklənmədi' });
  }
};


const addCard = async (req, res) => {
  const { cardNumber, cardHolder, expiry, cvv, cardType, balance } = req.body;


  if (!cardNumber || !cardHolder || !expiry || !cvv) {
    return res.status(400).json({ message: 'Zəhmət olmasa bütün sahələri doldurun' });
  }

  try {

    const cardExists = await Card.findOne({ cardNumber });
    if (cardExists) {
      return res.status(400).json({ message: 'Bu kart artıq sistemdə mövcuddur' });
    }


    const card = await Card.create({
      user: req.user.id, 
      cardNumber,
      cardHolder,
      expiry,
      cvv,
      cardType: cardType || 'default', 
      balance: balance ? Number(balance) : 0 
    });

    res.status(201).json(card);
  } catch (error) {
    console.error("Kart əlavə edilərkən xəta:", error);
    res.status(400).json({ message: 'Kart əlavə edilə bilmədi', error: error.message });
  }
};


const deleteCard = async (req, res) => {
  try {
   
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: 'Kart tapılmadı' });
    }

    if (card.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Bu kartı silməyə icazəniz yoxdur' });
    }


    await Card.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Kart uğurla silindi', id: req.params.id });
  } catch (error) {
    console.error("Kart silinərkən xəta:", error);
    res.status(500).json({ message: 'Server xətası baş verdi' });
  }
};


module.exports = {
  getCards,
  addCard,
  deleteCard
};