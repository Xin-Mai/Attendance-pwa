const Koa = require('koa');
const BodyPraser = require('koa-bodyparser');
const router = require('./router/router');

const app = new Koa();
const praser = new BodyPraser();

// 配置中间件
app.use(async ( ctx, next ) => {
  console.log(ctx.request.path+':'+ctx.request.method);
  await next();
})
app.use(praser);
app.use(router.routes());
//监听
app.listen(5000);
console.log('koa serving');