const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/zhipin");

mongoose.connection.on("connected",function (){
    console.log("数据库连接成功!")
});

const Schema = mongoose.Schema;
const UserSchema = Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
    header: {type: String}, // 头像名称
    post: {type: String}, // 职位
    info: {type: String}, // 个人或职位简介
    company: {type: String}, // 公司名称
    salary: {type: String} // 工资
});

const UserModel = mongoose.model("users",UserSchema);

exports.UserModel = UserModel;


// 定义chats集合的文档结构
const chatSchema = mongoose.Schema({
    from: {type: String, required: true}, // 发送用户的id
    to: {type: String, required: true}, // 接收用户的id
    chat_id: {type: String, required: true}, // from和to组成的字符串
    content: {type: String, required: true}, // 内容
    read: {type:Boolean, default: false}, // 标识是否已读
    create_time: {type: Number} // 创建时间
});
// 定义能操作chats集合数据的Model
const ChatModel = mongoose.model('chats', chatSchema);
// 向外暴露Model
exports.ChatModel = ChatModel;