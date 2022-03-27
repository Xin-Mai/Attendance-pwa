const UserDA = require('../database/user');

async function signup(ctx) {
  console.log('signup:', ctx.request.body);
  await UserDA.singup(ctx.request.body).then((val) => {
    ctx.response.body = val;
  }).catch((err) => {
    ctx.throw(400, err);
  });
}

async function login(ctx) {
  console.log('login info；', ctx.request.body);
  await UserDA.login(ctx.request.body).then((val) => {
    ctx.response.body = val;
  }).catch((err) => {
    ctx.throw(400, err);
  });
}

module.exports = {
  login,
  signup,
}