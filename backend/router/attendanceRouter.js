// 用于管理用户相关的api
const Router = require('koa-router');
const AttendanceController = require('../controller/attendanceController');

const router = new Router();

router.post('attend', '/attend', async (ctx) => {
  await AttendanceController.attend(ctx);
});

module.exports = router;