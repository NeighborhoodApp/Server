const app = require("../app.js");
const { Developer, sequelize } = require("../models");
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
    await queryInterface.bulkDelete("Developers", {
      id: {
        [Op.gt]: 3,
      },
    });
    await request(app)
      .put("/developers/1")
      .set("access_token", owner_token)
      .send({
        name: "developer1",
        address: "Jln.Developer 1",
        status: "Active",
      });
    done();
  } catch (err) {
    done(err);
  }
});

describe("POST '/developers' ", () => {
  it("201 Create new Developer success - show successful message", async (done) => {
    try {
      const response = await request(app)
        .post("/developers")
        .set("access_token", owner_token)
        .send({
          name: "developer4",
          email: "developer4@mail.com",
          address: "Jln.Developer 4",
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

  it("400 Sending bad request Developer name field empty - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/developers")
        .set("access_token", owner_token)
        .send({
          name: "",
          email: "developer5@mail.com",
          address: "Jln.Developer 3",
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Fill the name field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 Sending bad request Developer email field empty - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/developers")
        .set("access_token", owner_token)
        .send({
          name: "developer5",
          email: "",
          address: "Jln.Developer 3",
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", expect.any(String));
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 Sending bad request Developer email is not valid - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/developers")
        .set("access_token", owner_token)
        .send({
          name: "developer5",
          email: "any",
          address: "Jln.Developer 3",
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Put a valid email address");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 Sending bad request Developer email already registered - should return validation error", async (done) => {
    await Developer.create({
      name: "developer6",
      email: "developer6@mail.com",
      address: "Jln.Developer 6",
      status: "Active",
    });

    try {
      const response = await request(app)
        .post("/developers")
        .set("access_token", owner_token)
        .send({
          name: "developer6",
          email: "developer6@mail.com",
          address: "Jln.Developer 6",
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Email already registered");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 create Developer failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).post("/developers").send({
        name: "developer7",
        email: "developer7@mail.com",
        address: "Jln.Developer 7",
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

describe("GET ALL /developers", () => {
  it("200 Get all developers success - should return array of objects", async (done) => {
    try {
      const response = await request(app)
        .get("/developers")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeDefined();
      done();
    } catch (err) {
      done(err);
    }
  });
  it("401 get all Developers failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).get("/developers");
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("GET /developers/:id", () => {
  it("200 Get one Developer success - should return object", async (done) => {
    try {
      const response = await request(app)
        .get("/developers/1")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeDefined();
      done();
    } catch (err) {
      done(err);
    }
  });
  it("401 get one Developer failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).get("/developers/1");
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });
  it("404 get one Developer failed - should return developer not found message", async (done) => {
    try {
      const response = await request(app)
        .get("/developers/0")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Developer not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("PUT /developers/:id", () => {
  it("200 update one Developer success - should return successful message", async (done) => {
    try {
      const response = await request(app)
        .put("/developers/1")
        .set("access_token", owner_token)
        .send({
          name: "developer7",
          address: "Jln.Developer 7",
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

  it("400 update one Developer failed - should return validation error msg", async (done) => {
    try {
      const response = await request(app)
        .put("/developers/1")
        .set("access_token", owner_token)
        .send({
          name: "",
          address: "Jln.Developer 7",
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Fill the name field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 update one Developer failed - should return validation error msg", async (done) => {
    try {
      const response = await request(app)
        .put("/developers/1")
        .set("access_token", owner_token)
        .send({
          name: "Developer 7",
          address: "",
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Fill the address field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 update one Developer failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).put("/developers/1").set({
        name: "Developer 7",
        address: "Jln.Developer 7",
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

  it("404 update one Developer failed - should return developer not found message", async (done) => {
    try {
      const response = await request(app)
        .put("/developers/0")
        .set("access_token", owner_token)
        .send({
          name: "Developer 7",
          address: "Jln.Developer 7",
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Developer not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("DELETE /developers/:id", () => {
  it("200 delete one Developer success - should return successful message", async (done) => {
    const newDeveloper = await Developer.create({
      name: "Developer 8",
      email: "developer8@mail.com",
      address: "Jln.Developer 8",
      status: "Active",
    });

    try {
      const response = await request(app)
        .delete(`/developers/${newDeveloper.id}`)
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("msg", expect.any(String));
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 delete one Developer failed - should return Authentication failed message", async (done) => {
    const newDeveloper = await Developer.create({
      name: "Developer 8",
      email: "developer8@mail.com",
      address: "Jln.Developer 8",
      status: "Active",
    });

    try {
      const response = await request(app).delete(
        `/developers/${newDeveloper.id}`
      );
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("404 delete one Developer failed - should return developer not found", async (done) => {
    try {
      const response = await request(app)
        .delete("/developers/0")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Developer not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});
