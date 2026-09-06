const dotenv = require("dotenv");
const { buildSystemPrompt } = require('../utils/buildSystemPrompt.js')
const botModel = require('../models/bot.model.js')
dotenv.config();



const generateResponse = async (messages) => {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${process.env.OPENROUTER_API_KEY}`
            },
            body: JSON.stringify({
                model : "openai/gpt-4o-mini",
                messages 
            })
        })
        if (!response.ok) {
            throw new Error("Failed to generate response");
        }
        const result = await response.json();
        return result.choices[0].message.content;

    } catch (err) {
       return { error: err.message };
    }
}

const addPrompt = async (req, res) => {
    try {
        const { slug } = req.params;
        const { prompt, history = [] } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required." });
        }

        const bot = await botModel.findOne({ slug, isActive: true });
        if (!bot) {
            return res.status(404).json({ message: "Bot not found." });
        }

        const messages = [
            { role: "system", content: buildSystemPrompt(bot.systemPrompt) },
            ...history,
            { role: "user", content: prompt }
        ];

        const reply = await generateResponse(messages);
        return res.status(200).json({ reply });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong." });
    }
}

module.exports = { generateResponse, addPrompt };