const express = require('express');
const router = express.Router();
const controller = require('../controllers/readingsController');

router.get('/latest', controller.getLatestReadings);
router.get('/:id', controller.getReadingById);

module.exports = router;
