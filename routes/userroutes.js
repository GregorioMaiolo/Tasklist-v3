const express = require('express');
const router = express.Router();

const userController = require('../controller/user-controller');

router.get('/registrieren', userController.getRegistration);
router.post('/registrieren', userController.registerUser);

module.exports = router;
