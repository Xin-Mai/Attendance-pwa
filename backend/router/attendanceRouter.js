// 用于管理用户相关的api
const Router = require('koa-router');
const AttendanceController = require('../controller/attendanceController');

const router = new Router();

router.post('attend', '/attend/add', async (ctx) => {
  await AttendanceController.attend(ctx);
});

router.post('attendHistory', '/attend/history', async (ctx) => {
  await AttendanceController.getHistory(ctx);
});

router.post('attendRecord', '/attend/record', async (ctx) => {
  await AttendanceController.getRecord(ctx);
});

router.post('modifyHistory', '/attend/modify', async (ctx) => {
  await AttendanceController.modifyHistory(ctx);
});

module.exports = router;