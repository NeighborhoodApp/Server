const app = require("../app.js");
const { User, sequelize } = require("../models");
const request = require("supertest");
const { queryInterface } = sequelize;
const { Op } = require("sequelize");

let owner_token;
let admin_token;

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
    owner_token = response_owner.body.access_token;
    admin_token = response_admin.body.access_token;
    console.log(owner_token, "owner");
    console.log(admin_token, "admin");
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

describe("POST '/users/register-warga' should only registered by Admin", () => {
  it("201 Create new User success - show successful message", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", admin_token)
        .send({
          email: "warga5@mail.com",
          password: "warga5@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
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

  it("400 Sending bad request User email field empty - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", admin_token)
        .send({
          email: "",
          password: "warga5@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
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

  it("400 Sending bad request User email is not unique - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", admin_token)
        .send({
          email: "warga5@mail.com",
          password: "warga5@mail.com",
          fullname: "Warga4",
          address: "Real Estet 2 Alamat Warga",
          RealEstateId: 2,
          ComplexId: 5,
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

  it("400 Sending bad request User email is not valid - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", admin_token)
        .send({
          email: "warga",
          password: "warga5@mail.com",
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

  it("400 Sending bad request User password should contain number - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", admin_token)
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

  it("400 Sending bad request User password should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", admin_token)
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
      expect(body).toHaveProperty("msg", "Please fill the password");
      done();
    } catch (err) {
      done(err);
    }
  });

  it("400 Sending bad request User fullname should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", admin_token)
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

  it("400 Sending bad request User address should not be emptied - should return validation error", async (done) => {
    try {
      const response = await request(app)
        .post("/users/register-warga")
        .set("access_token", admin_token)
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

  it("401 create User failed - should return Authentication failed message", async (done) => {
    try {
      const response = await request(app).post("/users/register-warga").send({
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
