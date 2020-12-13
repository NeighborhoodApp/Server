const app = require("../app");
const { sequelize } = require("../models");
const request = require("supertest");
const { queryInterface } = sequelize;
const { Op } = require("sequelize");

let warga_token;

beforeAll(async (done) => {
  try {
    const response = await request(app).post("/users/login-client").send({
      email: "warga2@mail.com",
      password: "warga2@mail.com",
    });
    warga_token = response.body.access_token;
    done();
  } catch (err) {
    done(err);
  }
});

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete("Timelines", {
      id: {
        [Op.gt]: 2,
      },
    });
    done();
  } catch (error) {
    done();
  }
});

describe("Test Router Timeline", () => {
  let id = null;

  describe("Test endpoint POST /timeline", () => {
    it("201 Success add timeline - should create timeline", async (done) => {
      const res = await request(app)
        .post("/timeline")
        .set("access_token", warga_token)
        .send({
          description: "Test",
          image: "image.jpg",
          privacy: "public",
          UserId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(201);
      expect(body).toHaveProperty("description");
      expect(body).toHaveProperty("image");
      expect(body).toHaveProperty("privacy");
      expect(body).toHaveProperty("UserId");
      done();
    });

    it("400 Failed create - should return error if privacy is null", async (done) => {
      const res = await request(app)
        .post("/timeline")
        .set("access_token", warga_token)
        .send({
          description: "Test",
          image: "image.jpg",
          UserId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Timeline.privacy cannot be null");
      done();
    });

    it("400 Failed create - should return error if description is empty", async (done) => {
      const res = await request(app)
        .post("/timeline")
        .set("access_token", warga_token)
        .send({
          description: "",
          image: "image.jpg",
          privacy: "public",
          UserId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter timeline description");
      done();
    });

    it("400 Failed create - should return error if invalid format privacy ", async (done) => {
      const res = await request(app)
        .post("/timeline")
        .set("access_token", warga_token)
        .send({
          description: "Test",
          image: "image.jpg",
          privacy: "private",
          UserId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Privacy must be public or member");
      done();
    });
  });

  describe("Test endpoint GET /timeline", () => {
    it("200 Succes get timeline - should show timeline", async (done) => {
      const res = await request(app)
        .get("/timeline")
        .set("access_token", warga_token);
      const { body, status } = res;
      expect(status).toBe(200);
      id = body[3].id;
      done();
    });

    it("200 Succes get timeline by id - should show timeline by id", async (done) => {
      const res = await request(app)
        .get(`/timeline/${id}`)
        .set("access_token", warga_token);
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty("description", "Test");
      done();
    });

    it("404 Failed get timeline - should return error if timeline not found", async (done) => {
      const res = await request(app)
        .get("/timeline/0")
        .set("access_token", warga_token);
      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Timeline not found");
      done();
    });
  });

  describe("Test endpoint PUT /timeline", () => {
    it("200 Succes update timeline - should update timeline", async (done) => {
      const res = await request(app)
        .put(`/timeline/${id}`)
        .set("access_token", warga_token)
        .send({
          description: "Test update",
          image: "image.jpg",
          privacy: "public",
          UserId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty("description");
      expect(body).toHaveProperty("image");
      expect(body).toHaveProperty("privacy");
      expect(body).toHaveProperty("UserId");
      done();
    });

    it("400 Failed update - should return error if description is empty", async (done) => {
      const res = await request(app)
        .put(`/timeline/${id}`)
        .set("access_token", warga_token)
        .send({
          description: "",
          image: "image.jpg",
          privacy: "public",
          UserId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter timeline description");
      done();
    });

    it("404 Failed update - should return error if invalid id", async (done) => {
      const res = await request(app)
        .put(`/timeline/0`)
        .set("access_token", warga_token)
        .send({
          description: "Test update",
          image: "image.jpg",
          privacy: "public",
          UserId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Timeline not found");
      done();
    });
  });

  describe("Test endpoint DELETE /timeline", () => {
    it("200 Success delete - should delete timeline", async (done) => {
      const res = await request(app)
        .del(`/timeline/${id}`)
        .set("access_token", warga_token);
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toBe("Successful deleted timeline");
      done();
    });

    it("404 Failed delete - should delete timeline", async (done) => {
      const res = await request(app)
        .del(`/timeline/0`)
        .set("access_token", warga_token);
      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Timeline not found");
      done();
    });
  });
});
