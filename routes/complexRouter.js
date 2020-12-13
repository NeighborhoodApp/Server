const express = require("express");
const router = express.Router();
const ComplexController = require("../controllers/ComplexController");
const Middleware = require("../middlewares/middleware");

router.use(Middleware.ownerAuth);
router.get("/", ComplexController.get);
router.post("/", ComplexController.create);
router.get("/:id", ComplexController.getOne);
router.put("/:id", ComplexController.update);
router.delete(
  "/:id",
  Middleware.deleteComplexVerification,
  ComplexController.delete
);

module.exports = router;
