const Router = require('koa-router');

const accountRouter = require('./accountRouter');

const router = new Router();
router.use(accountRouter.routes());

module.exports = router;