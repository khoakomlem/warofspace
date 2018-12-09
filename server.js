var app = require('express')();
    var http = require('http').Server(app);
    var io = require('socket.io')(http);
    var path = require('path');
var playercount=0;
var vao = false;
    // Khởi tạo server
    app.get('/', function(req, res){
      var express=require('express');
      app.use(express.static(path.join(__dirname)));
      res.sendFile(path.join(__dirname, 'index.html'));
    });
    // Mở cổng lắng nghe của socket là 3000
    http.listen(3000, function(){
      console.log('listening on *:3000');
    });
var players = {};
io.on('connection', function(socket) {
  playercount++;
  console.log('Some one connected to your page!');
  players[socket.id]={name:''};
  socket.on('new player', function(data) {
    players[socket.id] = {
      rotation: 0,
      left:false,
      right:false,
      up:false,
      down:false,
      speed:0,
      blood:100,
      name:data
    };
    console.log(players[socket.id].name+" has joined the game! ("+playercount+" online)");
    vao = true;
    io.emit('new', players[socket.id].name, socket.id);
    io.to(socket.id).emit('name', players[socket.id].name);
  });
  // socket.on('')
  socket.on('bullet', (data1,data2,data3,data4,data5,data6)=>{
  	socket.broadcast.emit('shoot', data1,data2,data3,data4,data5,data6);
  });
  socket.on('package', function(data) {
    players[socket.id]=data;
    io.emit('state', players);
  
  });
  socket.on('real', function(data){
  	players[socket.id]=data;
  });
  socket.on('disconnect', ()=>{
  	playercount--;
  	if (!players[socket.id].name) players[socket.id].name='undefined';
  	// if (players[socket.id].name!=undefined) playercount--;
	console.log(players[socket.id].name+" has quit the game! ("+playercount+" online)");
    // players[socket.id].status='off';
    // players[socket.id]=undefined;
    // console.log(players[socket.id]);
    io.emit('remove', socket.id, players[socket.id].name);
    console.log('###################################');
    console.log(players);
    delete players[socket.id];
    console.log('\n----TO----\n')
    console.log(players);
    // console.log(players[socket.id]);
  });
  socket.on('die', (data)=>{
  	delete players[socket.id];
  	io.emit('kill', data, socket.id);
  })
});

// setInterval(function() {
  // if (vao)
  // io.emit('state', players);
// }, 10);
setInterval(function(){
	if (vao)
  	io.emit('real', players);
},1000/60);