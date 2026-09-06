const express = require('express')
const router = express.Router()
const chatControllers = require('../controllers/chatbot.controller.js')
const rateLimit = require('express-rate-limit')


// RATE LIMIT
const chatLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    max: 10,              // max 10 requests per IP per window
    message: { message: "Too many requests, please slow down." }
})


router.post('/:slug', chatLimiter, chatControllers.addPrompt)

module.exports = router