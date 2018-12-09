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
var port = process.env.PORT || 3000;
    http.listen(port, function(){
      var host = http.address().address;
   	  var port = http.address().port;
   	  console.log('Listening on http://%s:%s', host, port);
    });
var players = {};
io.on('connection', function(socket) {
  playercount++;
  console.log('Some one connected to your page!');
  io.emit('message', "System: Some one connected to this page!");
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
    io.emit('message', "System: "+data+ " has joined the game!");
    io.emit('message', "System: "+playercount+" Online");
    console.log(players[socket.id].name+" has joined the game! ("+playercount+" online)");
    vao = true;
    io.emit('new', players[socket.id].name, socket.id);
    io.to(socket.id).emit('name', players[socket.id].name);
  });
  socket.on('mess', data=>{
  	io.emit('message', data);
  	console.log(data);
  })
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
  	// io.emit('message', "System: Some one has disconnected!");
  	if (!players[socket.id].name) players[socket.id].name='undefined';
  	// if (players[socket.id].name!=undefined) playercount--;
	console.log(players[socket.id].name+" has quit the game! ("+playercount+" online)");
    // players[socket.id].status='off';
    // players[socket.id]=undefined;
    // console.log(players[socket.id]);
    io.emit('message', "System: "+players[socket.id].name+" has quit the game!");
    io.emit('message', "System: "+playercount+" Online");
    io.emit('remove', socket.id, players[socket.id].name);
    // console.log('###################################');
    // console.log(players);
    delete players[socket.id];
    // console.log('\n----TO----\n')
    // console.log(players);
    // console.log(players[socket.id]);
  });
  socket.on('die', (data)=>{
    io.emit('message', data);
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