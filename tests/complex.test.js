const app = require("../app.js");
const { Complex, sequelize } = require("../models");
const request = require("supertest");
const { queryInterface } = sequelize;
const { Op } = require("sequelize");

let owner_token;

beforeAll(async (done) => {
  await request(app)
    .post("/users/login-cms")
    .send({
      email: "admin@mail.com",
      password: "tetonggo5",
    })
    .then((response) => {
      owner_token = response.body.access_token;
      done();
    })
    .catch((err) => {
      done(err);
    });
});

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete("RealEstates", {
      id: {
        [Op.gt]: 11,
      },
    });
    await request(app)
      .put("/complexes/1")
      .set("access_token", owner_token)
      .send({
        name: "Real Estate 1 Komplek A1",
        RealEstateId: 1,
        status: "Active",
      });
    done();
  } catch (err) {
    done(err);
  }
});

describe("POST '/complexes' ", () => {
  it("201 Create new Complex success - show successful message", async (done) => {
    try {
      const response = await request(app)
        .post("/complexes")
        .set("access_token", owner_token)
        .send({
          name: "Real Estate 1 Komplek A1",
          RealEstateId: 1,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(201);
      expect(body).toHaveProperty("msg", expect.any(String));
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 Sending bad request Complex name field empty - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/complexes")
        .set("access_token", owner_token)
        .send({
          name: "",
          RealEstateId: 1,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Don't empty the name field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 create Complex failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).post("/complexes").send({
        name: "Real Estate 1 Komplek A1",
        RealEstateId: 1,
        status: "Active",
      });
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("GET ALL /complexes", () => {
  it("200 Get all complexes success - should return array of objects", async (done) => {
    try {
      const response = await request(app)
        .get("/complexes")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeDefined();
      done();
    } catch (err) {
      done(err);
    }
  });
  it("401 get all Roles failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).get("/complexes");
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("GET /complexes/:id", () => {
  it("200 Get one Complex success - should return object", async (done) => {
    try {
      const response = await request(app)
        .get("/complexes/1")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeDefined();
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 get one Complex failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).get("/complexes/1");
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("404 get one Complex failed - should return complex not found message", async (done) => {
    try {
      const response = await request(app)
        .get("/complexes/0")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Complex not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("PUT /complexes/:id", () => {
  it("200 update one Complex success - should return successful message", async (done) => {
    try {
      const response = await request(app)
        .put("/complexes/1")
        .set("access_token", owner_token)
        .send({
          name: "Real Estate 1 Komplek A1",
          RealEstateId: 1,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("msg", expect.any(String));
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 update one Complex failed - should return validation error msg", async (done) => {
    try {
      const response = await request(app)
        .put("/complexes/1")
        .set("access_token", owner_token)
        .send({
          name: "",
          RealEstateId: 1,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Don't empty the name field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 update one Complex failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).put("/complexes/1").set({
        name: "Real Estate 1 Komplek A1",
        RealEstateId: 1,
        status: "Active",
      });
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("404 update one Complex failed - should return complex not found message", async (done) => {
    try {
      const response = await request(app)
        .put("/complexes/0")
        .set("access_token", owner_token)
        .send({
          name: "Real Estate 1 Komplek A1",
          RealEstateId: 1,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Complex not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("DELETE /complexes/:id", () => {
  it("200 delete one Complex success - should return successful message", async (done) => {
    const newComplex = await Complex.create({
      name: "Real Estate 1 Komplek A1",
      RealEstateId: 1,
      status: "Active",
    });

    try {
      const response = await request(app)
        .delete(`/complexes/${newComplex.id}`)
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("msg", expect.any(String));
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 delete one Complex failed - should return Authentication failed message", async (done) => {
    const newComplex = await Complex.create({
      name: "Real Estate 1 Komplek A1",
      RealEstateId: 1,
      status: "Active",
    });

    try {
      const response = await request(app).delete(`/complexes/${newComplex.id}`);
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("404 delete one Complex failed - should return complex not found", async (done) => {
    try {
      const response = await request(app)
        .delete("/complexes/0")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Complex not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});
