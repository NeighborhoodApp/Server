const router = require("express").Router();
const Controller = require("../controllers/TimelineController");
const Middleware = require("../middlewares/middleware");

router.use(Middleware.wargaAuth);
router.get("/", Controller.find);
router.post("/", Controller.create);
router.get("/:id", Controller.findById);
router.put("/:id", Middleware.timelineAuthorization, Controller.update);
router.delete("/:id", Middleware.timelineAuthorization, Controller.delete);

module.exports = router;
