const express = require('express');
const router = express.Router();
const Card = require('../models/Card'); // Kart modeliniz
const Transaction = require('../models/Transaction'); // Tranzaksiya modeliniz
const auth = require('../middleware/auth'); // İstifadəçi audentifikasiyası üçün

// @route   POST /api/transactions/transfer
// @desc    İstənilən alıcıya pul göndər və balansdan çıx (Şablon model)
// @access  Private
router.post('/transfer', auth, async (req, res) => {
  const { receiverUsername, amount, currency, sources } = req.body;
  const senderId = req.user.id; // Login olan istifadəçinin ID-si

  try {
    // 1. Məlumatların doluluğunu yoxla
    if (!receiverUsername || !amount || !sources || sources.length === 0) {
      return res.status(400).json({ message: "Bütün sahələr doldurulmalıdır." });
    }

    // 2. Kart balanslarını azaltmaq
    // Sources massivi: [{ cardId: "...", deductAmount: 10 }, ...]
    for (const source of sources) {
      const card = await Card.findOne({ _id: source.cardId, user: senderId });

      if (!card) {
        return res.status(404).json({ message: `Kart tapılmadı: ${source.cardId}` });
      }

      if (card.balance < source.deductAmount) {
        return res.status(400).json({ message: `${card.bankName} balansında kifayət qədər vəsait yoxdur.` });
      }

      // Balansı azaldırıq
      card.balance -= Number(source.deductAmount);
      await card.save();
    }

    // 3. Tranzaksiya tarixçəsi yaradırıq (Alıcı bazada olmasa da uğurlu sayılır)
    const newTransaction = new Transaction({
      sender: senderId,
      receiverName: receiverUsername, // İstifadəçinin daxil etdiyi şablon ad
      amount: Number(amount),
      currency: currency || 'AZN',
      status: 'success',
      type: 'transfer',
      description: `${receiverUsername} adlı alıcıya transfer edildi.`,
      date: new Date()
    });

    await newTransaction.save();

    // 4. Cavab qaytarırıq
    res.status(200).json({ 
      success: true,
      message: "Transfer uğurla tamamlandı!",
      transaction: newTransaction 
    });

  } catch (error) {
    console.error("Transfer Xətası:", error);
    res.status(500).json({ message: "Server daxili xətası baş verdi." });
  }
});

module.exports = router;