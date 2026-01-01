const Message = require('../models/Message');

// Mesaj Göndər
exports.sendMessage = async (req, res) => {
  const { recipientId, text } = req.body;
  
  if (!recipientId || !text) return res.status(400).json({ message: "Məlumat çatışmır" });

  try {
    const msg = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      text
    });
    // Mesajı yaradandan sonra dərhal populate edirik ki, Frontend-də "sender" null olmasın
    const populatedMsg = await Message.findById(msg._id).populate('sender', 'name avatar');
    
    res.status(201).json(populatedMsg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Söhbəti Gətir (CRASH PROBLEMİ BURADA OLA BİLƏR)
exports.getConversation = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: userId },
        { sender: userId, recipient: req.user.id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar'); // <--- BU VACİBDİR

    // Əgər mesaj yoxdursa boş array qaytar, null yox!
    res.json(messages || []); 
  } catch (error) {
    console.error(error);
    res.json([]); // Xəta olsa belə boş array qaytar ki, ekran qaralmasın
  }
};

// İstifadəçiləri Gətir
exports.getChatUsers = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { recipient: req.user.id }]
        }).populate('sender recipient', 'name username avatar');

        const usersMap = new Map();

        messages.forEach(msg => {
            // sender və ya recipient silinibse xəta verməsin
            if(!msg.sender || !msg.recipient) return;

            const otherUser = msg.sender._id.equals(req.user.id) ? msg.recipient : msg.sender;
            
            if(!usersMap.has(otherUser._id.toString())) {
                usersMap.set(otherUser._id.toString(), {
                    _id: otherUser._id,
                    name: otherUser.name,
                    username: otherUser.username,
                    avatar: otherUser.avatar,
                    lastMessage: msg.text
                });
            }
        });

        res.json(Array.from(usersMap.values()));
    } catch (error) {
        res.json([]); // Xəta olsa boş qaytar
    }
}