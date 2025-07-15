const express = require('express');
const router = express.Router();
const authController = require('../controllers/loginController');

router.post('/', authController.login);

module.exports = router;

