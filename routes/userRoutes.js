const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch('/resetPassword', authController.resetPassword);

// Protect all routes after this middleware
// router.use(authController.protect);

//////////ADMIN
router.use(authController.restrictTo('admin'));

module.exports = router;
