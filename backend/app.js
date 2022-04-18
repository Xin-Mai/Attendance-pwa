const Koa = require('koa');
const jwt = require('koa-jwt');
const BodyPraser = require('koa-bodyparser');
const router = require('./router/router');
const { ENCRYPTION_KEY } = require('./common/cryp');

const app = new Koa();

app.use(BodyPraser());
// 配置中间件
// app.use(async ( ctx ) => {
//   console.log('body after parse', ctx.request.body, ctx.request.header['content-type']);
//   if (ctx.request.method === 'POST') {
//     // const body = await parsePostData(ctx);
//     ctx.body = ctx.request.body;
//   }
// })

// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(function(ctx, next){
  return next().catch((err) => {
    if (401 == err.statusCode ) {// token 失效
      ctx.code = 401;
      ctx.body = {
        code:401,
        data:null,
        message:'\'token 失效请重新登录'
      };
    } else {
      throw err;
    }
    console.log(ctx.request);
  });
});

app.use(
  jwt({
    secret: ENCRYPTION_KEY,
    cookie: 'token',
    debug: true,
  })
    .unless({ path: [/^\/login/, /^\/signup/]})
);

// app.use(Formidable());
app.use(router.routes());

//监听
app.listen(5000);
console.log('koa serving');