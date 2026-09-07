const botControllers = require('../controllers/bot.controller')
const authMiddleware = require('../middlewares/auth.middleware.js')
const express = require('express')
const router = express.Router()


// ROUTES
router.post('/', authMiddleware, botControllers.createBot)
router.get('/', authMiddleware, botControllers.getMyBot)
router.put('/', authMiddleware, botControllers.editBot)
router.get('/info/:slug', botControllers.getBotInfo)


module.exports = router