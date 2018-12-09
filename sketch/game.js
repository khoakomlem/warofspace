//asteroid clone (core mechanics only)
//arrow keys to move + x to shoot
var frame=0, wframe=5;
var offline=[];
var sprite=[];
var bullets, bullets2;
var shootable=false;
// var asteroids;
var ship;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;
var package = {
  x:window.innerWidth/2,
  y:window.innerHeight/2,
  left:false,
  right:false,
  up:false,
  down:false,
  speed:0,
  blood:100,
  rotation:0
}
var bg={
  img:'',
  x:0,
  y:0
}
function preload(){
  bulletImage = loadImage("sketch/images/asteroids_bullet.png");
  shipImage = loadImage("sketch/images/asteroids_ship0001.png");
  particleImage = loadImage("sketch/images/asteroids_particle.png");
}
function setup() {
var canv = createCanvas(windowWidth, windowHeight);
canv.parent("main");

ship = createSprite(width/2, height/2);
ship.blood=100;
ship.maxSpeed = 6;
ship.friction = 0.02;
ship.setCollider("circle", 0,0, 20);

ship.addImage("normal", shipImage);
ship.addAnimation("thrust", "sketch/images/asteroids_ship0002.png", "sketch/images/asteroids_ship0007.png");

// asteroids = new Group();
bullets = new Group();
bullets2 = new Group();

// for(var i = 0; i<8; i++) {
//   var ang = random(360);
//   var px = width/2 + 1000 * cos(radians(ang));
//   var py = height/2+ 1000 * sin(radians(ang));
//   // createAsteroid(3, px, py);
//   }

socket.on('name', data=>{
  // alert(data);
  package.name=data;
  ship.name=data;
  // sprite[socket.id].name=data;
})
socket.on('remove', (data1,data2)=>{
  $('#thongbao').prepend(data2+" has quit the game!<br>");
  $('#thongbao').stop().slideDown(1000, '', function(){
    setTimeout(function(){$('#thongbao').stop().slideUp(1000,'',function(){$('#thongbao').html('')});},3000);
  });
  sprite[data1].name='';
  sprite[data1].blood='';
  sprite[data1].remove();
})
socket.on('real', function(data){
  // alert(data);
  if (vao==false) return 0;
  for (var id in data){
    // console.log(data[id]);
    var player=data[id];

    // console.log(sprite);
    if (id!=socket.id){
      if (!sprite[id]){
        sprite[id] = createSprite(player.x, player.y);
        sprite[id].blood=100;
        sprite[id].name=player.name;
        // console.log(sprite[id].name);
        sprite[id].rotation=player.rotation;
        sprite[id].setCollider("circle", 0,0, 20);
        sprite[id].addImage("normal", shipImage);
        sprite[id].addAnimation("thrust", "sketch/images/asteroids_ship0002.png", "sketch/images/asteroids_ship0007.png");
        sprite[id].changeAnimation('normal');
      } else {
        sprite[id].name=player.name;
        sprite[id].blood=player.blood;
        sprite[id].rotation=player.rotation;
        sprite[id].position.x=player.x;
        sprite[id].position.y=player.y;
        // sprite[id].setSpeed(player.speed, player.rotation);
      }
    }
  }
});
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case LEFT_ARROW: // A
      package.left = true;
      break;
    case UP_ARROW: // W
      package.up = true;
      break;
    case RIGHT_ARROW: // D
      package.right = true;
      break;
    case DOWN_ARROW: // S
      package.down = true;
      break;
  }
  });
  document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
      case LEFT_ARROW: // A
        package.left = false;
        break;
      case UP_ARROW: // W
        package.up = false;
        break;
      case RIGHT_ARROW: // D
        package.right = false;
        break;
      case DOWN_ARROW: // S
        package.down = false;
        break;
    }
  });
  bg.img = loadImage('sketch/images/background.jpg');
  socket.on('kill', (data,id)=>{
    $('#thongbao').prepend(data+"<br>");
    $('#thongbao').stop().slideDown(1000, '', function(){
    setTimeout(function(){$('#thongbao').stop().slideUp(1000,'',function(){$('#thongbao').html('')});},3000);
    });
    if (id != socket.id) sprite[id].remove();
  });
  $('#replay').click(function(){
    $('#main').fadeOut(1000);
    $('#a').fadeIn(2000);
    $('#replay').slideUp(1000);
    vao_ed=false;
    ship = createSprite(width/2, height/2);
    ship.blood=100;
    ship.maxSpeed = 6;
    ship.friction = 0.02;
    ship.setCollider("circle", 0,0, 20);

    ship.addImage("normal", shipImage);
    ship.addAnimation("thrust", "sketch/images/asteroids_ship0002.png", "sketch/images/asteroids_ship0007.png");

    // ship = createSprite(width/2, height/2);
    // ship.blood=100;
    // ship.maxSpeed = 6;
    // ship.friction = 0.02;
    // ship.setCollider("circle", 0,0, 20);
    
    // ship.addImage("normal", shipImage);
    // ship.addAnimation("thrust", "sketch/images/asteroids_ship0002.png", "sketch/images/asteroids_ship0007.png");
    // socket.emit('new player', $('#name').val());
  });
