const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const Middleware = require("../middlewares/middleware");

router.get("/", UserController.get);
router.get("/:id", UserController.getOne);
router.put("/verify/:id", Middleware.wargaAuth, UserController.verifyToken);

router.post("/login-cms", UserController.loginCMS);
router.post("/login-client", UserController.loginClient);
router.post("/register-warga", UserController.registerWarga);
router.post(
  "/register-admin",
  Middleware.ownerAuth,
  Middleware.adminRegistrationInputValidation,
  UserController.registerAdmin
);
router.patch("/:id", Middleware.adminAuth, UserController.patch);
router.put("/:id", UserController.update);
router.delete(
  "/:id",
  Middleware.deleteAdminVerification,
  UserController.delete
);

module.exports = router;
