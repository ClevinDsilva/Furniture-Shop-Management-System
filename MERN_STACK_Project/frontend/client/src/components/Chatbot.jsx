import React, { useState, useEffect } from "react";
import "./Chatbot.css";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userName, setUserName] = useState("");
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recog = new window.webkitSpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = "en-US";
      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setTimeout(() => sendMessage(transcript), 500);
      };
      setRecognition(recog);
    }
  }, []);

  const toggleChat = () => {
    setOpen(!open);
    setMessages([]);
    setInput("");
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    synth.speak(utter);
  };

  const handleVoice = () => {
    if (recognition) recognition.start();
  };

  const sendMessage = (customText = null) => {
    const text = customText || input.trim();
    if (!text) return;

    const userMsg = { text, type: "user" };
    const updatedMessages = [...messages, userMsg];

    let botReply = "";

    if (!userName) {
      setUserName(text);
      botReply = `Hi ${text}! 👋 Welcome to our Furniture Store. You can ask about beds, sofas, delivery, or more.`;
    } else {
      botReply = generateReply(text, userName);
    }

    setMessages([...updatedMessages, { text: botReply, type: "bot" }]);
    speak(botReply);
    setInput("");
  };

  const generateReply = (message, name) => {
    const msg = message.toLowerCase();
  
    // Website guidance
    if (msg.includes("how to order") || msg.includes("place order")) {
      return `To place an order, just click on any product you like, then click "Add to Cart" and proceed to Checkout. Let me know if you need help with anything else, ${name}! 🛒`;
    }
  
    if (msg.includes("track order") || msg.includes("where is my order")) {
      return `To track your order, go to the "My Orders" section in your profile. You'll see your order status and tracking details there, ${name}. 📦`;
    }
  
    if (msg.includes("cancel order")) {
      return `If your order hasn’t shipped yet, you can cancel it from the "My Orders" page. Need help? Contact our support, ${name}. ❌`;
    }
  
    if (msg.includes("guide") || msg.includes("help") || msg.includes("how to")) {
      return `Sure ${name}, you can ask me about placing orders, tracking delivery, returns, or exploring furniture by category. Just type your question! 😊`;
    }
  
    // Product guidance
    if (msg.includes("sofa")) {
      scrollToSection("sofa");
      return `Sure ${name}! Here are our best sofas 🛋️ below.`;
    }
    if (msg.includes("bed")) {
      scrollToSection("bed");
      return `Hi ${name}, check out our top-selling beds 🛏️ below.`;
    }
    if (msg.includes("table")) {
      scrollToSection("table");
      return `We’ve got great tables for you ${name} — check below! 🪑`;
    }
    if (msg.includes("chair")) {
      scrollToSection("chair");
      return `Chairs? No problem ${name}, scroll down to see them!`;
    }
  
    // Delivery & return
    if (msg.includes("delivery")) {
      return `Hey ${name}, we offer FREE delivery within 5-7 days 🚚`;
    }
    if (msg.includes("return")) {
      return `Yes ${name}, returns accepted within 7 days. Keep the bill safe! 📦`;
    }
  
    // Category overview
    if (msg.includes("category")) {
      return `We offer Bedroom, Living Room, Office & Outdoor furniture. What would you like to see, ${name}?`;
    }
  
    return `Sorry ${name}, I didn’t catch that. Try asking about order help, tracking, or product categories. 😊`;
  };
  

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="chatbot-icon" onClick={toggleChat}>
        💬
      </div>

      {open && (
        <div className="chatbot-box">
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${msg.type === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder={userName ? "Ask me anything..." : "Hi! What's your name?"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
            <button onClick={handleVoice}>🎤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
