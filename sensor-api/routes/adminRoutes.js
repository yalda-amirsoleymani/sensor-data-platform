const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

// Example protected route
router.get('/dashboard', authenticate, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}`, role: req.user.role });
});

module.exports = router;

