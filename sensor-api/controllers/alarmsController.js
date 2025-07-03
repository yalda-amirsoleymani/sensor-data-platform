const pool = require('../db');

// 1. Get all alarms (latest 50)
exports.getAllAlarms = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM alarms
      ORDER BY timestamp DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to fetch alarms' });
  }
};

// 2. Get alarms by alarm type
exports.getAlarmsByType = async (req, res) => {
  const { type } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM alarms WHERE alarm_type = $1 ORDER BY timestamp DESC LIMIT 50`,
      [type]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No alarms found for this type' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to fetch alarms by type' });
  }
};

// 3. Get alarms for a specific device
exports.getAlarmsByDevice = async (req, res) => {
  const { deviceId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM alarms WHERE device_id = $1 ORDER BY timestamp DESC LIMIT 50`,
      [deviceId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No alarms found for this device' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to fetch alarms for device' });
  }
};

