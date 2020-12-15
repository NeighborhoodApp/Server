const express = require("express");
const router = express.Router();
const RealEstateController = require("../controllers/RealEstateController");
const Middleware = require("../middlewares/middleware");

router.get("/", RealEstateController.get);
router.use(Middleware.ownerAuth);
router.post("/", RealEstateController.create);
router.get("/:id", RealEstateController.getOne);
router.put("/:id", RealEstateController.update);
router.delete(
  "/:id",
  Middleware.deleteRealEstateVerification,
  RealEstateController.delete
);

module.exports = router;
