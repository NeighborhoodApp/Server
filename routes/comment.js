const router = require("express").Router();
const Controller = require("../controllers/CommentController");
const Middleware = require("../middlewares/middleware");

router.use(Middleware.wargaAuth);
router.get("/", Controller.find);
router.post("/:timelineId", Controller.create);
router.get("/:timelineId/:id", Controller.findById);
router.patch("/:timelineId/:id", Middleware.commentAuthorization, Controller.update);
router.delete("/:timelineId/:id", Middleware.commentAuthorization, Controller.delete);

module.exports = router;
