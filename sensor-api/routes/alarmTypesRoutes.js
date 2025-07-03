const express = require('express');
const router = express.Router();
const controller = require('../controllers/alarmTypesController');

router.get('/all', controller.getAllAlarmTypes);
router.get('/:type', controller.getAlarmTypeByName);

module.exports = router;
