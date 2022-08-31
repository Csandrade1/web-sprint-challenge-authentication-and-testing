// Write your tests here
const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");
const bcrypt = require("bcryptjs/dist/bcrypt");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

test("[0] sanity check", () => {
  expect(true).not.toBe(false);
});

describe("server.js", () => {
  describe("[POST] /api/auth/register", () => {
    it("[1] posting to register creates a new user in database", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "Cynthia", password: "1234" });
      const cynthia = await db("users").where("username", "Cynthia").first();
      expect(cynthia).toMatchObject({ username: "Cynthia" });
    }, 750);
    it("[2] saves user with bcrypted password", async () => {
      await request(server)
        .post("/api/auth/register")
        .send({ username: "Silvia", password: "1234" });
      const silvia = await db("users").where("username", "Silvia").first();
      expect(bcrypt.compareSync("1234", silvia.password)).toBeTruthy();
    }, 750);
    it("[3] responds with proper status on successful registration", async () => {
      const res = await request(server)
        .post("/api/auth/register")
        .send({ username: "Marco", password: "hello123" });
      expect(res.status).toBe(201);
    }, 750);
  });
  describe("[GET] /api/jokes", () => {
    it("[4] requests without token bounce with proper status and message", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.body.message).toMatch(/token required/i);
    }, 750);
    it("[5] requests with invalid token bounced with appropriate message", async () => {
      const res = await request(server)
        .get("/api/jokes")
        .set("Authorization", "someText");
      expect(res.body.message).toMatch(/token invalid/i);
    }, 750);
  });
  describe("[POST] /api/auth/login", () => {
    it("[6] correct status on valid credentials", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "Valentina", password: "1234" });
      expect(res.status).toBe(401);
    }, 750);
    it("[7] correct message on invalid login", async () => {
      let res = await request(server)
        .post("/api/auth/login")
        .send({ username: "Andrew", password: "1234" });
      expect(res.body.message).toMatch(/invalid credentials/i);
    }, 750);
  });
});
