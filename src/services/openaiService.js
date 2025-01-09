const OpenAI = require("openai");
require('dotenv').config();

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateGPTResponse = async (message) => {
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: message }],
            stream: true,
        });

        // 스트리밍 방식으로 응답을 생성
        let reply = "";
        for await (const chunk of stream) {
            reply += chunk.choices[0]?.delta?.content || "";
        }

        return reply.trim();
    } catch (error) {
        console.error("Error generating GPT response:", error);
        throw new Error("Failed to generate GPT response.");
    }
};

module.exports = {generateGPTResponse};