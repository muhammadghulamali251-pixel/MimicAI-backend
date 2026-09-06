const mongoose = require('mongoose')

const botSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    botName: { type: String, required: true },
    systemPrompt: { type: String, required: true }, 
    slug: { type: String, required: true, unique: true },
    model: { type: String, default: 'openai/gpt-4o-mini' },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  })

const botModel = mongoose.model ("bot", botSchema) 
module.exports = botModel 