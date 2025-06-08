const request = require('supertest');
const app = require('../app/app');

describe('API tests', () => {
    it('GET /status returns status', async () => {
        const res = await request(app).get('/status');
        expect(res.statusCode).toBe(200);
    });
    it('GET /data should return sample message data', async () => {
        const res = await request(app).get('/data');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Hello world!' });
    });
});

