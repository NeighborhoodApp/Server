const app = require("../app");
const { sequelize } = require("../models");
const request = require("supertest");
const { queryInterface } = sequelize;

let warga_token = {};
let warga2_token

beforeAll(async (done) => {
  try {
    const response = await request(app).post("/users/login-client").send({
      email: "warga2@mail.com",
      password: "warga2@mail.com",
    });
    const res = await request(app).post("/users/login-client").send({
      email: "warga1@mail.com",
      password: "warga1@mail.com",
    });

    warga_token.access_token = response.body.access_token;
    warga_token.coordinate = response.body.coordinate;
    warga2_token = res.body.access_token;

    await request(app)
      .post("/timeline")
      .set({access_token: warga_token.access_token})
      .send({
        description: "Test",
        image: "",
        privacy: "public",
      });
    done();
  } catch (err) {
    done(err);
  }
});

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete("Comments", {});
    await queryInterface.bulkDelete("Timelines", {});
    done();
  } catch (error) {
    done();
  }
});

describe("Test Router Comment", () => {
  let id = null;
  let timelineId = null

  it("200 Succes get timeline - should show timeline", async (done) => {
    const res = await request(app)
      .get("/timeline")
      .set({
        access_token: warga_token.access_token,
        coordinate: warga_token.coordinate
      })
    const { body, status } = res;
    console.log(body)
    expect(status).toBe(200);
    timelineId = body[0].id;
    done();
  });

  describe("Test endpoint POST /comment", () => {
    it('404 Failed get comment - should return not found', async (done) => {
      const res = await request(app)
        .get('/comment')
        .set({access_token: warga_token.access_token})
      const { body, status } = res
      console.log(body)
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Comment not found')
      done()
    })

    it("201 Success add comment - should create comment", async (done) => {
      const res = await request(app)
        .post(`/comment/${timelineId}`)
        .set({access_token: warga_token.access_token})
        .send({
          comment: "Test",
        });
      const { body, status } = res;
      expect(status).toBe(201);
      expect(body).toHaveProperty("comment");
      expect(body).toHaveProperty("UserId");
      expect(body).toHaveProperty("TimelineId");
      done();
    });

    it("401 Failed create - should return error if no logged in user", async (done) => {
      const res = await request(app)
        .post(`/comment/${timelineId}`)
        .send({
          comment: "Test",
        });
      const { body, status } = res;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", 'Authentication failed');
      done();
    });

    it("400 Failed create - should return error if timeline invalid format", async (done) => {
      const res = await request(app)
        .post("/comment/s")
        .set({access_token: warga_token.access_token})
        .send({
          comment: "Test",
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter valid timeline");
      done();
    });

    it("400 Failed create - should return error if comment is empty", async (done) => {
      const res = await request(app)
        .post(`/comment/${timelineId}`)
        .set({access_token: warga_token.access_token})
        .send({
          comment: "",
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
        .set({access_token: warga_token.access_token});
      const { body, status } = res;
      expect(status).toBe(200);
      id = body[0].id;
      done();
    });

    it("200 Success get comment by id - should show comment by id", async (done) => {
      const res = await request(app)
        .get(`/comment/${timelineId}/${id}`)
        .set({access_token: warga_token.access_token});
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty("comment", "Test");
      done();
    });

    it("404 Failed get comment - should return error if comment not found", async (done) => {
      const res = await request(app)
        .get(`/comment/${timelineId}/0`)
        .set({access_token: warga_token.access_token});

      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Comment not found");
      done();
    });
  });

  describe("Test endpoint PATCH /comment", () => {
    it("200 Success update comment - should update comment", async (done) => {
      const res = await request(app)
        .patch(`/comment/${timelineId}/${id}`)
        .set({access_token: warga_token.access_token})
        .send({
          comment: "Test update",
        });
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty("comment");
      expect(body).toHaveProperty("UserId");
      expect(body).toHaveProperty("TimelineId");
      done();
    });

    it("401 Failed update comment - should return error if not authorized", async (done) => {
      const res = await request(app)
        .patch(`/comment/${timelineId}/${id}`)
        .set({access_token: warga2_token})
        .send({
          comment: "Test update",
        });
      const { body, status } = res;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", 'Not authorized');
      done();
    });

    it("400 Failed update - should return error if comment is empty", async (done) => {
      const res = await request(app)
        .patch(`/comment/${timelineId}/${id}`)
        .set({access_token: warga_token.access_token})
        .send({
          comment: "",
        });
      const { body, status } = res;
      console.log(body)
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter your comment");
      done();
    });

    it("404 Failed update - should return error if invalid id", async (done) => {
      const res = await request(app)
        .patch(`/comment/${timelineId}/0`)
        .set({access_token: warga_token.access_token})
        .send({
          comment: "Test update",
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
        .del(`/comment/${timelineId}/${id}`)
        .set({access_token: warga_token.access_token});
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toBe("Successful deleted comment");
      done();
    });

    it("404 Failed delete - should return error if not found", async (done) => {
      const res = await request(app)
        .del(`/comment/${timelineId}/0`)
        .set({access_token: warga_token.access_token});

      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Comment not found");
      done();
    });
  });
});
