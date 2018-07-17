const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/zhipin_test");

mongoose.connection.on("connected",function (){
  console.log("数据库连接成功!")
});