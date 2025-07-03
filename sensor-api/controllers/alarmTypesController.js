const pool = require('../db');

// 1. Get all alarm types
exports.getAllAlarmTypes = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM alarm_types ORDER BY alarm_type ASC`);
    res.json(result.rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to fetch alarm types' });
  }
};

// 2. Get alarm type by name (optional)
exports.getAlarmTypeByName = async (req, res) => {
  const { name } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM alarm_types WHERE alarm_type = $1`, [name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alarm type not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to fetch alarm type' });
  }
};

