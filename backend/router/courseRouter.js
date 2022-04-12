// 用于管理课程列表相关的api
const Router = require('koa-router');

const router = new Router();

router.get('coursesList', '/courses/list', (ctx) => {
  console.log(ctx.cookies);
});

module.exports = router;