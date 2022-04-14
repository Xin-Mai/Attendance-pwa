// 用于管理课程列表相关的api
const Router = require('koa-router');
const courseController = require('../controller/courseController');

const router = new Router();

router.get('coursesList', '/courses/list', async (ctx) => {
  console.log('/courses/list', ctx.state);
  await courseController.getCoursesList(ctx);
});

router.post('coursesAdd', '/courses/add', async (ctx) => {
  await courseController.addCourse(ctx);
});

module.exports = router;