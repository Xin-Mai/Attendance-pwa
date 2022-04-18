const { setStatus } = require('../common/utils');
const attendDA = require('../database/attendance');

async function attend(ctx) {
  const records = ctx.request.body;
  const { username } = ctx.state.user;
  const date = new Date();
  await attendDA.addAttendance({ username, date, ...records });
  setStatus(ctx, 200);
}

async function getHistory(ctx) {
  const { username } = ctx.state.user;
  const { course, className } = ctx.request.body;
  const history = await attendDA.getHistory({ username, course, className });
  setStatus(ctx, 200, history);
}

async function getRecord(ctx) {
  const { username } = ctx.state.user;
  const info = ctx.request.body;
  const record = await attendDA.getRecord({ username, ...info });
  setStatus(ctx, 200, record);
}

module.exports = {
  attend,
  getHistory,
  getRecord,
};