const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');

//连接本地数据库
const db = mongoose.connection;
// 连接成功
db.on('open', function(){
  console.log('MongoDB Connection Successed');
});
// 连接失败
db.on('error', function(){
  console.log('MongoDB Connection Error');
});

module.exports = {
  mongoose,
  db
};