//==>setup()
}

function draw() {
  // noLoop();
  frameRate(60);
  // clear();
  // background(bg);
  image(bg.img, 0,0);
  var t=Math.random()*10+40;
  if (t%4==0)
    bg.x++;
  if (t%4==1)
    bg.x--;
  if (t%4==2)
    bg.y++;
  else
    bg.y--;
  fill(254,190,190);
  textAlign(RIGHT);
  textSize(12);
  text("↑ ↓ ← → to move. A to shoot", width-30, 30);
  // for(var i=0; i<allSprites.length; i++) {
  var s = ship;
  if(s.position.x<-MARGIN) s.position.x = width+MARGIN;
  if(s.position.x>width+MARGIN) s.position.x = -MARGIN;
  if(s.position.y<-MARGIN) s.position.y = height+MARGIN;
  if(s.position.y>height+MARGIN) s.position.y = -MARGIN;
  
  
  // asteroids.overlap(bullets, asteroidHit);
  if (ship.name!='§')
  bullets2.overlap(ship, function(e){
    // bullets2.remove();
    // ship.bounce(bullets2);
    e.remove();
    if (ship.name!=undefined) {ship.blood-=e.dame;};
    if (ship.blood<=0){
      socket.emit('die',ship.name+ " has been killed by " + e.name, socket.id);
      $('#replay').slideDown(1000);
      ship.name='§';
      // sprite[socket.id].name='';
      ship.remove();
      // sprite[socket.id].remove();
      delete ship;

      // socket.emit('disconnect', );
    }
    // bullets2.bounce(ship);
  })
  
  if(package.left)
    ship.rotation -= 4;
  if(package.right)
    ship.rotation += 4;
  if(package.up)
    {
    ship.addSpeed(.2, ship.rotation);
    ship.changeAnimation("thrust");
    }
  else
    ship.changeAnimation("normal");
  frame++;
  if(keyDown("A") && shootable && frame>wframe)
    {
      // if (weapon != 'SHOTGUN'){
      var bullet = createSprite(ship.position.x, ship.position.y);
      bullet.addImage(bulletImage);
      switch (weapon){
        case 'AK47':
          bullet.rotat=ship.rotation+Math.random()*7;
          bullet.life = 40;
          bullet.speed=ship.getSpeed()+30;
          bullet.setSpeed(bullet.speed, bullet.rotat);
          socket.emit('bullet', ship.position.x, ship.position.y,bullet.rotat, bullet.speed, ship.name,weapon);
        break;
        case 'GATLIN':
          bullet.rotat=ship.rotation+Math.random()*5;
          bullet.speed=ship.getSpeed()+20;
          bullet.setSpeed(bullet.speed, bullet.rotat);
          bullet.life = 30;
          socket.emit('bullet', ship.position.x, ship.position.y, bullet.rotat, bullet.speed, ship.name,weapon);
        break;
        case 'SHOTGUN':
          for (var j=-3; j<=3; j++) {
            var bullet = createSprite(ship.position.x, ship.position.y);
            bullet.addImage(bulletImage);
            bullet.speed=15+ship.getSpeed();
            bullet.life=20;
            bullet.setSpeed(bullet.speed, ship.rotation+5*j);
            socket.emit('bullet', ship.position.x, ship.position.y, ship.rotation+5*j, bullet.speed, ship.name,weapon);
            bullets.add(bullet);
          }
        break;
        case 'MINE':
          // bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
          bullet.life = 500;
          socket.emit('bullet', ship.position.x, ship.position.y, 0, 0, ship.name,weapon);
        break;
      }
      frame=0;

      if (weapon!='SHOTGUN'){
        bullets.add(bullet); 
      } else bullet.remove();
      // socket.emit('bullet', ship.position.x, ship.position.y, bullet.rotation, ship.getSpeed()+10, ship.name);
      
     // killer=bullets.indexOf(bullet);
    }
  textSize(20);
  for (var id in sprite){
    if (sprite[id].blood>0)
    text(sprite[id].name+' '+Math.floor(sprite[id].blood),sprite[id].position.x-20,sprite[id].position.y-20);
  }

  text(ship.name+' - '+Math.floor(ship.blood), ship.position.x, ship.position.y-20);
  drawSprites();
}

