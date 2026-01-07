const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' 
  },
  cardNumber: { type: String, required: true },
  cardHolder: { type: String, required: true },
  expiry: { type: String, required: true },
  cvv: { type: String, required: true },
  balance: { type: Number, default: 0 }, 
  cardType: { type: String, default: 'default' }, 
  theme: { type: String, default: 'dark' } 
}, {
  timestamps: true
});

module.exports = mongoose.model('Card', cardSchema);