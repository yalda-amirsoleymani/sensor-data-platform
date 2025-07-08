// tests/routes/alarmsRoutes.test.js

// 1) Mock the entire alarmsController module **before** importing app
jest.mock('../../controllers/alarmsController', () => ({
  getAllAlarms:    (req, res) => res.status(200).json(['alarm1', 'alarm2']),
  getAlarmsByType: (req, res) => res.status(200).json(['typeAlarm']),
  getAlarmsByDevice: (req, res) => res.status(404).json({ error: 'No alarms found' }),
}));

const request = require('supertest');
const app     = require('../../index');  // your Express app

describe('Alarms Routes (mocked controller)', () => {
  it('GET /api/alarms/latest → should return latest alarms', async () => {
    const res = await request(app).get('/api/alarms/latest');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(['alarm1', 'alarm2']);
  });

  it('GET /api/alarms/type/temperature → should return alarms by type', async () => {
    const res = await request(app).get('/api/alarms/type/temperature');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(['typeAlarm']);
  });

  it('GET /api/alarms/device/device123 → should return alarms by device', async () => {
    const res = await request(app).get('/api/alarms/device/device123');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'No alarms found');
  });
});

