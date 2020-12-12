const router = require("express").Router();
const Controller = require("../controllers/FeeController");
const Middleware = require("../middlewares/middleware");

router.get("/", Controller.find);
router.post("/", Middleware.adminAuth, Controller.create);
router.get("/:id", Controller.findById);
router.put("/:id", Middleware.adminAuth, Controller.update);
router.delete("/:id", Middleware.adminAuth, Controller.delete);

module.exports = router;
