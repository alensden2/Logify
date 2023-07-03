const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("./app");

// Mocking Firestore database
jest.mock("@google-cloud/firestore");
const { Firestore } = require("@google-cloud/firestore");
const mockFirestore = new Firestore();
mockFirestore.collection.mockReturnValue(mockFirestore);

// Utility function mock
jest.mock("./app", () => ({
  updateUserState: jest.fn(),
}));

describe("Test endpoints", () => {
  it("GET /test-service-2 should return 'Hello, from service 2'", async () => {
    const response = await request(app).get("/test-service-2");
    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, from service 2");
  });

  it("POST /login should return 'Login Success!' for valid credentials", async () => {
    // Mock Firestore data
    const mockData = {
      docs: [
        {
          data: () => ({
            Email: "test@example.com",
            Password: await bcrypt.hash("password123", 10), // Hashing the password for the mock user
          }),
        },
      ],
    };

    // Mock Firestore collection
    mockFirestore.where.mockReturnValue(mockData);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(response.status).toBe(200);
    expect(response.text).toBe("Login Success!");
    expect(app.updateUserState).toHaveBeenCalledWith(
      "test@example.com",
      "online"
    );
  });

  it("POST /login should return 'Invalid credentials' for invalid email", async () => {
    // Mock Firestore data with empty result (no user found)
    const mockData = {
      empty: true,
    };

    // Mock Firestore collection
    mockFirestore.where.mockReturnValue(mockData);

    const response = await request(app)
      .post("/login")
      .send({ email: "invalid@example.com", password: "password123" });
    expect(response.status).toBe(401);
    expect(response.text).toBe("Invalid credentials");
    expect(app.updateUserState).not.toHaveBeenCalled();
  });

  it("POST /login should return 'Invalid credentials' for invalid password", async () => {
    // Mock Firestore data with a user but invalid password
    const mockData = {
      docs: [
        {
          data: () => ({
            Email: "test@example.com",
            Password: await bcrypt.hash("password123", 10),
          }),
        },
      ],
    };

    // Mock Firestore collection
    mockFirestore.where.mockReturnValue(mockData);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongpassword" });
    expect(response.status).toBe(401);
    expect(response.text).toBe("Invalid credentials");
    expect(app.updateUserState).not.toHaveBeenCalled();
  });

  it("POST /login should return 'Login Failed' when an error occurs", async () => {
    // Mock Firestore collection throwing an error
    mockFirestore.where.mockRejectedValue(new Error("Mock error"));

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(response.status).toBe(500);
    expect(response.text).toBe("Login Failed");
    expect(app.updateUserState).not.toHaveBeenCalled();
  });
});
