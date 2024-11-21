const express = require('express')
const isAuthenticated = require('../middlewares/auth')
const { addNewApplication, deleteApplication, getAllApplication } = require('../controller/softwareApplicationController')

const router = express.Router()

router.post('/api/softwareApplication/add',isAuthenticated, addNewApplication )
router.delete('/api/softwareApplication/delete/:id', isAuthenticated, deleteApplication)
router.get('/api/softwareApplication/getAll', getAllApplication)

module.exports = router