const router = require("express").Router();
const Controller = require("../controllers/FeeController");
const Middleware = require("../middlewares/middleware");

router.use(Middleware.wargaAuth);
router.get("/", Controller.find);
router.post("/", Controller.create);
router.get("/:id", Controller.findById);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.delete);

module.exports = router;
