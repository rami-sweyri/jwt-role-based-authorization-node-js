const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

const isAuth = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const isWriter = require('../middleware/writer');

router.get('/me', [isAuth, isAdmin, isWriter], authController.me);

router.get('/:userId',  authController.userId);


router.post('/signup', authController.signup);


router.post('/login', authController.login);



module.exports = router; 
