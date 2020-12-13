const router = require("express").Router();
const Controller = require("../controllers/FeeController");
const Middleware = require("../middlewares/middleware");

router.use(Middleware.wargaAuth);
router.get("/", Controller.find);
router.post("/", Middleware.createFeeAuthorization, Controller.create);
router.get("/:id", Controller.findById);
router.put("/:id", Middleware.feeAuthorization, Controller.update);
router.delete("/:id", Middleware.feeAuthorization, Controller.delete);

module.exports = router;
