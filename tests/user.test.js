const app = require("../app.js");
const { User, sequelize } = require("../models");
const request = require("supertest");
const { queryInterface } = sequelize;
const { Op } = require("sequelize");

let owner_token, admin_token, warga_token;

beforeAll(async (done) => {
  try {
    const response_owner = await request(app).post("/users/login-cms").send({
      email: "admin@mail.com",
      password: "tetonggo5",
    });
    const response_admin = await request(app).post("/users/login-client").send({
      email: "admin2@mail.com",
      password: "admin2@mail.com",
    });
    const response_warga = await request(app).post("/users/login-client").send({
      email: "warga2@mail.com",
      password: "warga2@mail.com",
    });
    owner_token = response_owner.body.access_token;
    admin_token = response_admin.body.access_token;
    warga_token = response_warga.body.access_token;
    done();
  } catch (err) {
    done(err);
  }
});

afterAll(async (done) => {
  try {
    await queryInterface.bulkDelete("Users", {
      id: {
        [Op.gt]: 8,
      },
    });
    await request(app).put("/users/8").set("access_token", admin_token).send({
      fullname: "Warga4",
      address: "Real Estet 2 Alamat Warga",
      RealEstateId: 2,
      ComplexId: 5,
    });
    done();
  } catch (err) {
    done(err);
  }
});

