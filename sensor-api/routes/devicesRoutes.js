const express = require('express');
const router = express.Router();
const controller = require('../controllers/devicesController');

router.get('/all', controller.getAllDevices);
router.get('/:id', controller.getDeviceById);

module.exports = router;
