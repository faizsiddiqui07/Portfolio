const express = require('express')
const isAuthenticated = require('../middlewares/auth')
const { postTimeLine, deleteTimeline, getAllTimeline } = require('../controller/timelineController')

const router = express.Router()

router.post('/api/timeline/add', isAuthenticated, postTimeLine)
router.delete('/api/timeline/delete/:id', isAuthenticated, deleteTimeline)
router.get('/api/timeline/getAll', getAllTimeline)

module.exports = router 