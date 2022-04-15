// 用于管理课程列表相关的api
const Router = require('koa-router');
const courseController = require('../controller/courseController');

const router = new Router();

router.get('coursesList', '/courses/list', async (ctx) => {
  await courseController.getCoursesList(ctx);
});

router.post('coursesAdd', '/courses/add', async (ctx) => {
  await courseController.addCourse(ctx);
});

router.post('courseRemove', '/courses/remove', async (ctx) => {
  await courseController.removeCourse(ctx);
});

router.post('courseUpdate', '/courses/update', async (ctx) => {
  await courseController.updateCourse(ctx);
});

router.post('classAdd', '/courses/class/add', async (ctx) => {
  await courseController.addClass(ctx);
});

router.post('classRemove', '/courses/class/remove', async (ctx) => {
  await courseController.removeClass(ctx);
});

router.post('classUodate', '/courses/class/update', async (ctx) => {
  await courseController.updateClass(ctx);
});

module.exports = router;