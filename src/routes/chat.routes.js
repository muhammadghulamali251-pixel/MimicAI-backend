const express = require('express')
const router = express.Router()
const chatControllers = require('../controllers/chatbot.controller.js')
const rateLimit = require('express-rate-limit')


// Per-IP limit — stops one visitor from hammering any bot
const chatLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    max: 10,              // max 10 requests per IP per window
    message: { message: "Too many requests, please slow down." }
})


// Per-bot limit — caps total load on a single popular bot regardless of IP
const botLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60, // total requests per bot per minute, tune to your OpenRouter quota
    keyGenerator: (req) => req.params.slug,
    message: { message: "This bot is getting a lot of traffic right now. Try again shortly." }
})

router.post('/:slug', chatLimiter, botLimiter, chatControllers.addPrompt)

module.exports = router