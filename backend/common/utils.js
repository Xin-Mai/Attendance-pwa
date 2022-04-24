function setStatus(ctx, code, body, message) {
  ctx.response.status = code;
  if (body) {
    ctx.response.body = body;
  } else {
    let res = '';
    switch(code) {
    case 200:
      res = 'OK';
      break;
    default:
      res = '';
    }
    if (res) {
      ctx.response.body = res;
    }
  }
  if (message) {
    ctx.response.message = message;
  }
}

module.exports = {
  setStatus,
};