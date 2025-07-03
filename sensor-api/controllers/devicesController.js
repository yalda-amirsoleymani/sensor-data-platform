const pool = require('../db');

// 1. Get all devices (limit 50)
exports.getAllDevices = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM devices
      ORDER BY installed_at DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

// 2. Get device by ID
exports.getDeviceById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM devices WHERE device_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to fetch device' });
  }
};

