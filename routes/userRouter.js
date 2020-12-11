const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const Middleware = require("../middlewares/middleware");

router.get("/", UserController.get);
router.post("/login-cms", UserController.loginCMS);
router.post("/login-warga", UserController.loginWarga);
router.post("/register-warga", UserController.registerWarga);
router.get("/:id", UserController.getOne);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.delete);
module.exports = router;
