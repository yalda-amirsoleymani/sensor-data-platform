const express = require('express');
const router = express.Router();
const controller = require('../controllers/alarmsController');

router.get('/latest', controller.getAllAlarms);
router.get('/:type', controller.getAlarmsByType);
router.get('/:device', controller.getAlarmsByDevice);

module.exports = router;
