const express = require("express");
const router = express.Router();
const RealEstateController = require("../controllers/RealEstateController");
const Middleware = require("../middlewares/middleware");

router.use(Middleware.ownerAuth);
router.get("/", RealEstateController.get);
router.post("/", RealEstateController.create);
router.get("/:id", RealEstateController.getOne);
router.put("/:id", RealEstateController.update);
router.delete("/:id", RealEstateController.delete);

module.exports = router;
