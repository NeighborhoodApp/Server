const app = require("../app.js");
const { Role, sequelize } = require("../models");
const request = require("supertest");
const { queryInterface } = sequelize;
const { Op } = require("sequelize");

let owner_token;

beforeAll(async (done) => {
  const roles = [
    {
      role: "Super Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      role: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      role: "Warga",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  try {
    await queryInterface.bulkInsert("Roles", roles, {});
    const response = await request(app)
      .post("/users/login-cms")
      .send({
        email: "admin@mail.com",
        password: "tetonggo5",
      })
    owner_token = response.body.access_token;
    done();
  } catch (error) {
    console.log(error)
    done();
  }
});

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete("Roles", {
      id: {
        [Op.gt]: 3,
      },
    });
    await request(app)
      .put("/roles/1")
      .set("access_token", owner_token)
      .send({ role: "Super Admin" });
    done();
  } catch (err) {
    done(err);
  }
});

describe("POST '/roles' ", () => {
  it("201 Create new Role success - show successful message", async (done) => {
    try {
      const response = await request(app)
        .post("/roles")
        .set("access_token", owner_token)
        .send({
          role: "Super Duper Admin",
        });
      const { body, status } = response;
      expect(status).toBe(201);
      expect(body).toHaveProperty("msg", expect.any(String));
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 Sending bad request Role field empty - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/roles")
        .set("access_token", owner_token)
        .send({
          role: "",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Fill the role name");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 create Role failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).post("/roles").send({
        role: "Super Duper Admin",
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

describe("GET ALL /roles", () => {
  it("200 Get all roles success - should return array of objects", async (done) => {
    try {
      const response = await request(app)
        .get("/roles")
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
      const response = await request(app).get("/roles");
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("GET /roles/:id", () => {
  it("200 Get one Role success - should return object", async (done) => {
    try {
      const response = await request(app)
        .get("/roles/1")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeDefined();
      done();
    } catch (err) {
      done(err);
    }
  });
  it("401 get one Role failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).get("/roles/1");
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });
  it("404 get one Role failed - should return role not found message", async (done) => {
    try {
      const response = await request(app)
        .get("/roles/0")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Role not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("PUT /roles/:id", () => {
  it("200 update one Role success - should return successful message", async (done) => {
    try {
      const response = await request(app)
        .put("/roles/1")
        .set("access_token", owner_token)
        .send({ role: "adminn" });
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("msg", expect.any(String));
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 update one Role failed - should return validation error msg", async (done) => {
    try {
      const response = await request(app)
        .put("/roles/1")
        .set("access_token", owner_token)
        .send({ role: "" });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Fill the role name");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 put one Role failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).put("/roles/1").set({
        role: "admin",
      });
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("404 put one Role failed - should return role not found message", async (done) => {
    try {
      const response = await request(app)
        .put("/roles/0")
        .set("access_token", owner_token)
        .send({ role: "admin" });
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Role not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("DELETE /roles/:id", () => {
  it("200 delete one Role success - should return successful message", async (done) => {
    const newRole = await Role.create({
      role: "Trial Admin",
    });

    try {
      const response = await request(app)
        .delete(`/roles/${newRole.id}`)
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("msg", expect.any(String));
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 delete one Role failed - should return Authentication failed message", async (done) => {
    const newRole = await Role.create({
      role: "Trial Admin",
    });

    try {
      const response = await request(app).delete(`/roles/${newRole.id}`);
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("404 delete one Role failed - should return role not found", async (done) => {
    try {
      const response = await request(app)
        .delete("/roles/0")
        .set("access_token", owner_token);
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "Role not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});
