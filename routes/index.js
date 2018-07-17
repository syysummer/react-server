var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/*创建注册路由*/
router.post('/register', function(req,res) {
   const {username,password} = req.body;
   const user = {_id:"abc",username,password};
   if(username === "admin"){
      res.send({code:1,msg:"您的用户名已存在,请重新注册"})
   }else{
      res.send({code:0,data:user})
   }
});


module.exports = router;
