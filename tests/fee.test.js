const app = require("../app");
const { sequelize } = require("../models");
const request = require("supertest");
const { queryInterface } = sequelize;

let warga_token = {};
let admin_token = {};
let admin2_token = {};

beforeAll(async (done) => {
  try {
    const response = await request(app).post("/users/login-client").send({
      email: "warga2@mail.com",
      password: "warga2@mail.com",
    });
    const res = await request(app).post("/users/login-client").send({
      email: "admin1@mail.com",
      password: "admin1@mail.com",
    });
    const respon = await request(app).post("/users/login-client").send({
      email: "admin3@mail.com",
      password: "admin3@mail.com",
    });

    warga_token.access_token = response.body.access_token;
    // warga_token.RealEstateId = response.body.RealEstateId;
    // warga_token.ComplexId = response.body.ComplexId;

    admin_token.access_token = res.body.access_token;
    // admin_token.RealEstateId = res.body.RealEstateId;
    // admin_token.ComplexId = res.body.ComplexId;

    admin2_token.access_token = respon.body.access_token;
    // admin2_token.RealEstateId = respon.body.RealEstateId;
    // admin2_token.ComplexId = respon.body.ComplexId;

    done();
  } catch (err) {
    done(err);
  }
});

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete("Fees", {});
    done();
  } catch (error) {
    done();
  }
});

