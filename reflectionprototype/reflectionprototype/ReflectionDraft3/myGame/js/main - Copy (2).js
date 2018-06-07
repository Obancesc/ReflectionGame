var game = new Phaser.Game(1000, 700, Phaser.AUTO, 'game');
var keyDown=false;
var currentPosition=0;
var platformPosition=0;
var isMoving=false;
var alreadyMoved=0;
var alreadyCounted=0;
var count=0;
var count2=0;
var x=800;
var y=318;
var my=350;
var musicPlaying=0;
var good=false;
var countCollision=0;
var bad=0;
var goodMiddle=false;
var goodLeft=false;
var waterHeight=493;
var timeDelay=0;
var score=0;

var MainMenu= function(game){};
MainMenu.prototype = 
{
	preload: function()
	{
		console.log('MainMenu: preload');
		game.load.audio('music', 'assets/audio/Supercollider song (draft).wav');
		game.load.image('background', 'assets/img/sky.png');
		game.load.image('mirror', 'assets/img/waterBack.png')
		game.load.image('goodP', 'assets/img/goodPlatform.png');
		game.load.image('mirrorGoodP', 'assets/img/mirrorGoodPlatform.png');
		game.load.image('mirrorBadP', 'assets/img/mirrorBadPlatform.png');
		game.load.spritesheet('dude', 'assets/img/blob.png', 32, 28);
		game.load.audio('break', 'assets/audio/Branch Break.wav');
	},
	create: function()
	{
		if(musicPlaying==0)
		{
			music = game.add.audio('music');
			music.loopFull();
			musicPlaying=1;
		}
		console.log('MainMenu: create');
		titleText = game.add.text(380, 200, 'Reflection', {fontSize: '48px', fill: '#fff'});
		titleText = game.add.text(270, 300, 'Press SPACEBAR to play', {fontSize: '38px', fill: '#fff'});
		titleText = game.add.text(160, 400, 'LEFT and RIGHT to move, UP to jump', {fontSize: '38px', fill: '#fff'});
	},
	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			console.log("key pressed");
			game.state.start('GamePlay');
		}
	}
}
var GamePlay = function(game){};
GamePlay.prototype = 
{
//preload assets
preload: function() 
{
	/*game.load.image('background', 'assets/img/sky.png');
	game.load.image('mirror', 'assets/img/waterBack.png')
	game.load.image('goodP', 'assets/img/goodPlatform.png');
	game.load.image('mirrorGoodP', 'assets/img/mirrorGoodPlatform.png');
	game.load.image('mirrorBadP', 'assets/img/mirrorBadPlatform.png');
	game.load.spritesheet('dude', 'assets/img/blob.png', 32, 28);
	game.load.audio('break', 'assets/audio/Branch Break.wav');*/
},
//place your assets
create: function() 
{
	//creates basic world
	//enables Arcade Physics system
	game.physics.startSystem(Phaser.Physics.ARCADE)
	background = game.add.tileSprite(0, 0, 1024, 1024, 'background');
	//creates platform groups
	//goodPlatforms
	goodPlatforms = game.add.group();
	goodPlatforms.enableBody = true;
	//badPlatforms
	badPlatforms = game.add.group();
	badPlatforms.enableBody = true;
	//lakeBackground
	mirror = game.add.tileSprite(0, 525, 1024, 1024, 'mirror');
	//mirrorGoodPlatforms
	mirrorGoodPlatforms = game.add.group();
	mirrorGoodPlatforms.enableBody = true;
	//mirrorBadPlatforms
	mirrorBadPlatforms = game.add.group();
	mirrorBadPlatforms.enableBody=true;

	scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#fff'});
	//creates player
	//player and player settings, numbers = position in game
	player = game.add.sprite(500, 450, 'dude');
	//enables physics on player
	game.physics.arcade.enable(player);
	//player physics properties
	player.body.bounce.y = 0;
	player.body.gravity.y = 500;
	player.body.collideWorldBounds= true;
	//player animations
	player.animations.add('right', [1], 15, true);
	player.animations.add('left', [0], 15, true);

	//starting ground
	start = goodPlatforms.create(400, 493, 'goodP');
	mirrorStart= mirrorGoodPlatforms.create(400, 525, 'mirrorGoodP');
	mirrorStart.scale.setTo(1, .25);
	start.body.immovable=true;
	//loop for generating first five platforms
	for(var i=0; i<5; i++)
	{
		//console.log(x);
		if(x==800)
		{
			x=200;
			y=393;
			my=555;
		}
		else if(x==200)
		{
			x=600;
		}
		else if(x==600)
		{
			x=0;
			y=293;
			my=585;
		}
		else if(x==0)
		{
			x=400;
		}
		else
		{
			x=800;
			count++;
		}
		platform = goodPlatforms.create(x, y, 'goodP');
		mirrorPlatform = mirrorGoodPlatforms.create(x, my, 'mirrorGoodP')
		mirrorPlatform.scale.setTo(1, .25);
		platform.body.immovable=true;
	}
	platform2 = goodPlatforms.create(200, 193, 'goodP');
	platform2.body.immovable=true;
	mirrorplatform2 = mirrorGoodPlatforms.create(200, 615, 'mirrorGoodP');
	mirrorplatform2.scale.setTo(1, .25);
	platform3 = goodPlatforms.create(0, 93, 'goodP');
	platform3.body.immovable=true;
	mirrorplatform3 = mirrorGoodPlatforms.create(0, 645, 'mirrorGoodP');
	mirrorplatform3.scale.setTo(1, .25);
	platform4 = goodPlatforms.create(400, 93, 'goodP');
	platform4.body.immovable=true;
	mirrorplatform4 = mirrorGoodPlatforms.create(400, 645, 'mirrorGoodP');
	mirrorplatform4.scale.setTo(1, .25);
	platform5 = goodPlatforms.create(800, 93, 'goodP');
	platform5.body.immovable=true;
	mirrorplatform5 = mirrorGoodPlatforms.create(800, 645, 'mirrorGoodP');
	mirrorplatform5.scale.setTo(1, .25);
	platform6 = goodPlatforms.create(600, 193, 'goodP');
	platform6.body.immovable=true;
	mirrorplatform6 = mirrorGoodPlatforms.create(600, 615, 'mirrorGoodP');
	mirrorplatform6.scale.setTo(1, .25);
	game.time.events.add(Phaser.Timer.SECOND * 1, raiseWater, this);
},
//run game loop
update: function() 
{
	//Collide player with the fake platforms
	//var fakePlatform = game.physics.arcade.collide(player, badPlatforms);
	//if the player lands on a fake platform, they fall into the water. colliding
	//with fake platform turns off collision with normal platforms
	var hitPlatform = game.physics.arcade.collide(player, goodPlatforms, moveCurrentPlatform, null, this);
	//mirror platforms cancel out with top platforms
	game.physics.arcade.overlap(goodPlatforms, mirrorGoodPlatforms, destroyGoodPlatforms, null, this);
	game.physics.arcade.overlap(badPlatforms, mirrorBadPlatforms, destroyBadPlatforms, null, this);
	if(timeDelay!=0)
	{
		mirror.y-=.7;
	}
	waterHeight=mirror.y - 25;
	//Resets players velocity
	player.body.velocity.x = 0;

	//programs input keys
	cursors = game.input.keyboard.createCursorKeys();
	if(cursors.left.isDown)
	{
		player.body.velocity.x = -150;
		player.animations.play('left');
	}
	else if(cursors.right.isDown)
	{
		player.body.velocity.x = 150;
		player.animations.play('right');
	}
	else
	{
		player.animations.stop();
	}
	//press up to jump
	if(cursors.up.isDown && player.body.touching.down && hitPlatform && !isMoving)
	{
		countCollision=0;
		count2=0;
		alreadyMoved=0;
		player.body.velocity.y = -350;
	}

	//platforms move down, and new platforms are generated
	if(player.y<240 && hitPlatform && alreadyMoved==0)
	{
		score+=1;
		scoreText.text= 'Score: ' + score;
		keyDown = true;
		alreadyCounted=0;
		movePlatforms();
	}
	/*if(countCollision==0 && fakePlatform)
	{
		countCollision++;
		breakSound.play();
	}*/
	if(player.y>=waterHeight)
	{
		timeDelay=0;
		x=800;
		countCollision=0;
		game.state.start('GameOver');
	}
}
}
//for some reason, the movePlatform() function won't move the platform the
//player is currently on. This function moves that platform
function moveCurrentPlatform(player, goodPlatforms)
{
	//so it doesn't update currentPosition at every frame
	if(alreadyCounted==0)
	{
		alreadyCounted++;
		currentPosition= goodPlatforms.y;
	}
	//stops platform from moving
	if(goodPlatforms.y>(currentPosition+92))
	{
		isMoving=false;
		goodPlatforms.body.velocity.y=0;
	}
	//if the players y position is less than 100, keyDown becomes true, and
	//the platform the player is currently on will move
	if(keyDown && alreadyMoved==0)
	{
		isMoving=true;
		keyDown=false;
		goodPlatforms.body.velocity.y=100;
		player.body.velocity.y=100;
		alreadyMoved++;
	}
}
//goodPlatforms and mirrorGoodPlatforms are destroyed when they collide with
//each other
function raiseWater()
{
	timeDelay++;
}
function destroyGoodPlatforms(goodPlatforms, mirrorGoodPlatforms)
{
	goodPlatforms.kill();
	mirrorGoodPlatforms.kill();
}
//badPlatforms and mirrorBadPlatforms are destroyed when they collide with
//each other
function destroyBadPlatforms(badPlatforms, mirrorBadPlatforms)
{
	badPlatforms.kill();
	mirrorBadPlatforms.kill();
}
//moves all the top platforms down 92 spaces, and the mirror platforms up 92 spaces
function movePlatforms()
{
	goodPlatforms.forEachAlive(function(platform)
	{
		platform.body.moveTo(1000, 92, Phaser.ANGLE_DOWN);
	});
	badPlatforms.forEachAlive(function(badPlatform)
	{
		badPlatform.body.moveTo(1000, 92, Phaser.ANGLE_DOWN);
	});
	mirrorGoodPlatforms.forEachAlive(function(mirrorGoodPlatform)
	{
		mirrorGoodPlatform.body.moveTo(1000, 23, Phaser.ANGLE_UP);
	})
	mirrorBadPlatforms.forEachAlive(function(mirrorBadPlatform)
	{
		mirrorBadPlatform.body.moveTo(1000, 23, Phaser.ANGLE_UP);
	})
	//makes new platforms
	if(count2==0)
	{
		count2++;
		makePlatforms();
	}
}
function makePlatforms()
{
	for(var i=0; i<1; i++)
	{
		if(x==800)
		{
			x=200;
			i--;
		}
		else if(x==200)
		{
			if(bad==0)
			{
				good=true;
				goodMiddle=true;
			}
			x=600;
		}
		else if(x==600)
		{
			if(bad==0)
			{
				goodMiddle=true;
			}
			x=0;
			i--;
		}
		else if(x==0)
		{
			if(bad==0)
			{
				good=true;
			}
			x=400;
			i--;
		}
		else
		{
			if(bad==0)
			{
				good=true;
				goodLeft=true;
			}
			x=800;
		}
		//randomly generates a 1 or 0. if it's 0, a bad platform will generate
		//if it's 1, a good platform will generate
		if(goodMiddle && x==400)
		{
			goodMiddle=false;
			bad=1;
		}
		else if(goodLeft && x==200)
		{
			goodLeft=false;
			bad=1;
		}
		else if(good)
		{
			bad=1;
		}
		else
		{
			bad= Math.floor(Math.random()*2);
		}
		if(bad==0)
		{
			platform = badPlatforms.create(x, 0, 'goodP');
			mirrorPlatform = mirrorBadPlatforms.create(x, 668, 'mirrorBadP');
			mirrorPlatform.scale.setTo(1, .25);
		}
		else if(bad==1)
		{
			good=false;
			platform = goodPlatforms.create(x, 0, 'goodP');
			mirrorPlatform = mirrorGoodPlatforms.create(x, 668, 'mirrorGoodP');
			mirrorPlatform.scale.setTo(1, .25);
			platform.body.immovable=true;
		}
		platform.body.moveTo(1000, 92, Phaser.ANGLE_DOWN);
		mirrorPlatform.body.moveTo(1000, 23, Phaser.ANGLE_UP);
		mirror.y+=60;
		if(mirror.y>525)
		{
			mirror.y=525;
		}
	}
}
var GameOver= function(game){};
GameOver.prototype=
{
	preload: function()
	{
		console.log('GameOver: preload');
	},
	create:function()
	{
		console.log('GameOver: create')
		//displays game over
		scoreText = game.add.text(400, 200, 'Game Over', {fontSize: '40px', fill: '#fff'});
		scoreText = game.add.text(440, 300, 'Score: '+ score, {fontSize: '32px', fill: '#fff'});
		//displays replay instruction
		scoreText = game.add.text(270, 400, 'Press SPACEBAR to play again', {fontSize: '32px', fill: '#fff'});
	},
	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			score=0;
			game.state.start('MainMenu');
		}
	}
}

game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');