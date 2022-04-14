function setStatus(ctx, code, body, message) {
  ctx.response.status = code;
  if (body) {
    ctx.response.body = body;
  }
  if (message) {
    ctx.response.message = message;
  }
}

module.exports = {
  setStatus,
};