const express = require('express');
const router = express.Router();

const userController = require('../controller/user-controller');

router.get('/registrieren', userController.getRegistration);
router.post('/registrieren', userController.registerUser);
router.get('/benutzer', userController.getUsers);
router.post('/benutzer/:id/rolle', userController.updateRole);

module.exports = router;
