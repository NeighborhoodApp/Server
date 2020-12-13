const express = require("express");
const router = express.Router();
const DeveloperController = require("../controllers/DeveloperController");
const Middleware = require("../middlewares/middleware");

router.use(Middleware.ownerAuth);
router.get("/", DeveloperController.get);
router.post("/", DeveloperController.create);
router.get("/:id", DeveloperController.getOne);
router.put("/:id", DeveloperController.update);
router.delete(
  "/:id",
  Middleware.deleteDeveloperVerification,
  DeveloperController.delete
);

module.exports = router;
