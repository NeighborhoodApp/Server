if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const routes = require("./routes/index.js");
const cors = require("cors");
const Middleware = require("./middlewares/middleware");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);
app.use(Middleware.errorHandler);

module.exports = app;
