function login(ctx) {
  ctx.response.body = 'login success';
  // ctx.throw(404, 'I do it on purpose');
  console.log('login', ctx.response);
}

module.exports = {
  login,
}