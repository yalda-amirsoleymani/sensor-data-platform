const pool = require('../db');

exports.getLatestLocations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM locations
      ORDER BY location_id DESC
      LIMIT 15
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

exports.getLocationById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM locations WHERE location_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

