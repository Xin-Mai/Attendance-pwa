// 用于管理用户相关的api
const Router = require('koa-router');
const AccountControllor = require('../controllor/accountControllor');

const router = new Router();

router.post('login', '/login', ( ctx ) => {
  AccountControllor.login(ctx);
});
module.exports = router;