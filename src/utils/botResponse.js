function generateBotResponse(userMessage) {
    if (userMessage.toLowerCase().includes("hello")) {
      return "Hello! How can I assist you today?";
    } else if (userMessage.toLowerCase().includes("bye")) {
      return "Goodbye! Have a great day!";
    } else {
      return "I am not sure how to respond to that. Can you elaborate?";
    }
  }
  
  module.exports = { generateBotResponse };
  