const courseDA = require('../database/courses');
const { setStatus } = require('../common/utils');

async function addCourse(ctx) {
  const { course } = ctx.request.body;
  const { username } = ctx.state.user;
  if (!course) {
    setStatus(ctx, 400, null, 'no course name to add');
    return;
  }
  await courseDA.addCourse({ course, username }).then((val) => {
    // console.log('add', val);
    if (typeof val === 'string') {
      setStatus(ctx, 400, val);
    } else {
      setStatus(ctx, 200, { course });
    }
  }).catch((err) => {
    ctx.throw(500, err);
  });
}

async function getCoursesList(ctx) {
  const { username } = ctx.state.user;
  const courseList  =  await courseDA.getCoursesList({ username });
  setStatus(ctx, 200, courseList);
}

async function addClass(ctx) {
  const { username } = ctx.state.user;
  const { course, className } = ctx.request.body;
  await courseDA.addClass({ username, course, className });
  setStatus(ctx, 200);
}

module.exports = {
  addCourse,
  getCoursesList,
  addClass,
};
