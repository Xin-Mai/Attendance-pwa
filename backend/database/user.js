const { mongoose } = require('./db.js');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const User = mongoose.model('User', userSchema);

// 登录
async function login(userInfo) {
  let { username, password } = userInfo;
  const res = await find({ username, password });
  if (!res) {
    throw new Error('请检查账号与密码是否正确');
    // return '请检查账号与密码是否正确';
  } else {
    return res;
  }
}

// 注册
async function singup(userInfo) {
  if(!userInfo.username) return;
  const res = await find({ username: userInfo.username });
  console.log('account:', res);
  if(res) {
    // 转到登录
    throw new Error('user already exists');
  } else {
    // 注册
    await add(userInfo);
    return 'add successful';
  }
}

// 查找账号
async function find(options) {
  const res = await User.findOne(options);
  console.log('find', res);
  return res;
}

// 添加账号
async function add(userInfo) {
  const newUser = new User(userInfo);
  const record = await newUser.save();
  return record;
}
module.exports = {
  login,
  singup
};