const request = require('supertest');
const app = require('../../index');

describe('Alarms API', () => {
  it('GET /api/alarms/latest → returns alarms', async () => {
    const res = await request(app).get('/api/alarms/latest');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/alarms/type/temperature → returns alarms by type', async () => {
    const res = await request(app).get('/api/alarms/type/temperature');
    if (res.status === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    } else {
      expect(res.status).toBe(404); // if no results
    }
  });
});