describe("Test Router Fee", () => {
  let id;

  describe("Test endpoint POST /fee", () => {
    it('404 Failed get fee - should return not found', async (done) => {
      const res = await request(app)
        .get('/fee')
        .set({
          access_token: admin_token.access_token
        })
      const { body, status } = res
      expect(status).toBe(404)
      expect(body).toHaveProperty('msg', 'Fee not found')
      done()
    })

    it("201 Success add fee - should create fee", async (done) => {
      const res = await request(app)
        .post("/fee")
        .set({
          access_token: admin_token.access_token,
        })
        .send({
          name: "Test fee pengajian",
          description: "Test",
          RealEstateId: 1,
          ComplexId: 1,
          due_date: "2020-12-30",
          RealEstateId: admin_token.RealEstateId,
          ComplexId: admin_token.ComplexId
        });
      const { body, status } = res;
      expect(status).toBe(201);
      expect(body).toHaveProperty("name");
      expect(body).toHaveProperty("description");
      expect(body).toHaveProperty("due_date");
      expect(body).toHaveProperty("RealEstateId");
      expect(body).toHaveProperty("ComplexId");
      done();
    });

    it("401 Failed create - should return error if logged in as warga", async (done) => {
      const res = await request(app)
        .post("/fee")
        .set({
          access_token: warga_token.access_token,

        })
        .send({
          name: "Test fee pengajian",
          description: "Test",
          RealEstateId: 1,
          ComplexId: 1,
          due_date: "2020-12-30",
          RealEstateId: warga_token.RealEstateId,
          ComplexId: warga_token.ComplexId
        });
      const { body, status } = res;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Not authorized");
      done();
    });

    it("400 Failed create - should return error if name is empty", async (done) => {
      const res = await request(app)
        .post("/fee")
        .set({
          access_token: admin_token.access_token,
        })
        .send({
          name: "",
          description: "Test",
          RealEstateId: 1,
          ComplexId: 1,
          due_date: "2020-12-30",
          RealEstateId: admin_token.RealEstateId,
          ComplexId: admin_token.ComplexId
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter fees name");
      done();
    });

    it("400 Failed create - should return error if date has passed", async (done) => {
      const res = await request(app)
        .post("/fee")
        .set({
          access_token: admin_token.access_token,
        })
        .send({
          name: "Test fee pengajian",
          description: "Test",
          RealEstateId: 1,
          ComplexId: 1,
          due_date: "2020-12-3",
          RealEstateId: admin_token.RealEstateId,
          ComplexId: admin_token.ComplexId
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Date must be greater than today");
      done();
    });

    it("400 Failed create - should return error if date invalid format", async (done) => {
      const res = await request(app)
        .post("/fee")
        .set({
          access_token: admin_token.access_token,
        })
        .send({
          name: "Test fee pengajian",
          description: "Test",
          RealEstateId: 1,
          ComplexId: 1,
          due_date: "2020-13-30",
          RealEstateId: admin_token.RealEstateId,
          ComplexId: admin_token.ComplexId
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter valid date");
      done();
    });
  });

  describe("Test endpoint GET /fee", () => {
    it("200 Succes get fee - should show fee", async (done) => {
      const res = await request(app)
        .get("/fee")
        .set({
          access_token: admin_token.access_token,
          // RealEstateId: admin_token.RealEstateId,
          // ComplexId: admin_token.ComplexId
        })
      const { body, status } = res;
      expect(status).toBe(200);
      id = body[0].id;
      done();
    });

    it("200 Succes get fee by id - should show fee by id", async (done) => {
      const res = await request(app)
        .get(`/fee/${id}`)
        .set({
          access_token: admin_token.access_token,
          // RealEstateId: admin_token.RealEstateId,
          // ComplexId: admin_token.ComplexId
        })
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty("name", "Test fee pengajian");
      done();
    });

    it("404 Failed get fee - should return error if fee not found", async (done) => {
      const res = await request(app)
        .get("/fee/0")
        .set({
          access_token: admin_token.access_token,
          // RealEstateId: admin_token.RealEstateId,
          // ComplexId: admin_token.ComplexId
        })
      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Fee not found");
      done();
    });

    it("401 Failed get event - should return error if no logged in user", async (done) => {
      const res = await request(app)
        .get("/fee")

      const { body, status } = res;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    });
  });

  describe("Test endpoint PUT /fee", () => {
    it("200 Succes update fee - should update fee", async (done) => {
      const res = await request(app)
        .put(`/fee/${id}`)
        .set({
          access_token: admin_token.access_token,
          // RealEstateId: admin_token.RealEstateId,
          // ComplexId: admin_token.ComplexId
        })
        .send({
          name: "Test update fee pengajian",
          description: "Test",
          RealEstateId: 1,
          ComplexId: 1,
          due_date: "2020-12-30",
        });
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty("name");
      expect(body).toHaveProperty("description");
      expect(body).toHaveProperty("due_date");
      expect(body).toHaveProperty("RealEstateId");
      expect(body).toHaveProperty("ComplexId");
      done();
    });

    it("400 Failed update - should return error if name is empty", async (done) => {
      const res = await request(app)
        .put(`/fee/${id}`)
        .set({
          access_token: admin_token.access_token,
          // RealEstateId: admin_token.RealEstateId,
          // ComplexId: admin_token.ComplexId
        })
        .send({
          name: "",
          description: "Test",
          RealEstateId: 1,
          ComplexId: 1,
          due_date: "2020-12-30",
        });
      const { body, status } = res;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please enter fees name");
      done();
    });

    it("401 Failed update - should return error if different real estate", async (done) => {
      const res = await request(app)
        .put(`/fee/${id}`)
        .set({
          access_token: admin2_token.access_token,
          RealEstateId: admin2_token.RealEstateId,
          ComplexId: admin2_token.ComplexId
        })
        .send({
          name: "Tes",
          description: "Test",
          RealEstateId: 1,
          ComplexId: 1,
          due_date: "2020-12-30",
        });
      const { body, status } = res;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Not authorized");
      done();
    });

    it("404 Failed update - should return error if invalid id", async (done) => {
      const res = await request(app)
        .put(`/fee/0`)
        .set({
          access_token: admin_token.access_token,
          // RealEstateId: admin_token.RealEstateId,
          // ComplexId: admin_token.ComplexId
        })
        .send({
          name: "Test update fee pengajian",
          description: "Test",
          RealEstateId: 1,
          ComplexId: 1,
          due_date: "2020-12-30",
        });
      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Fee not found");
      done();
    });
  });

  describe("Test endpoint DELETE /fee", () => {
    it("200 Success delete - should delete fee", async (done) => {
      console.log(id, 'test')
      const res = await request(app)
        .del(`/fee/${id}`)
        .set({
          access_token: admin_token.access_token,
          // RealEstateId: admin_token.RealEstateId,
          // ComplexId: admin_token.ComplexId
        })
      const { body, status } = res;
      expect(status).toBe(200);
      expect(body).toBe("Successful deleted fees");
      done();
    });

    it("404 Failed delete - should return error if not found", async (done) => {
      const res = await request(app)
        .del(`/fee/0`)
        .set({
          access_token: admin_token.access_token,
          // RealEstateId: admin_token.RealEstateId,
          // ComplexId: admin_token.ComplexId
        })
      const { body, status } = res;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Fee not found");
      done();
    });
  });
});
