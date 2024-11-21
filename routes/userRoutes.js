const express = require('express')
const { register, login, logout, getUser, updateProfile, updatePassword, getUserForPortfolio, forgotPassword, resetPassword } = require('../controller/userController')
const isAuthenticated = require('../middlewares/auth')
const router = express.Router()

router.post('/api/registerUser', register)
router.post('/api/loginUser', login)
router.get('/api/logoutUser', isAuthenticated, logout)
router.get('/api/getUser', isAuthenticated, getUser)
router.put('/api/updateProfile', isAuthenticated, updateProfile)
router.put('/api/updatePassword', isAuthenticated, updatePassword)
router.get('/api/portfolio', getUserForPortfolio)
router.post('/api/password/forgot', forgotPassword)
router.put('/api/password/reset/:token', resetPassword)

module.exports = router