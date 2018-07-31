let express = require('express');
let router = express.Router();
const md5 = require('blueimp-md5');

let {UserModel,ChatModel} = require("../db/models");
const filter = {password:0,__v:0};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*创建注册路由*/
router.post('/register',function(req,res) {
    const {username,password,type} = req.body;
    res.setHeader("Access-Control-Allow-Origin","*");
    UserModel.findOne({username},function (error,user){
    if(user){
        //已经注册过返回失败的响应
        res.send({
            "code":1,
            "msg":"您的账号已注册"
        })
    }else{
       //没有找到,说明没有注册过,将用户信息保存到数据库中
        new UserModel({username, password:md5(password),type}).save(function (error,user) {
            // 向浏览器返回一个user_id的cookie
            res.cookie('user_id', user._id, {maxAge: 1000*60*60*24*7});
            res.send({
                "code": 0,
                "data": {username,type, _id: user._id}
            })
        })
    }
    })
});

/*创建登录路由*/
router.post('/login', function(req,res) {
    const {username,password} = req.body;
    UserModel.findOne({username,password:md5(password)},filter,function (error,user){
        if(user){
            //登录成功返回成功的响应
            res.cookie('user_id', user._id, {maxAge: 1000*60*60*24*7});
            res.send({
                "code": 0,
                "data":user
            })
        }else{
            //登录失败返回失败的响应
            res.send({
                "code": 1,
                "msg": "用户名或密码错误"
            })
        }
    })
});

/*创建用户更新路由*/
// 更新用户路由
router.post('/update', function (req, res) {
    // 得到请求cookie的user_id
    const user_id = req.cookies.user_id;
    if(!user_id) {// 如果没有, 说明没有登陆过, 直接返回提示
        return res.send({code: 1, msg: '请先登陆'});
     }

// 更新数据库中对应的数据
UserModel.findByIdAndUpdate({_id: user_id}, req.body, function (err, user) {// user是数据库中原来的数据
    //user 为更新之前的user
    const {_id, username, type} = user;
    // node端 ...不可用
    // const data = {...req.body, _id, username, type}
    // 合并用户信息
    const data = Object.assign(req.body, {_id, username, type});
    // assign(obj1, obj2, obj3,...) // 将多个指定的对象进行合并, 返回一个合并后的对象
    res.send({code: 0, data})
})
});

// 根据cookie获取对应的user
router.get('/user', function (req, res) {
    // 取出cookie中的user_id
    const user_id = req.cookies.user_id;
    if(!user_id) {
        return res.send({code: 1, msg: '请先登陆'})
    }

    // 查询对应的user
    UserModel.findOne({_id: user_id}, filter, function (err, user) {
        return res.send({code: 0, data: user})
    })
});

/*
查看用户列表
 */
router.get('/userlist',function(req, res){
    const {type} = req.query;
    UserModel.find({type},function(err,users){
        return res.send({code:0, data: users})
    })
});

/*
获取当前用户所有相关聊天信息列表
 */
router.get('/msglist', function (req, res) {
    // 获取cookie中的user_id
    const user_id = req.cookies.user_id
    // 查询得到所有user文档数组
    UserModel.find(function (err, userDocs) {
        // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象
        const users = {} // 对象容器
        userDocs.forEach(doc => {
            users[doc._id] = {username: doc.username, header: doc.header}
        })
        /*
        查询user_id相关的所有聊天信息
         参数1: 查询条件
         参数2: 过滤条件
         参数3: 回调函数
        */
        ChatModel.find({'$or': [{from: user_id}, {to: user_id}]}, function (err, chatMsgs) {
            // 返回包含所有用户和当前用户相关的所有聊天消息的数据
            res.send({code: 0, data: {users, chatMsgs}})
        })
    })
})

/*
修改指定消息为已读
 */
router.post('/readmsg', function (req, res) {
    // 得到请求中的from和to
    const from = req.body.from
    const to = req.cookies.user_id
    /*
    更新数据库中的chat数据
    参数1: 查询条件
    参数2: 更新为指定的数据对象
    参数3: 是否1次更新多条, 默认只更新一条
    参数4: 更新完成的回调函数
     */
    ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
        console.log('/readmsg', doc)
        res.send({code: 0, data: doc.nModified}) // 更新的数量
    })
})





module.exports = router;

