const Router = require('koa-router');

const accountRouter = require('./accountRouter');
const courseRouter = require('./courseRouter');
const attendRouter = require('./attendanceRouter');

const router = new Router();
router.use(accountRouter.routes());
router.use(courseRouter.routes());
router.use(attendRouter.routes());

module.exports = router;