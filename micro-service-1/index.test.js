const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('./index');

jest.mock('bcrypt');

describe('Node App', () => {
  describe('GET /test-service-1', () => {
    it('should return "Hello, World! Service 1"', async () => {
      const response = await request(app).get('/test-service-1');
      expect(response.status).toBe(200);
      expect(response.text).toBe('Hello, World! Service 1');
    });
  });

  describe('POST /register', () => {
    it('should store registration data in Firestore', async () => {
      const mockHash = 'hashedPassword';
      bcrypt.hash.mockResolvedValue(mockHash);

      const response = await request(app)
        .post('/register')
        .send({
          name: 'John Doe',
          password: 'password',
          email: 'johndoe@example.com',
          location: 'New York',
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe('Registration data stored in Firestore');
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    });

    it('should handle errors and send a 500 status', async () => {
      bcrypt.hash.mockRejectedValue(new Error('Hashing error'));

      const response = await request(app)
        .post('/register')
        .send({
          name: 'John Doe',
          password: 'password',
          email: 'johndoe@example.com',
          location: 'New York',
        });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Failed to store registration data in Firestore');
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    });
  });
});
