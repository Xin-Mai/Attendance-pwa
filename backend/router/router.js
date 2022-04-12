const Router = require('koa-router');

const accountRouter = require('./accountRouter');
const courseRouter = require('./courseRouter');

const router = new Router();
router.use(accountRouter.routes());
router.use(courseRouter.routes());

module.exports = router;