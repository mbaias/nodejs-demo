const express = require('express');
const UsersController = require('../controllers/users');

const router = express.Router();

router.post('/signup', UsersController.userSignUp);

router.post('/signin', UsersController.userSignIn);

module.exports = router;
