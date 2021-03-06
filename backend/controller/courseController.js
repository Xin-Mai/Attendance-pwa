const courseDA = require('../database/courses');
const rotaDA = require('../database/rota');
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

async function removeCourse(ctx) {
  const { username } = ctx.state.user;
  const { course } = ctx.request.body;
  await courseDA.removeCourse({ username, course });
}

async function updateCourse(ctx) {
  const { username } = ctx.state.user;
  const courseInfo = ctx.request.body;
  await courseDA.updateCourse({ username, courseInfo });
}

async function getCoursesList(ctx) {
  const { username } = ctx.state.user;
  const courseList  =  await courseDA.getCoursesList({ username });
  setStatus(ctx, 200, courseList);
}

async function getClassRota(ctx) {
  const { username } = ctx.state.user;
  const { course, className } = ctx.request.body;
  const rota = await rotaDA.getClassRota({ username, course, className });
  setStatus(ctx, 200, rota);
}

async function setRota(ctx) {
  const { username } = ctx.state.user;
  const { course, className, rota } = ctx.request.body;
  await rotaDA.setRota({ username, course, className }, rota);
  setStatus(ctx, 200);
}

async function addClass(ctx) {
  const { username } = ctx.state.user;
  const { course, className } = ctx.request.body;
  await courseDA.addClass({ username, course, className });
  setStatus(ctx, 200);
}

async function removeClass(ctx) {
  const { username } = ctx.state.user;
  const requestBody = ctx.request.body;
  if (requestBody instanceof Array) {
    await courseDA.removeManyClass(username, requestBody);
  } else {
    const { course, className } = requestBody;
    await courseDA.removeClass({ username, course, className });
  }
  setStatus(ctx, 200, 'remove class success');
}

async function updateClass(ctx) {
  const { username } = ctx.state.user;
  const updateInfo = ctx.request.body;
  await courseDA.updateClass({ username, ...updateInfo });
  setStatus(ctx, 200, 'update class success');
}

module.exports = {
  addCourse,
  removeCourse,
  updateCourse,
  getCoursesList,
  getClassRota,
  setRota,
  addClass,
  removeClass,
  updateClass,
};
