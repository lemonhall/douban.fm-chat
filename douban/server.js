var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(9000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
//得到当前我参加的房间名
//为了防止作弊，所以放在服务端
//另外，用户默认会在大厅里，大厅的房间名就是''，空字符串
var getRoomIamIn=function(socket){
    var rooms_i_am_in=io.sockets.manager.roomClients[socket.id];
    var my_room='';
      Object.keys(rooms_i_am_in)
        .forEach(function(key){
            if(key){
                my_room=key;
            }
        });
      //console.log(my_room);
      my_room=my_room.substring(1);
    return my_room;
},leaveOtherRoom=function(socket){
    var room=getRoomIamIn(socket);
    var re=false;
    //得到当前用户加入的房间，离开当前房间
    //该函数为辅助join_room。。。event所用
    if(room){
      socket.leave(room);
      re=true;
    }else{
      re=true;
    }
    return re;
};


io.sockets.on('connection', function (socket) {
  
  //响应客户端发起的加入某个房间的请求
  //在加入某个房间前，可能需要先推出它之前所在的房间
  socket.on('join_room', function (data) {
      //socket.emit('news', {my:"Hello"});
      //首先先退干净房间，然后再加入房间
      if(leaveOtherRoom(socket)){
        socket.join(data);
      }
      //console.log(io.sockets.manager.rooms);
  });
  //由client发起的message，服务器负责转发给所有的客户端
  //包括它自己，过滤则有客户端自己完成，以免形成echo的现象
  socket.on('message', function (data) {
      //socket.emit('news', {my:"Hello"});
      //socket.broadcast.emit(,data);
      
      console.log(io.sockets.manager.rooms);

      var room=getRoomIamIn(socket);
      //room的内部表达形式是"/room_name"，结果调用的时候你得去掉那个slash
          console.log(room);
      //永远不要向大厅''转发任何消息，那是会造成广播风暴的
      if(room){
        io.sockets.in(room).emit('new_message', data);
      }

      console.log(data);
  });
});