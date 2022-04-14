const attendDA = require('../database/attendance');

async function attend(ctx) {
  const records = ctx.request.body;
  const { username } = ctx.state.user;
  const date = new Date();
  await attendDA.addAttendance({ username, date, ...records });
}
module.exports = {
  attend,
};