describe("GET ALL /users", () => {
  it("200 get all users success - should return array of objects", async (done) => {
    try {
      const response = await request(app).get("/users");
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeDefined();
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("GET /users/:id", () => {
  it("200 get one User success - should return object", async (done) => {
    try {
      const response = await request(app).get("/users/1");
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeDefined();
      done();
    } catch (err) {
      done(err);
    }
  });

  it("404 get one User failed - should return user not found message", async (done) => {
    try {
      const response = await request(app).get("/users/0");
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "User not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("POST '/users/login-cms'", () => {
  it("200 login AppOwner success - should return token and email", async (done) => {
    try {
      const response = await request(app).post("/users/login-cms").send({
        email: "admin@mail.com",
        password: "tetonggo5",
      });
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("access_token", expect.any(String));
      expect(body).toHaveProperty("email", "admin@mail.com");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 login AppOwner failed - should return error meesage", async (done) => {
    try {
      const response = await request(app).post("/users/login-cms").send({
        email: "admin4@mail.com",
        password: "tetonggo5",
      });
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", expect.any(String));
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("POST /users/login-client", () => {
  it("200 login User (admin/warga) success - should return 'access_token' and 'id'", async (done) => {
    try {
      const response = await request(app).post("/users/login-client").send({
        email: "admin2@mail.com",
        password: "admin2@mail.com",
      });
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("access_token", expect.any(String));
      expect(body).toHaveProperty("id", expect.any(Number));
      expect(body).toHaveProperty("RealEstateId");
      expect(body).toHaveProperty("ComplexId");
      expect(body).toHaveProperty("coordinate");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 login User (admin/warga) failed - should return 'User not found' message", async (done) => {
    try {
      const response = await request(app).post("/users/login-client").send({
        email: "admin0@mail.com",
        password: "admin0@mail.com",
      });
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "User not found");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 login User (admin/warga) failed - should return 'Wrong password' message", async (done) => {
    try {
      const response = await request(app).post("/users/login-client").send({
        email: "admin2@mail.com",
        password: "admin0@mail.com",
      });
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Wrong password!");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("POST '/users/register-warga' should only registered by Warga(Admin/Users)", () => {
  it("201 create new User (warga) as Admin success - show successful message", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", admin_token)
        .send({
          email: "warga5@mail.com",
          password: "warga5@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
        });
      const { body, status } = response;
      expect(status).toBe(201);
      expect(body).toHaveProperty("email", "warga5@mail.com");
      expect(body).toHaveProperty("id", expect.any(Number));
      expect(body).toHaveProperty("fullname", "Warga4");
      expect(body).toHaveProperty("address", "Real Estet 2 Alamat Warga");
      expect(body).toHaveProperty("status", "Inactive");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("201 create new User (warga) as Warga success - show successful message", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", warga_token)
        .send({
          email: "warga50@mail.com",
          password: "warga50@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
        });
      const { body, status } = response;
      expect(status).toBe(201);
      expect(body).toHaveProperty("email", "warga50@mail.com");
      expect(body).toHaveProperty("id", expect.any(Number));
      expect(body).toHaveProperty("fullname", "Warga4");
      expect(body).toHaveProperty("address", "Real Estet 2 Alamat Warga");
      expect(body).toHaveProperty("status", "Inactive");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User email field empty - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", warga_token)
        .send({
          email: "",
          password: "warga5@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty(
        "msg",
        "Don't put empty email, Put a valid email address"
      );
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User email is not unique - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", warga_token)
        .send({
          email: "warga5@mail.com",
          password: "warga5@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Email already registered");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User email is not valid - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", warga_token)
        .send({
          email: "warga",
          password: "warga5@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Put a valid email address");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User password should contain number - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", warga_token)
        .send({
          email: "warga6@mail.com",
          password: "warga",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Password must include number!");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User password should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", warga_token)
        .send({
          email: "warga6@mail.com",
          password: "",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty(
        "msg",
        "Please fill the password, Password must include number!"
      );
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User fullname should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", warga_token)
        .send({
          email: "warga6@mail.com",
          password: "warga6@mail.com",
          fullname: "",
          address: "Real Estet 2 Alamat Warga",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please fill the fullname field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User address should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", warga_token)
        .send({
          email: "warga6@mail.com",
          password: "warga6@mail.com",
          fullname: "horis",
          address: "",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please fill the address field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 create User failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).post("/users/register-warga").send({
        email: "warga6@mail.com",
        password: "warga6@mail.com",
        fullname: "Warga4",
        address: "Real Estet 2 Alamat Warga",
      });
      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("msg", "Authentication failed");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 create User failed (tried to register warga as Owner) - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", owner_token)
        .send({
          email: "warga6@mail.com",
          password: "warga6@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
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

describe("POST '/users/register-admin' should only registered by AppOwner", () => {
  it("201 Create new User (admin) success - should return 'id' and 'email'", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", owner_token)
        .send({
          email: "admin5@mail.com",
          password: "admin5@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(201);
      expect(body).toHaveProperty("id", expect.any(Number));
      expect(body).toHaveProperty("email", "admin5@mail.com");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User email field empty - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", owner_token)
        .send({
          email: "",
          password: "admin5@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty(
        "msg",
        "Don't put empty email, Put a valid email address"
      );
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User email is not unique - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", owner_token)
        .send({
          email: "admin5@mail.com",
          password: "admin5@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
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

  it("400 sending bad request User email is not valid - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", owner_token)
        .send({
          email: "warga",
          password: "admin5@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
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

  it("400 sending bad request User password should contain number - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", owner_token)
        .send({
          email: "warga6@mail.com",
          password: "warga",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Password must include number!");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User password should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", owner_token)
        .send({
          email: "warga6@mail.com",
          password: "",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty(
        "msg",
        "Please fill the password, Password must include number!"
      );
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User fullname should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", owner_token)
        .send({
          email: "warga6@mail.com",
          password: "warga6@mail.com",
          fullname: "",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please fill the fullname field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User address should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", owner_token)
        .send({
          email: "warga6@mail.com",
          password: "warga6@mail.com",
          fullname: "horis",
          address: "",
          RealEstateId: 2,
          ComplexId: 5,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please fill the address field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User real estate and complex should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", owner_token)
        .send({
          email: "warga6@mail.com",
          password: "warga6@mail.com",
          fullname: "horis",
          address: "dsadasdas",
          RealEstateId: "",
          ComplexId: "",
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty(
        "msg",
        "Please fill the Real Estate field and Complex field"
      );
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User real estate should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", owner_token)
        .send({
          email: "warga6@mail.com",
          password: "warga6@mail.com",
          fullname: "horis",
          address: "dsadasdas",
          RealEstateId: "",
          ComplexId: 5,
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please fill the Real Estate field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 sending bad request User complex should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", owner_token)
        .send({
          email: "warga6@mail.com",
          password: "warga6@mail.com",
          fullname: "horis",
          address: "dsadasdas",
          RealEstateId: 2,
          ComplexId: "",
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please fill the Complex field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 create User failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).post("/users/register-admin").send({
        email: "warga6@mail.com",
        password: "warga6@mail.com",
        fullname: "Warga4",
        address: "Real Estet 2 Alamat Warga",
        RealEstateId: 2,
        ComplexId: 5,
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

  it("401 create User failed (tried to register Admin as Admin) - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", admin_token)
        .send({
          email: "warga6@mail.com",
          password: "warga6@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
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

  it("401 create User failed (tried to register Admin as Warga) - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-admin")
        .set("access_token", warga_token)
        .send({
          email: "warga6@mail.com",
          password: "warga6@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
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

describe("PATCH /users/:id should only updated by Admin (STATUS ONLY)", () => {
  it("200 update one User success - should return successful message", async (done) => {
    try {
      const response = await request(app)
        .patch("/users/8")
        .set("access_token", admin_token)
        .send({
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

  it("400 update one User failed - should return validation error msg", async (done) => {
    try {
      const response = await request(app)
        .patch("/users/8")
        .set("access_token", admin_token)
        .send({
          status: "",
        });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Don't empty the status field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("401 update one User failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).patch("/users/8").send({
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

  it("401 update one User failed (tried to patch as Owner) - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app)
        .patch("/users/8")
        .send("access_token", owner_token)
        .send({
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

  it("401 update one User failed (tried to patch as Warga) - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app)
        .patch("/users/8")
        .send("access_token", warga_token)
        .send({
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

  it("404 update one User failed - should return user not found message", async (done) => {
    try {
      const response = await request(app)
        .patch("/users/0")
        .set("access_token", admin_token)
        .send({
          status: "Active",
        });
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "User not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("PUT /users/:id", () => {
  it("200 update one User success - should return successful message", async (done) => {
    try {
      const response = await request(app).put("/users/8").send({
        fullname: "Warga4",
        address: "Real Estet 2 Alamat Warga",
        RealEstateId: 2,
        ComplexId: 5,
      });
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("msg", expect.any(String));
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 update one User failed fullname should not be emptied- should return validation error msg", async (done) => {
    try {
      const response = await request(app).put("/users/8").send({
        fullname: "",
        address: "Real Estet 2 Alamat Warga",
        RealEstateId: 2,
        ComplexId: 5,
      });
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please fill the fullname field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 update one User failed address should not be emptied- should return validation error msg", async (done) => {
    try {
      const response = await request(app).put("/users/8").send({
        fullname: "Warga4",
        address: "",
        RealEstateId: 2,
        ComplexId: 5,
      });

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toHaveProperty("msg", "Please fill the address field");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("404 update one User failed - should return user not found message", async (done) => {
    try {
      const response = await request(app).put("/users/0").send({
        fullname: "Warga4",
        address: "Real Estet 2 Alamat Warga",
        RealEstateId: 2,
        ComplexId: 5,
      });
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "User not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});

describe("DELETE /users/:id", () => {
  it("200 delete one User (Warga) success - should return successful message", async (done) => {
    const newUser = await User.create({
      email: "warga100@mail.com",
      password: "warga100@mail.com",
      fullname: "Warga4",
      address: "Real Estet 2 Alamat Warga",
      RoleId: 3,
      RealEstateId: 2,
      ComplexId: 5,
      status: "Active",
    });

    try {
      const response = await request(app).delete(`/users/${newUser.id}`);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("msg", "User is successfully deleted");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("200 delete one User (Admin) success - should return successful message", async (done) => {
    const newUser = await User.create({
      email: "warga100@mail.com",
      password: "warga100@mail.com",
      fullname: "Warga4",
      address: "Real Estet 2 Alamat Warga",
      RoleId: 2,
      RealEstateId: 2,
      ComplexId: 5,
      status: "Active",
    });

    try {
      const response = await request(app).delete(`/users/${newUser.id}`);
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("msg", "User is successfully deleted");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("404 delete one User failed - should return user not found", async (done) => {
    try {
      const response = await request(app).delete("/users/0");
      const { body, status } = response;
      expect(status).toBe(404);
      expect(body).toHaveProperty("msg", "User not found");
      done();
    } catch (err) {
      done(err);
    }
  });
});
