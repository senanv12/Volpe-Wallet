const express = require('express');
const router = express.Router();
const { getCards, addCard, deleteCard } = require('../controllers/cardController');
const { protect } = require('../middleware/authMiddleware');

// Route-lar
router.route('/')
  .get(protect, getCards)   // GET /api/cards
  .post(protect, addCard);  // POST /api/cards

router.route('/:id')
  .delete(protect, deleteCard); // DELETE /api/cards/:id

module.exports = router;