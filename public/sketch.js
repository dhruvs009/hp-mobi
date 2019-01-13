var boxSprite1 = {};
var boxSprite2 = {};
var wallbot;
var wallrside;
var walllside;
var walltop;
var val1=0;
var val2=0;
var valcount1=0;
var valcount2=0;
var bulletImage;
var socket;
var moves2 = [false, false, false];
var moves1 = [false, false, false];
function updateMoves(spell) {
  switch(spell) {
    case 'FORWARD': 
      return 0
    case 'UP':
      return 1
    case 'SIDE':
      return 2
  }
}
function setup(){
  socket = io.connect();
  socket.on('move', function(data) {
    if (data['user'] == 0) {
      moves1[updateMoves(data['spell'])] = true
    }
    else {
      moves2[updateMoves(data['spell'])] = true
    }
    //console.log(data)
  });
  bulletImage = loadImage('http://molleindustria.github.io/p5.play/examples/assets/asteroids_bullet.png')
  //bulletImage = loadImage('fire_ball.png')
  //createCanvas(800,300);
  createCanvas(windowWidth, windowHeight)
  boxSprite1 = createSprite(windowWidth/5, windowHeight/2, 50, 100);
  boxSprite1.shapeColor = color(222, 125, 2);
  boxSprite2 = createSprite(4*windowWidth/5, windowHeight/2, 50, 100);
  boxSprite2.shapeColor = color(255, 0, 0);
  boxSprite1.maxSpeed = 6;
  boxSprite1.friction = 0.1;
  boxSprite2.maxSpeed = 6;
  boxSprite2.friction = 0.1;
  boxSprite1.setCollider('rectangle', 0, 0, 50,100);
  boxSprite2.setCollider('rectangle', 0, 0, 50,100);
  boxSprite2.rotation+=180;
  wallbot = createSprite(width/2, height+30/2, width, 30);
  wallbot.immovable = true;
  walltop = createSprite(width/2, -30/2, width, 30);
  walltop.immovable = true;
  wallrside = createSprite(width + height/2, height/2, height, height);
  wallrside.immovable = true;
  walllside = createSprite(-1*height/2, height/2, height, height);
  wallrside.shapeColor = color(0,255,255)
  walllside.immovable = true;

  bullets1 = new Group();
  bullets2 = new Group();
  shields1 = new Group();
  shields2 = new Group();
  powerbullets1 = new Group();
  powerbullets2 = new Group();
  charac = new Group();
  charac.add(boxSprite1);
  charac.add(boxSprite2);
}
function draw() {
  background(0, 255, 0);
  drawSprites();
  textAlign(CENTER);
  text('AAPKA SWAGAT HAI',400,50);
  if(keyDown(LEFT_ARROW))
    boxSprite1.rotation -= 4;
  if(keyDown(RIGHT_ARROW))
    boxSprite1.rotation += 4;
  if(keyDown(UP_ARROW))
  {
    boxSprite1.addSpeed(0.6, boxSprite1.rotation);
  }
  //Damage 2 bullet P1
  if(keyWentDown('t') || moves1[2] == true)
  {
    var powerbullet1 = createSprite(boxSprite1.position.x, boxSprite1.position.y);
    powerbullet1.addImage(bulletImage);
    powerbullet1.setSpeed(20+boxSprite1.getSpeed(), boxSprite1.rotation);
    powerbullet1.life = 100;
    powerbullets1.add(powerbullet1);
    moves1[2] = false
  }
  //Damage 1 bullet P1
  if(keyWentDown('y') || moves1[0] == true)
  {
    var bullet1 = createSprite(boxSprite1.position.x, boxSprite1.position.y);
    bullet1.addImage(bulletImage);
    bullet1.setSpeed(10+boxSprite1.getSpeed(), boxSprite1.rotation);
    bullet1.life = 100;
    bullets1.add(bullet1);
    moves1[0] = false
  }
  //Shield P1
  if(keyWentDown('u') || moves1[1] == true)
  {
    var shield1 = createSprite(boxSprite1.position.x+40*Math.cos(3.14/180*boxSprite1.rotation), boxSprite1.position.y+40*Math.sin(3.14/180*boxSprite1.rotation), 10,100);
    shield1.immovable=true;
    shield1.rotation=boxSprite1.rotation;
    shield1.life = 200;
    shields1.add(shield1);
    moves1[1] = false
  }

  if(keyDown('a'))
    boxSprite2.rotation -= 4;
  if(keyDown('d'))
    boxSprite2.rotation += 4;
  if(keyDown('w'))
  {
    boxSprite2.addSpeed(0.5, boxSprite2.rotation);
  }
  //Damage 2 bullet P2
  if(keyWentDown('z') || moves2[2] == true)
  {
    var powerbullet2 = createSprite(boxSprite2.position.x, boxSprite2.position.y);
    powerbullet2.addImage(bulletImage);
    powerbullet2.setSpeed(20+boxSprite2.getSpeed(), boxSprite2.rotation);
    powerbullet2.life = 100;
    powerbullets2.add(powerbullet2);
    moves2[2] = false
  }
  //Damage 1 Bullet P2
  if(keyWentDown('x') || moves2[0] == true)
  {
    var bullet2 = createSprite(boxSprite2.position.x, boxSprite2.position.y);
    bullet2.addImage(bulletImage);
    bullet2.setSpeed(10+boxSprite2.getSpeed(), boxSprite2.rotation);
    bullet2.life = 100;
    bullets2.add(bullet2);
    moves2[0] = false
  }
  
  //Shield P2
  if(keyWentDown('c') || moves2[1] == true)
  {
    var shield2 = createSprite(boxSprite2.position.x+40*Math.cos(3.14/180*boxSprite2.rotation), boxSprite2.position.y+40*Math.sin(3.14/180*boxSprite2.rotation), 10,100);
    shield2.immovable=true;
    shield2.rotation=boxSprite2.rotation;
    shield2.life = 400;
    shields2.add(shield2);
    moves2[1] = false
  }
  drawSprites();
  bullets1.bounce(boxSprite2,health2);
  bullets2.bounce(boxSprite1,health1);
  powerbullets1.bounce(boxSprite2,powerhealth2);
  powerbullets2.bounce(boxSprite1,powerhealth1);
  bullets1.bounce(wallbot);
  bullets2.bounce(wallbot);
  charac.bounce(wallbot);
  charac.bounce(walltop);
  charac.bounce(walllside);
  charac.bounce(wallrside);
  bullets1.bounce(shields2,shielddel2);
  bullets2.bounce(shields1,shielddel1);
  charac.bounce(wallbot);
  charac.bounce(walltop);
  charac.bounce(walllside);
  charac.bounce(wallrside);
  powerbullets1.bounce(shields2,powershielddel2);
  powerbullets2.bounce(shields1,powershielddel1);
  text("HITS : "+val2,650,150);
  text("HITS : "+val1,150,150);

  if(val2>=10){

    text("Game Over Player 2 WINS!!!",400,200)
  }
  if(val1>=10){
    text("Game Over Player 1 WINS!!!",400,200)
  }
  
  if(valcount2==2)
  {
    shield2.remove();
  }
  if(valcount1==2)
  {
    shield1.remove();
  }
} 
function shielddel2(bullets1, shield2){
  bullets1.remove();
  valcount2++;
}
function shielddel1(bullets2, shield1){
  bullets2.remove();
  valcount1++;
}
function powershielddel2(powerbullets1, shield2){
  shield2.remove();
  powerbullets1.remove();
}
function powershielddel1(powerbullets2, shield1){
  shield1.remove();
  powerbullets2.remove()
}
function health1(bullets2, boxSprite1){
  val2++;
}
function health2(bullets1, boxSprite2){
  val1++;
}
function powerhealth1(powerbullets2, boxSprite1){
  val2++;
}
function powerhealth2(powerbullets1, boxSprite2){
  val1++;
}
