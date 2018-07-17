const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/zhipin_test");

mongoose.connection.on("connected",function (){
  console.log("数据库连接成功!")
});

/*2. 得到对应特定集合的Model*/
// 2.1. 字义Schema(描述文档结构) 创建约束对象
const UserSchema = mongoose.Schema({
    username:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String}
});
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model("users",UserSchema);

// 3. 通过Model或其实例对集合数据进行CRUD操作
// 3.1. 通过Model实例的save()添加数据
function testSave(){
  let userModel = new UserModel({
      username : "Tom",
      password:"123456"
  });
   userModel.save(function(error,user){
     console.log(error,user)
   })
}
// testSave();

// 3.2. 通过Model的find()/findOne()查询多个或一个数据
function testFind(){
    UserModel.findOne({_id:"5b4d8dcefff97425e4c1399c"},function (error,user){
        console.log("findOne",error,user)
    });
    UserModel.find(function (error,users){
        console.log("find",error,users)
    })
}
// testFind();

// 3.3. 通过Model的findByIdAndUpdate()更新某个数据
function testUpdate(){
    UserModel.findByIdAndUpdate({_id:"5b4d8dcefff97425e4c1399c"},{username:"Rose"},function (error,oldUser){
        console.log("update",error,oldUser)
    })
}
// testUpdate();

// 3.4. 通过Model的remove()删除匹配的数据
function testRemove(){
    UserModel.remove({_id:"5b4d8dcefff97425e4c1399c"},function (error,data){
        console.log("update",error,data)
    })
}
testRemove(); //{ ok: 1, n: 1 }
