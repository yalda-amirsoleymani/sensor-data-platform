const express = require('express');
const router = express.Router();
const controller = require('../controllers/locationsController');

router.get('/all', controller.getLatestLocations);
router.get('/:id', controller.getLocationById);

module.exports = router;
