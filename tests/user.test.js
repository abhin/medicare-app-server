import request from "supertest";
import server from "../server.js";
import db from "../db.js";
import Users from "../models/users.js";
import { ROUTE_BASE } from "../utils/config.js";
import mongoose from "mongoose";

const PORT = process.env.PORT_TEST || 8081;

beforeAll(async () => {
  await db;
  server.listen(PORT, () => {
    console.log(`DB connection is success. Server is listening on port: ${PORT}`);
  });
});

afterAll(async () => {
  await Users.deleteMany({});
  await mongoose.connection.close();
});

describe("User API", () => {
  it("should create a new user", async () => {
    const res = await request(server).post(`${ROUTE_BASE}/create`).send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Account created successfully. Please check your email for activation."
    );
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "john.doe@example.com");
  });

  it("should signup a new user", async () => {
    const res = await request(server).post(`${ROUTE_BASE}/signup`).send({
      name: "John Doe",
      email: "john.doe1@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Account created successfully. Please check your email for activation."
    );
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "john.doe1@example.com");
  });

  it("should not create a user with an existing email", async () => {
    const res = await request(server).post(`${ROUTE_BASE}/create`).send({
      name: "Jane Doe",
      email: "john.doe@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "User already exists with this email."
    );
  });

  it("should get a user by ID", async () => {
    const user = await Users.create({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
    });
    const res = await request(server).get(`${ROUTE_BASE}/read/${user._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "alice@example.com");
  });

  it("should return 404 for a non-existing user ID", async () => {
    const res = await request(server).get(
      `${ROUTE_BASE}/read/60c72b2f9b1d8b3a2c8e4d2b`
    );
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "User does not exist with the provided ID.");
  });

  it("should check valid User ID", async () => {
    const res = await request(server).get(
      `${ROUTE_BASE}/read/shsd`
    );
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("message", "Invalid ID.");
  });

  it("should update a user", async () => {
    const user = await Users.create({
      name: "Bob",
      email: "bob@example.com",
      password: "password123",
    });
    const res = await request(server).put(`${ROUTE_BASE}/update`).send({
      name: "Bob Updated",
      email: "bob.updated@example.com",
      status: true,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("message", "Users updated successfully.");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "bob.updated@example.com");
  });

  it("should delete a user", async () => {
    const user = await Users.create({
      name: "Charlie",
      email: "charlie@example.com",
      password: "password123",
    });
    const res = await request(server).delete(`${ROUTE_BASE}/delete/${user._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      `Users deleted successfully. ID: ${user._id}`
    );
  });

  it("should activate a user", async () => {
    const user = await Users.create({
      name: "Dave",
      email: "dave@example.com",
      password: "password123",
      status: false,
    });
    const res = await request(server).get(`${ROUTE_BASE}/activate/${user._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Account activated successfully."
    );
  });
});
