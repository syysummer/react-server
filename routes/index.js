let express = require('express');
let router = express.Router();
const md5 = require('blueimp-md5');

let {UserModel} = require("../db/models");
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

module.exports = router;

