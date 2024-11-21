const express = require('express')
const { sendMessage, getAllMessage, deleteMessage } = require('../controller/messageController')
const isAuthenticated = require('../middlewares/auth')

const router = express.Router()

router.post('/api/message/send', sendMessage)
router.get('/api/message/getAllMessage', getAllMessage)
router.delete('/api/message/delete/:id', isAuthenticated, deleteMessage)

module.exports = router