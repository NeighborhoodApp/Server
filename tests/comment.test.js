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
    await queryInterface.bulkDelete("Comments", {
      id: {
        [Op.gt]: 1,
      },
    });
    done();
  } catch (error) {
    done();
  }
});

describe("Test Router Comment", () => {
  let id = null;

  describe("Test endpoint POST /comment", () => {
    it("201 Success add comment - should create comment", async (done) => {
      const res = await request(app)
        .post("/comment")
        .set("access_token", warga_token)
        .send({
          comment: "Test",
          UserId: 1,
          TimelineId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(201);
      expect(body).toHaveProperty("comment");
      expect(body).toHaveProperty("UserId");
      expect(body).toHaveProperty("TimelineId");
      done();
    });

    it("400 Failed create - should return error if timeline is null", async (done) => {
      const res = await request(app)
        .post("/comment")
        .set("access_token", warga_token)
        .send({
          comment: "Test",
          UserId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Comment.TimelineId cannot be null");
      done();
    });

    it("400 Failed create - should return error if comment is empty", async (done) => {
      const res = await request(app)
        .post("/comment")
        .set("access_token", warga_token)
        .send({
          comment: "",
          UserId: 1,
          TimelineId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter your comment");
      done();
    });
  });

  describe("Test endpoint GET /comment", () => {
    it("200 Success get comment - should show comment", async (done) => {
      const res = await request(app)
        .get("/comment")
        .set("access_token", warga_token);
      const { body, status } = res;
      expect(status).toBe(200);
      id = body[1].id;
      done();
    });

    it("200 Success get comment by id - should show comment by id", async (done) => {
      const res = await request(app)
        .get(`/comment/${id}`)
        .set("access_token", warga_token);
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty("comment", "Test");
      done();
    });

    it("404 Failed get comment - should return error if comment not found", async (done) => {
      const res = await request(app)
        .get("/comment/0")
        .set("access_token", warga_token);

      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Comment not found");
      done();
    });
  });

  describe("Test endpoint PUT /comment", () => {
    it("200 Success update comment - should update comment", async (done) => {
      const res = await request(app)
        .put(`/comment/${id}`)
        .set("access_token", warga_token)
        .send({
          comment: "Test update",
          UserId: 1,
          TimelineId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty("comment");
      expect(body).toHaveProperty("UserId");
      expect(body).toHaveProperty("TimelineId");
      done();
    });

    it("400 Failed update - should return error if comment is empty", async (done) => {
      const res = await request(app)
        .put(`/comment/${id}`)
        .set("access_token", warga_token)
        .send({
          comment: "",
          UserId: 1,
          TimelineId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter your comment");
      done();
    });

    it("404 Failed update - should return error if invalid id", async (done) => {
      const res = await request(app)
        .put(`/comment/0`)
        .set("access_token", warga_token)
        .send({
          comment: "Test update",
          UserId: 1,
          TimelineId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Comment not found");
      done();
    });
  });

  describe("Test endpoint DELETE /comment", () => {
    it("200 Success delete - should delete comment", async (done) => {
      const res = await request(app)
        .del(`/comment/${id}`)
        .set("access_token", warga_token);
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toBe("Successful deleted comment");
      done();
    });

    it("404 Failed delete - should delete comment", async (done) => {
      const res = await request(app)
        .del(`/comment/0`)
        .set("access_token", warga_token);

      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Comment not found");
      done();
    });
  });
});
