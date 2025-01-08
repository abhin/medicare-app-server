import request from "supertest";
import server from "../server.js";
import db from "../db.js";
import Users from "../models/users.js";
import { ROUTE_BASE } from "../utils/config.js";
import mongoose from "mongoose";
import { generateAccessToken } from "../utils/accessToken.js";

const PORT = process.env.PORT_TEST || 8081;
let userId;
const apiPath = `${ROUTE_BASE}/user`;

beforeAll(async () => {
  await db;
  server.listen(PORT, () => {
    console.log(
      `DB connection is success. Server is listening on port: ${PORT}`
    );
  });
});

afterAll(async () => {
  await Users.deleteMany({});
  await mongoose.connection.close();
});

describe("User API", () => {
  it("should create a new user", async () => {
    const res = await request(server).post(`${apiPath}/create`).send({
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
    userId = res.body.user._id;
  });

  it("should signup a new user", async () => {
    const res = await request(server).post(`${apiPath}/signup`).send({
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
    const res = await request(server).post(`${apiPath}/create`).send({
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
    const res = await request(server).get(`${apiPath}/read/${user._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("email", "alice@example.com");
  });

  it("should return 404 for a non-existing user ID", async () => {
    const res = await request(server).get(
      `${apiPath}/read/67641ada8b12446392fcdf5e`
    );
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "User does not exist with the provided ID."
    );
  });

  it("should check invalid Mongo User ID", async () => {
    const res = await request(server).get(
      `${apiPath}/read/67641ada8b12446392fcdf5eXXX`
    );
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "Error while checking user existence."
    );
  });

  it("should update a user", async () => {
    const user = await Users.create({
      name: "Bob",
      email: "bob@example.com",
      password: "password123",
    });

    const token = generateAccessToken({accessKey: user._id });

    const res = await request(server)
      .put(`${apiPath}/update`)
      .set("authorization", token)
      .send({
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

    const token = generateAccessToken({accessKey: userId });
    const res = await request(server)
      .delete(`${apiPath}/delete/${user._id}`)
      .set("authorization", token);
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
    console.log("user._id", user._id);
    const token = generateAccessToken({accessKey: user._id });
    const res = await request(server).get(`${apiPath}/activate/${token}`);
    console.log(res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", true);
    expect(res.body).toHaveProperty(
      "message",
      "Account activated successfully."
    );
  });

  it("Try activate a user who is already active", async () => {
    const user = await Users.create({
      name: "Ghih",
      email: "sfd@example.com",
      password: "password123",
      status: true,
    });
    console.log("user._id", user._id);
    const token = generateAccessToken({accessKey: user._id });
    const res = await request(server).get(`${apiPath}/activate/${token}`);
    console.log(res.body);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "Account is already activated."
    );
  });
});
