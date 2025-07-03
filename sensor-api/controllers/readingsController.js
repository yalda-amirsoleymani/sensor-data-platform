const pool = require('../db');

// Get the latest 15 readings
exports.getLatestReadings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM sensor_readings
      ORDER BY timestamp DESC
      LIMIT 15
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No sensor data found' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// Get reading by ID (reading_id, not device_id)
exports.getReadingById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM sensor_readings WHERE reading_id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor reading not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

