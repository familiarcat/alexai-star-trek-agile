const request = require('supertest');
const { app } = require('../../server.js');

describe('Server API', () => {
  test('GET /api/health should return healthy status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('stack', 'Node.js + Express + Socket.IO');
  });

  test('GET /api/projects should return projects array', async () => {
    const response = await request(app).get('/api/projects');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/dashboard/stats should return stats object', async () => {
    const response = await request(app).get('/api/dashboard/stats');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('stats');
    expect(response.body.stats).toHaveProperty('total_projects');
  });
}); 