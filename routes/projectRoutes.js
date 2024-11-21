const express = require('express')
const isAuthenticated = require('../middlewares/auth')
const { addNewProject, deleteProject, updateProject, getAllProject, getSingleProject } = require('../controller/projectController')

const router = express.Router()

router.post('/api/project/add', isAuthenticated, addNewProject )
router.put('/api/project/update/:id', isAuthenticated, updateProject)
router.delete('/api/project/delete/:id', isAuthenticated, deleteProject)
router.get('/api/project/getAll', getAllProject)
router.get('/api/project/getSingle/:id', getSingleProject)

module.exports = router