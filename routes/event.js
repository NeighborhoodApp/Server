const router = require("express").Router();
const Controller = require("../controllers/EventController");
const Middleware = require("../middlewares/middleware");

router.use(Middleware.wargaAuth);
router.get("/", Controller.find);
router.post("/", Controller.create);
router.get("/:id", Controller.findById);
router.put("/:id", Middleware.eventAuthorization, Controller.update);
router.delete("/:id", Middleware.eventAuthorization, Controller.delete);

module.exports = router;
