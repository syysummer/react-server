const {ChatModel} = require("../db/models");

module.exports = function (server) {
    // 得到IO对象
    const io = require('socket.io')(server);
    // 监视连接(当有一个客户连接上时回调)
    io.on('connection', function (socket) {
        // console.log('浏览器与服务器连接成功~');
        // 绑定sendMsg监听, 接收客户端发送的消息
        socket.on('sendMsg', function ({content,from,to}) {
            console.log('服务器接收到浏览器的消息',{content,from,to});
        const chat_id = [from,to].sort().join("_");
        const create_time = Date.now();
        new ChatModel({content,from,to,chat_id,create_time}).save(function (err,chatMsg){
            // 全局发送聊天消息,只要连接了的都可以接收
            // 向客户端发送消息(名称, 数据)
         io.emit('receiveMsg',chatMsg);
          // console.log('服务器向浏览器发送消息',chatMsg)
        })
        });
    })
};