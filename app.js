if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const PORT = process.env.PORT || 3000;
const app = express();
const cors = require("cors");
const routes = require("./routes");
const Middleware = require("./middlewares/middleware");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routes);
app.use(Middleware.errorHandler);

// app.listen(PORT, () => {
//   console.log("Server running at http://localhost:" + PORT);
// });

module.exports = app;