// function createAsteroid(type, x, y) {
//   var a = createSprite(x, y);
//   var img  = loadImage("sketch/images/asteroid"+floor(random(0,3))+".png");
//   a.addImage(img);
//   a.setSpeed(2.5-(type/2), random(360));
//   a.rotationSpeed = .5;
//   //a.debug = true;
//   a.type = type;
  
//   if(type == 2)
//     a.scale = .6;
//   if(type == 1)
//     a.scale = .3;
  
//   a.mass = 2+a.scale;
  // a.setCollider("circle", 0, 0, 50);
//   asteroids.add(a);
//   return a;
// }

// function asteroidHit(asteroid, bullet) {
// var newType = asteroid.type-1;

// if(newType>0) {
//   createAsteroid(newType, asteroid.position.x, asteroid.position.y);
//   createAsteroid(newType, asteroid.position.x, asteroid.position.y);
//   }

// for(var i=0; i<20; i++) {
//   var p = createSprite(bullet.position.x, bullet.position.y);
//   p.addImage(particleImage);
//   p.setSpeed(random(3,5 ), random(360));
//   p.friction = 0.05;
//   p.life = 80;
//   }

// bullet.remove();
// asteroid.remove();
// }

///////////////////////////////   

setInterval(function(){
  package.x=ship.position.x+ship.getSpeed();
  package.y=ship.position.y+ship.getSpeed();
  package.rotation=ship.rotation;
  package.speed=ship.getSpeed();
  package.blood=ship.blood;
  socket.emit('package', package);
  socket.emit('real', package);
},20);

socket.on('new', (data,id)=>{
  $('#thongbao').prepend(data+" has joined the game!<br>");
  $('#thongbao').stop().slideDown(1000, '', function(){
    setTimeout(function(){$('#thongbao').stop().slideUp(1000,'',function(){$('#thongbao').html('')});},4000);
  });
  if (id!=socket.id && sprite[id].name!=undefined){
  sprite[id] = createSprite(width/2, height/2);
  sprite[id].blood=100;
  sprite[id].maxSpeed = 6;
  sprite[id].friction = 0.02;
  sprite[id].setCollider("circle", 0,0, 20);
  
  sprite[id].addImage("normal", shipImage);
  sprite[id].addAnimation("thrust", "sketch/images/asteroids_ship0002.png", "sketch/images/asteroids_ship0007.png");
  }
  ship.weapon=weapon;
    switch (weapon){
      case 'AK47':
      wframe=5;
      ship.friction=0.02;
      break;
      case 'GATLIN':
      ship.friction=0.06;
      wframe=2;
      break;
      case 'SHOTGUN':
      ship.friction=0.04;
      wframe=30;
      break;
      case 'MINE':
      ship.friction=0.01;
      wframe=30;
      break;
    }
    // alert(wframe);
    shootable=true;
});
socket.on('shoot', (data1,data2,data3,data4,data5, data6)=>{
  var bullet = createSprite(data1,data2);
    // socket.emit('bullet', ship.position.x, ship.position.y, ship.rotation, ship.getSpeed()+10);
    bullet.addImage(bulletImage);
    switch (data6){
      case 'AK47':
      bullet.life = 40;
      // bullet.scale=3;
      bullet.dame=Math.random()*5+2;
      break;
      case 'GATLIN':
      bullet.life = 30;
      bullet.dame=Math.random()*3+1;
      break;
      case 'SHOTGUN':
      bullet.life = 20;
      bullet.dame=Math.random()*3+0.5;
      break;
      case 'MINE':
      bullet.life = 500;
      // 
      // bullet.dame=Math.random()*3+0.5;
      break;
    }
    bullet.setSpeed(data4, data3);
    bullet.setCollider("circle", 0, 0, 2);
    bullet.name=data5;
    bullets2.add(bullet);
    // console.log(bullets2[1]);
})