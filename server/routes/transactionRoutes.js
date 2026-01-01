const express = require('express');
const { getTransactions, addTransaction, transferMoney } = require('../controllers/transactionController'); // DÜZƏLİŞ
const { protect } = require('../middleware/authMiddleware'); // DÜZƏLİŞ
const router = express.Router();

router.route('/').get(protect, getTransactions).post(protect, addTransaction);

// Transfer routu
router.post('/transfer', protect, transferMoney);

module.exports = router;