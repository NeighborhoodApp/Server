const express = require("express");
const router = express.Router();
const userRouter = require("./userRouter.js");
const developerRouter = require("./developerRouter.js");
const roleRouter = require("./roleRouter.js");
const realEstateRouter = require("./realEstateRouter");
const complexRouter = require("./complexRouter.js");

router.use("/users", userRouter);
router.use("/developers", developerRouter);
router.use("/roles", roleRouter);
router.use("/real-estates", realEstateRouter);
router.use("/complexes", complexRouter);

module.exports = router;
