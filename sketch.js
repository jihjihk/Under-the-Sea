var world;
var fishOptions =['silverfish', 'funkyfish','clownfish', 'jellyfish', 'shark', 'starfish'];
var fishes = [];
var ripples = [];
var ouch = [];
var song, youch, touchthat;
var events = {};
var screen;
var cast, tada, drums;
var sebas, yellowfish, daggers;

function preload() {
  song = loadSound("music/underthesea.mp3");
  youch = loadSound("music/youch.mp3");
  touchthat = loadSound("music/touchthat.mp3");

  cast = loadSound("music/cast.wav");
  tada = loadSound("music/tada.mp3");
  drums = loadSound("music/drum.mp3");
}


var blackhole = new Circle({
	x:20,y:-2,z:-20,
  	radius:3,
  	asset:'blackhole',
  	clickFunction: function(black) {
  		open("https://i6.cims.nyu.edu/~jk4704/interactive/virtualmusic/");
  		song.stop();
  	}
});

function setup() {
	noCanvas();
	world = new World('VRScene');
	song.play();

	for(var i = 0; i < 50; i++) {
		whichFish = random(fishOptions);
		
		if (whichFish == 'shark')
			tempScale = 1.5;
		else
			tempScale = 0.5;

		if (whichFish == 'jellyfish')
			tempDir = 0;
		else
			tempDir = 1;
    	
    	var tempFish = new fish(random(-30,-10), random(-10,10), random(-30,-10), tempScale, whichFish.concat('_obj'), whichFish.concat('_mtl'),tempDir);
  		fishes.push(tempFish);
  	}

	for(var j = 0; j < 200; j++) {
    	var tempRipple = new ripple(random(-100,100), -50, random(-100,100));
  		ripples.push(tempRipple);
  	}

  	sebas = new fishInstrument(-20,0,20,'sebas',cast);
  	daggers = new fishInstrument(-5,0,-5,'daggers',tada);
  	yellowfish = new fishInstrument(10,0,10,'yellowfish',drums);

  	ouch.push(youch);
  	ouch.push(touchthat);

  	world.add(blackhole);
}

function draw() {
	for (var i = 0; i < fishes.length; i++) {
		fishes[i].move();
		fishes[i].touch();
	}


  	for(var j = 0; j < ripples.length; j++) {
    	ripples[j].move();
  	}

	if (mouseIsPressed || touchIsDown) {
		world.moveUserForward(0.1);
	}

	blackhole.spinZ(-100);
}

function fish(xPos, yPos, zPos, scale, objname, mtlname, dir) {

	this.container = new Container3D({
	    x: random(-50, 50),
	    y: random(-50, 50),
	    z: random(-50, 50),
	    rotationY: random(360),
	});
	world.add(this.container);

	this.x = xPos;
	this.y = yPos;
	this.z = zPos;

  	this.shape = new OBJ({
  		asset: objname,
		mtl: mtlname,
		x: xPos,
		y: yPos,
		z: zPos,
		scaleX: scale,
		scaleY: scale,
		scaleZ: scale,
		rotationY: 180,
		clickFunction: function(theFish) {
			var which = random(ouch);
  			which.play();
		}
  	});
  	if(objname == "silverfish_obj") {
  		this.shape.rotateZ(-55);
  	}

  	if(objname == "clownfish_obj") {
  		this.shape.rotateY(270);
  	}
  	else {
  		this.shape.rotateY(270);
  	}

  	this.container.addChild(this.shape);

  	this.sensor = new Box({
	    x: 0,
	    y: 0,
	    z: 5,
	    opacity: 0.2
	});
  	this.container.addChild(this.sensor);

  	this.noiseOffset = random(1000);
  	/*
  	this.xOffset = random(200);
	this.yOffset = random(200);
	this.speed = random(0.005, 0.01);

  	world.add(this.shape);

  	this.xOffset = random(1000);
	this.zOffset = random(2000, 3000);
	
  	this.move = function() {
  		if (dir == 1) {
  			var yMovement = 0.01;
			var xMovement = map( noise(this.xOffset), 0, 1, -0.2, 0.2);
			var zMovement = map( noise(this.zOffset), 0, 1, -0.2, 0.2);
			this.xOffset += 0.05;
			this.yOffset += 0.05;
		}
		else {
			var xMovement = 0.01;
			var yMovement = map( noise(this.xOffset), 0, 1, -0.2, 0.2);
			var zMovement = map( noise(this.zOffset), 0, 1, -0.2, 0.2);
			this.xOffset += 0.05;
			this.zOffset += 0.05;
		}
		this.shape.nudge(xMovement, yMovement, zMovement);

		if (this.shape.getX() > 40 || this.shape.getX() <  -40 
			|| this.shape.getY() > 20 || this.shape.getY() < -20
			|| this.shape.getZ() > 40 || this.shape.getZ() < -40) {
			this.shape.setPosition(-this.shape.getX(),-this.shape.getY(),-this.shape.getZ());
		}
  	}
  	*/
  	this.move = function() {
	    var swayAmount = map(noise(this.noiseOffset), 0, 1, -1, 1);
	    this.container.spinY(swayAmount);
	    this.noiseOffset += 0.01;

	    var d = 0.05;

	    // move forward a little bit (this code uses some math that I wrote for the 'moveUserForward' function)

	    // compute the world position of our sensor (not the local position inside of our container)
	    var vectorHUD = new THREE.Vector3();
	    vectorHUD.setFromMatrixPosition(this.sensor.tag.object3D.matrixWorld);

	    // now compute how far off we are from this position
	    var xDiff = vectorHUD.x - this.container.getX();
	    var yDiff = vectorHUD.y - this.container.getY();
	    var zDiff = vectorHUD.z - this.container.getZ();

	    // nudge the container toward this position
	    this.container.nudge(xDiff * d, yDiff * d, zDiff * d);
	    
	    if (this.shape.getX() > 50 || this.shape.getX() <  -50 
			|| this.shape.getY() > 30 || this.shape.getY() < -30
			|| this.shape.getZ() > 50 || this.shape.getZ() < -50) {
			this.container.setPosition(this.shape.getX() * -1,
									this.shape.getY() * -1,
									this.shape.getZ() * -1);
		}
		
  	}

  	this.touch = function() {
  		var user = world.getUserPosition();
  		var distance = dist(user.x, user.y, this.x, this.y);
  		if (distance < 2) {
  			var which = random(ouch);
  			which.play();
  			this.x = random(-5, 5);
  			this.y = random(-2, 2);
  			this.shape.setPosition(this.x, this.y, this.y);
  		}
  	}
}

function ripple(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.speed = random(0.2, 0.5);

	this.shape = new Sphere({
        x: x,
        y: y,
        z: z,
        asset:"ripple-texture",
        radius:random(0.3, 0.5)
    });

	this.xOffset += 0.005;

	world.add(this.shape);

	this.move = function() {
		if (this.y < 50)
			this.y += this.speed;
		else 
			this.y = -50
		this.shape.setPosition(this.x, this.y, this.z);
	}
}

function fishInstrument(x, y, z, image, music) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.shape = new Plane({
	    		x:this.x, y:this.y, z:this.z, 
	    		width: 10, height: 10, 
	    		red:255, green:255, blue:255,
	    		asset: image,
	    		opacity: 1,
	    		transparent: 'true',
	    		side: 'double',
	    		clickFunction: function(fishie) {
	    			music.play();
	    		}
	    	});
	world.add(this.shape);
}