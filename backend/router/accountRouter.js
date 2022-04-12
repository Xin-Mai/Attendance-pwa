// 用于管理用户相关的api
const Router = require('koa-router');
const AccountControllor = require('../controllor/accountControllor');

const router = new Router();

router.post('login', '/login', async ( ctx ) => {
  console.log('login');
  await AccountControllor.login(ctx);
});

router.post('signup', '/signup', async ( ctx ) => {
  await AccountControllor.signup(ctx);
});

module.exports = router;