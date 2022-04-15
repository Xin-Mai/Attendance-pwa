const UserDA = require('../database/user');
const jwt = require('jsonwebtoken');
const { ENCRYPTION_KEY } = require('../common/cryp');

async function signup(ctx) {
  const { username, password } = ctx.request.body;
  console.log('signup:', ctx.request.body);
  await UserDA.singup({ username, password }).then((val) => {
    ctx.response.body = val;
    // const token = jwt.sign({
    //   username,
    // });
  }).catch((err) => {
    ctx.throw(400, err);
  });
}

async function login(ctx) {
  const loginInfo = ctx.request.body;
  await UserDA.login(loginInfo).then((val) => {
    const payload = {
      username: val.username,
      id: val._id.toString(),
    };
    let token = '';
    if (loginInfo.remember) {
      token = jwt.sign(payload, ENCRYPTION_KEY, { expiresIn: '30 days' });
      ctx.cookies.set('token', token, {
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: false,
      });
    } else {
      token = jwt.sign(payload, ENCRYPTION_KEY, { expiresIn: '1 days' });
      ctx.cookies.set('token', token, {
        maxAge: -1,
        httpOnly: false,
      });
    }
    ctx.body = token;
  }).catch((err) => {
    ctx.throw(400, err);
  });
}

module.exports = {
  login,
  signup,
};
