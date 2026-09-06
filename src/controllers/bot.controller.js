const botModel = require('../models/bot.model.js')
const generateSlug = require('../utils/generateSlug.js')
const dotenv = require('dotenv')

dotenv.config()

const createBot = async (req, res) => {
    try {
        const { botName, systemPrompt } = req.body;

        if (!botName || !systemPrompt) {
            return res.status(400).json({ message: "Please fill all the fields." })
        }

        const existing = await botModel.findOne({ ownerId: req.user.id })
        if (existing) {
            return res.status(400).json({ message: "You already have a bot." })
        }

        const slug = generateSlug(botName)
        const bot = await botModel.create({
            ownerId: req.user.id,
            botName,
            systemPrompt,
            slug
        })
        return res.status(200).json({
            message: "Bot generated successfully.",
            link: `${process.env.APP_URL}/chat/${bot.slug}`
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong." })

    }
}

const getMyBot = async (req, res) => {
    try {
        const bot = await botModel.findOne({ ownerId: req.user.id })
        if (!bot) {
            return res.status(404).json({ message: "No bot found." })
        }

        return res.status(200).json({
            _id: bot._id,
            botName: bot.botName,
            systemPrompt: bot.systemPrompt,
            slug: bot.slug,
            link: `${process.env.APP_URL}/chat/${bot.slug}`,
            isActive: bot.isActive,
            createdAt: bot.createdAt
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Somthing went wrong." })

    }
}

const editBot = async (req, res) => {
    try {
        const { systemPrompt } = req.body;

        if (!systemPrompt) {
            return res.status(400).json({ message: "System prompt is required." })
        }

        const bot = await botModel.findOneAndUpdate(
            { ownerId: req.user.id },
            { systemPrompt },
            { new: true }
        )

        if (!bot) {
            return res.status(404).json({ message: "No bot found." })
        }

        return res.status(200).json({
            message: "Bot updated successfully.",
            systemPrompt: bot.systemPrompt
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong." })
    }
}

module.exports = { createBot, getMyBot, editBot }