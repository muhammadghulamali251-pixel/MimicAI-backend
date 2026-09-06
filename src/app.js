const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const chatbotRoutes = require('./routes/chat.routes.js')
const authRoutes = require('./routes/auth.routes.js')
const botRoutes =  require('./routes/bot.routes.js')

const app = express ()

// Middlewares
app.use(express.json())
app.use(cors({
    origin: 'https://mimic-ai-neon.vercel.app',
    credentials: true
}))

app.use(cookieParser());

// AUTHENTICATION
app.use('/api/auth', authRoutes)

// CHATBOT
app.use('/api/chat', chatbotRoutes);

// BOT ROUTES
app.use('/api/bot', botRoutes)


module.exports = app