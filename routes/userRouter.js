const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')


router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.get('/logout', userCtrl.logout)
router.post('/refresh_token', userCtrl.refreshtoken)
router.get('/infor', auth,userCtrl.getUser)

module.exports = router