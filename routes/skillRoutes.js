const express = require('express')
const isAuthenticated = require('../middlewares/auth')
const { addNewSkill, deleteSkill, updateSkill, getAllSkill } = require('../controller/skillController')

const router = express.Router()

router.post('/api/skill/add', isAuthenticated, addNewSkill )
router.delete('/api/skill/delete/:id', isAuthenticated, deleteSkill)
router.put('/api/skill/update/:id', isAuthenticated, updateSkill)
router.get('/api/skill/getAll', getAllSkill)

module.exports = router