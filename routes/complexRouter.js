const express = require("express");
const router = express.Router();
const ComplexController = require("../controllers/ComplexController");
const Middleware = require("../middlewares/middleware");

router.get("/", ComplexController.get);
router.post("/", ComplexController.create);
router.get("/:id", ComplexController.getOne);
router.put("/:id", ComplexController.update);
router.delete("/:id", ComplexController.delete);

module.exports = router;
