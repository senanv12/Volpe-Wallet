const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAIChatResponse = async (req, res) => {
  const { message, history } = req.body;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash", 
      systemInstruction: "Sən Volpe AI-san. Azərbaycan dilində qısa, səmimi və maliyyə mövzularında köməksevər cavablar ver."
    });

    let chatHistory = (history || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
        chatHistory.shift(); 
    }

    const chat = model.startChat({
      history: chatHistory,
    });


    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("AI Xətası:", error);
    

    res.status(500).json({ 
      reply: "Sistemdə xəta baş verdi.",
      error: error.message,
      model: "gemini-2.0-flash" 
    });
  }
};