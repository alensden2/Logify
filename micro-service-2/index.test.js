const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

// Test Endpoint
app.get('/test-service-2', (req, res) => {
  return res.send("Hello, from service 2");
});

describe('Test Service 2 Endpoint', () => {
  it('should return "Hello, from service 2"', async () => {
    const response = await request(app)
      .get('/test-service-2');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, from service 2');
  });
});

// Mock user data
const user = {
  email: 'johndoe@example.com',
  password: bcrypt.hashSync('password123', 10),
};

// Test Endpoint
app.post('/login', async (req, res) => {
  try {
    // Retrieve the user info using the provided email
    if (req.body.email !== user.email) {
      // User is not present in the DB
      console.log('401 Invalid credentials');
      return res.status(500).send('Invalid credentials');
    }

    // Validating Password
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      // Invalid password
      console.log('401 Invalid Credentials');
      return res.status(500).send('Invalid credentials');
    }
    console.log('Login Success');

    // Successful login
    res.status(200).send('Login success');
  } catch (error) {
    console.error('500 Internal Server Error');
    res.status(500).send('Internal Server Error');
  }
});

describe('Test Login Endpoint', () => {
  it('should return "Login success" for valid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Login success');
  });

  it('should return "Invalid credentials" for an unknown email', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'unknown@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Invalid credentials');
  });

  it('should return "Invalid credentials" for an incorrect password', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password456',
      });

    expect(response.status).toBe(401);
    expect(response.text).toBe('Invalid credentials');
  });

  it('should return "Internal Server Error" if an error occurs', async () => {
    // Simulate an error during password comparison
    jest.spyOn(bcrypt, 'compare').mockRejectedValue(new Error('Password comparison error'));

    const response = await request(app)
      .post('/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Internal Server Error');
  });
});

module.exports = app;
