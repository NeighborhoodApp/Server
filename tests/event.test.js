const app = require("../app");
const { sequelize } = require("../models");
const request = require("supertest");
const { queryInterface } = sequelize;
const { beforeAll, it, expect } = require("@jest/globals");

let warga_token, warga2_token, owner_token;

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
    const respon = await request(app).post("/users/login-cms").send({
      email: "admin@mail.com",
      password: "tetonggo5",
    });
    warga_token = response.body.access_token;
    warga2_token = res.body.access_token;
    owner_token = respon.body.access_token;
    done();
  } catch (err) {
    done(err);
  }
});

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete("Events", {});
    done();
  } catch (error) {
    done();
  }
});

describe("Test Router Event", () => {
  let id = null;
  describe("Test endpoint POST /event", () => {
    it('404 Failed get event - should return not found', async (done) => {
      const res = await request(app)
        .get('/event')
        .set('access_token', warga_token)
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Event not found')
      done()
    })

    it("201 Success add event - should create event", async (done) => {
      const res = await request(app)
        .post("/event")
        .set("access_token", warga_token)
        .send({
          name: "Test event pengajian",
          description: "Test",
          image: "/image",
          date: "2020-12-30",
          CategoryId: 1,
          RealEstateId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(201);
      expect(body).toHaveProperty("name");
      expect(body).toHaveProperty("description");
      expect(body).toHaveProperty("image");
      expect(body).toHaveProperty("date");
      expect(body).toHaveProperty("CategoryId");
      expect(body).toHaveProperty("UserId");
      expect(body).toHaveProperty("RealEstateId");
      done();
    });

    it("400 Failed create - should return error if category is null", async (done) => {
      const res = await request(app)
        .post("/event")
        .set("access_token", warga_token)
        .send({
          name: "Test event pengajian",
          description: "Test",
          image: "/image",
          date: "2020-12-30",
          RealEstateId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Event.CategoryId cannot be null");
      done();
    });

    it("400 Failed create - should return error if name is empty", async (done) => {
      const res = await request(app)
        .post("/event")
        .set("access_token", warga_token)
        .send({
          name: "",
          description: "Test",
          image: "/image",
          date: "2020-12-30",
          CategoryId: 1,
          RealEstateId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter event name");
      done();
    });

    it("400 Failed create - should return error if date has passed", async (done) => {
      const res = await request(app)
        .post("/event")
        .set("access_token", warga_token)
        .send({
          name: "Test event pengajian",
          description: "Test",
          image: "/image",
          date: "2020-12-10",
          CategoryId: 1,
          RealEstateId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Date must be greater than today");
      done();
    });

    it("400 Failed create - should return error if date invalid format", async (done) => {
      const res = await request(app)
        .post("/event")
        .set("access_token", warga_token)
        .send({
          name: "Test event pengajian",
          description: "Test",
          image: "/image",
          date: "2020-13-10",
          CategoryId: 1,
          RealEstateId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter valid date");
      done();
    });

    it("400 Failed create - should return error if real estate is empty", async (done) => {
      const res = await request(app)
        .post("/event")
        .set("access_token", warga_token)
        .send({
          name: "Test event pengajian",
          description: "Test",
          image: "/image",
          date: "2020-12-30",
          CategoryId: 1,
          RealEstateId: "",
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty(
        "msg",
        "Pleasse select your real estate, Please enter valid real estate"
      );
      done();
    });

    it("401 Failed create - should return error if owner created", async (done) => {
      const res = await request(app)
        .post("/event")
        .set("access_token", owner_token)
        .send({
          name: "Test event pengajian",
          description: "Test",
          image: "/image",
          date: "2020-12-30",
          CategoryId: 1,
          RealEstateId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(401);
      expect(body).toHaveProperty(
        "msg",
        "Authentication failed"
      );
      done();
    });
  });

  describe("Test endpoint GET /event", () => {
    it("200 Succes get event - should show event", async (done) => {
      const res = await request(app)
        .get("/event")
        .set("access_token", warga_token);

      const { body, status } = res;
      expect(status).toBe(200);
      id = body[0].id;
      done();
    });

    it("200 Succes get event by id - should show event by id", async (done) => {
      const res = await request(app)
        .get(`/event/${id}`)
        .set("access_token", warga_token);

      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty("description", "Test");
      done();
    });

    it("404 Failed get event - should return error if event not found", async (done) => {
      const res = await request(app)
        .get("/event/0")
        .set("access_token", warga_token);

      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Event not found");
      done();
    });

    it("401 Failed get event - should return error if no logged in user", async (done) => {
      const res = await request(app)
        .get("/event")

      const { body, status } = res;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    });
  });

  describe("Test endpoint PUT /event", () => {
    it("200 Succes update event - should update event", async (done) => {
      const res = await request(app)
        .put(`/event/${id}`)
        .set("access_token", warga_token)
        .send({
          name: "Test update event pengajian",
          description: "Test",
          image: "/image",
          date: "2020-12-30",
          CategoryId: 1,
          RealEstateId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty("name");
      expect(body).toHaveProperty("description");
      expect(body).toHaveProperty("image");
      expect(body).toHaveProperty("date");
      expect(body).toHaveProperty("CategoryId");
      expect(body).toHaveProperty("UserId");
      expect(body).toHaveProperty("RealEstateId");
      done();
    });

    it("400 Failed update - should return error if name is empty", async (done) => {
      const res = await request(app)
        .put(`/event/${id}`)
        .set("access_token", warga_token)
        .send({
          name: "",
          description: "Test",
          image: "/image",
          date: "2020-12-30",
          CategoryId: 1,
          RealEstateId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter event name");
      done();
    });

    it("404 Failed update - should return error if invalid id", async (done) => {
      const res = await request(app)
        .put(`/event/0`)
        .set("access_token", warga_token)
        .send({
          name: "Test",
          description: "Test",
          image: "/image",
          date: "2020-12-30",
          CategoryId: 1,
          RealEstateId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Event not found");
      done();
    });

    it("401 Failed update - should return error if not authorized", async (done) => {
      const res = await request(app)
        .put(`/event/${id}`)
        .set("access_token", warga2_token)
        .send({
          name: "Test",
          description: "Test",
          image: "/image",
          date: "2020-12-30",
          CategoryId: 1,
          RealEstateId: 1,
        });
      const { body, status } = res;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Not authorized");
      done();
    });
  });

  describe("Test endpoint DELETE /event", () => {
    it("200 Success delete - should delete event", async (done) => {
      const res = await request(app)
        .del(`/event/${id}`)
        .set("access_token", warga_token);
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toBe("Successful deleted event");
      done();
    });

    it("404 Failed delete - should return error if not found", async (done) => {
      const res = await request(app)
        .del(`/event/0`)
        .set("access_token", warga_token);

      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Event not found");
      done();
    });
  });
});
