// 用于管理用户相关的api
const Router = require('koa-router');
const AccountController = require('../controller/accountController');

const router = new Router();

router.post('login', '/login', async ( ctx ) => {
  console.log('login');
  await AccountController.login(ctx);
});

router.post('signup', '/signup', async ( ctx ) => {
  await AccountController.signup(ctx);
});

module.exports = router;