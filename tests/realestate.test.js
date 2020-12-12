const app = require("../app.js");
const { RealEstate, sequelize } = require("../models");
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
        [Op.gt]: 5,
      },
    });
    await request(app)
      .put("/real-estates/1")
      .set("access_token", owner_token)
      .send({
        name: "RealEstate 1",
        address: "Jln. RealEstate 1",
        coordinate: "-2.9985332514737544, 104.790206885603",
        DeveloperId: 1,
        status: "Active",
      });
    done();
  } catch (err) {
    done(err);
  }
});

describe("POST '/real-estates' ", () => {
  it("201 Create new RealEstate success - show successful message", async (done) => {
    try {
      const response = await request(app)
        .post("/real-estates")
        .set("access_token", owner_token)
        .send({
          name: "RealEstate 6",
          address: "Jln. RealEstate 6",
          coordinate: "-2.9985332514737544, 104.790206885603",
          DeveloperId: 1,
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

  it("400 Sending bad request RealEstate name field empty - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/real-estates")
        .set("access_token", owner_token)
        .send({
          name: "",
          address: "Jln. RealEstate 1",
          coordinate: "-2.9985332514737544, 104.790206885603",
          DeveloperId: 1,
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

  it("400 Sending bad request RealEstate address field empty - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/real-estates")
        .set("access_token", owner_token)
        .send({
          name: "RealEstate 1",
          address: "",
          coordinate: "-2.9985332514737544, 104.790206885603",
          DeveloperId: 1,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Don't empty the address field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 create RealEstate failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).post("/real-estates").send({
        name: "RealEstate 1",
        address: "Jln. RealEstate 1",
        coordinate: "-2.9985332514737544, 104.790206885603",
        DeveloperId: 1,
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

describe("GET ALL /real-estates", () => {
  it("200 Get all real-estates success - should return array of objects", async (done) => {
    try {
      const response = await request(app)
        .get("/real-estates")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeDefined();
      done();
    } catch (err) {
      done(err);
    }
  });
  it("401 get all Real Estates failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).get("/real-estates");
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("GET /real-estates/:id", () => {
  it("200 Get one RealEstate success - should return object", async (done) => {
    try {
      const response = await request(app)
        .get("/real-estates/1")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeDefined();
      done();
    } catch (err) {
      done(err);
    }
  });
  it("401 get one RealEstate failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).get("/real-estates/1");
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("404 get one RealEstate failed - should return real estate not found message", async (done) => {
    try {
      const response = await request(app)
        .get("/real-estates/0")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "RealEstate not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("PUT /real-estates/:id", () => {
  it("200 update one RealEstate success - should return successful message", async (done) => {
    try {
      const response = await request(app)
        .put("/real-estates/1")
        .set("access_token", owner_token)
        .send({
          name: "RealEstate 1",
          address: "Jln. RealEstate 1",
          coordinate: "-2.9985332514737544, 104.790206885603",
          DeveloperId: 1,
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

  it("400 update one RealEstate failed - should return validation error msg", async (done) => {
    try {
      const response = await request(app)
        .put("/real-estates/1")
        .set("access_token", owner_token)
        .send({
          name: "",
          address: "Jln. RealEstate 1",
          coordinate: "-2.9985332514737544, 104.790206885603",
          DeveloperId: 1,
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

  it("400 update one RealEstate failed - should return validation error msg", async (done) => {
    try {
      const response = await request(app)
        .put("/real-estates/1")
        .set("access_token", owner_token)
        .send({
          name: "RealEstate 1",
          address: "",
          coordinate: "-2.9985332514737544, 104.790206885603",
          DeveloperId: 1,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Don't empty the address field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 update one RealEstate failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).put("/real-estates/1").set({
        name: "RealEstate 1",
        address: "Jln. RealEstate 1",
        coordinate: "-2.9985332514737544, 104.790206885603",
        DeveloperId: 1,
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

  it("404 update one RealEstate failed - should return real estate not found message", async (done) => {
    try {
      const response = await request(app)
        .put("/real-estates/0")
        .set("access_token", owner_token)
        .send({
          name: "RealEstate 1",
          address: "Jln. RealEstate 1",
          coordinate: "-2.9985332514737544, 104.790206885603",
          DeveloperId: 1,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "RealEstate not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("DELETE /real-estates/:id", () => {
  it("200 delete one RealEstate success - should return successful message", async (done) => {
    const newRealEstate = await RealEstate.create({
      name: "RealEstate 1",
      address: "Jln. RealEstate 1",
      coordinate: "-2.9985332514737544, 104.790206885603",
      DeveloperId: 1,
      status: "Active",
    });

    try {
      const response = await request(app)
        .delete(`/real-estates/${newRealEstate.id}`)
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("msg", expect.any(String));
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 delete one RealEstate failed - should return Authentication failed message", async (done) => {
    const newRealEstate = await RealEstate.create({
      name: "RealEstate 1",
      address: "Jln. RealEstate 1",
      coordinate: "-2.9985332514737544, 104.790206885603",
      DeveloperId: 1,
      status: "Active",
    });

    try {
      const response = await request(app).delete(
        `/real-estates/${newRealEstate.id}`
      );
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("404 delete one RealEstate failed - should return real estate not found", async (done) => {
    try {
      const response = await request(app)
        .delete("/real-estates/0")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "RealEstate not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});
