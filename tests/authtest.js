import request from 'supertest';
import app from '../app.js'; // Adjust the path as necessary
import mongoose from 'mongoose';
import Users from '../models/users.js';

beforeAll(async () => {
  // Connect to the test database
  const url = `mongodb://127.0.0.1/mern-app-test`;
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  // Clean up the database and close the connection
  await Users.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('email', 'john.doe@example.com');
  });

  it('should login an existing user', async () => {
    await Users.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    });
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'Invalid credentials.');
  });

  it('should not login with non-existing email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'non.existing@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('message', 'User not found.');
  });
});
