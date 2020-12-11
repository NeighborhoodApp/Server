const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/RoleController");
const Middleware = require("../middlewares/middleware");

router.use(Middleware.ownerAuth);
router.get("/", RoleController.get);
router.post("/", RoleController.create);
router.get("/:id", RoleController.getOne);
router.put("/:id", RoleController.update);
router.delete("/:id", RoleController.delete);

module.exports = router;
