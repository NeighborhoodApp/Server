const router = require("express").Router();
const Controller = require("../controllers/CommentController");
const Middleware = require("../middlewares/middleware");

router.get("/", Controller.find);
router.post("/", Controller.create);
router.get("/:id", Controller.findById);
router.put("/:id", Middleware.imel, Controller.update);
router.delete("/:id", Middleware.imel, Controller.delete);

module.exports = router;
