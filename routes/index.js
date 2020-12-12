const router = require('express').Router()
const category = require('./category')
const event = require('./event')
const fee = require('./fee')
const timeline = require('./timeline')
const comment = require('./comment')
const userRouter = require("./userRouter.js");
const developerRouter = require("./developerRouter.js");
const roleRouter = require("./roleRouter.js");
const realEstateRouter = require("./realEstateRouter.js");
const complexRouter = require("./complexRouter.js");

router.use('/category', category)
router.use('/event', event)
router.use('/fee', fee)
router.use('/timeline', timeline)
router.use('/comment', comment)
router.use("/users", userRouter);
router.use("/developers", developerRouter);
router.use("/roles", roleRouter);
router.use("/real-estates", realEstateRouter);
router.use("/complexes", complexRouter);

module.exports = router;
