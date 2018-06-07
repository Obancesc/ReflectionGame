var game = new Phaser.Game(1000, 700, Phaser.CANVAS, 'game', null);
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
var BGCount=0;
var isFacingLeft=false;
var lakeLevelDown=60;

var MainMenu= function(game){};
MainMenu.prototype = 
{
	preload: function()
	{
		console.log('MainMenu: preload');
		game.load.audio('music', 'assets/audio/Supercollider song (draft).wav');
		game.load.image('background', 'assets/img/Background.png');
		game.load.image('mirrorBackground', 'assets/img/waterBack.png')
		game.load.image('goodP', 'assets/img/mirrorLog_main.png');
		game.load.image('mirrorGoodP', 'assets/img/Log_main.png');
		game.load.image('mirrorBadP', 'assets/img/Trick_Log_Final.png');
		game.load.spritesheet('dude', 'assets/img/blob.png', 36, 36);
		game.load.audio('break', 'assets/audio/Branch Break.wav');
		game.load.image('TitleScreen', 'assets/img/Title_Screen.png');
		game.load.image('mirror', 'assets/img/Water_main.png');
		game.load.image('space', 'assets/img/Background_Space.png');
		game.load.spritesheet('rain', 'assets/img/Raindrop_Color2.png', 64, 56);
		game.load.audio('jump', 'assets/audio/Jump Sound.wav');
		game.load.audio('walk', 'assets/audio/Walk Sound.wav');
		game.load.audio('water', 'assets/audio/Water Sound.wav');
		game.load.audio('rain', 'assets/audio/Water Drop Sound.wav');
		game.load.image('gameover', 'assets/img/GameOver_Screen.png');
		game.load.image('logo', 'assets/img/logo.png');
	},
	create: function()
	{
		game.add.tileSprite(0, 0, 1000, 700, 'TitleScreen');
		if(musicPlaying==0)
		{
			music = game.add.audio('music');
			water = game.add.audio('water');
			water.loopFull();
			music.loopFull();
			musicPlaying=1;
		}
		console.log('MainMenu: create');
		titleText = game.add.text(20, 250, 'Press SPACEBAR to play', {fontSize: '38px', fill: '#000'});
		titleText = game.add.text(20, 320, 'LEFT and RIGHT to move', {fontSize: '38px', fill: '#000'});
		titleText = game.add.text(140, 370, 'UP to jump', {fontSize: '38px', fill: '#000'});
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
//place assets
create: function() 
{
	//creates basic world
	//enables Arcade Physics system
	space= game.add.tileSprite(0, 0, 3000, 3000, 'space')
	game.physics.startSystem(Phaser.Physics.ARCADE)
	background = game.add.sprite(0, -2800, 'background');
	//creates platform groups
	//goodPlatforms
	goodPlatforms = game.add.group();
	goodPlatforms.enableBody = true;
	//rain
	var emitter = game.add.emitter(game.world.centerX, 0, 400);
	emitter.width = game.world.width;
	emitter.makeParticles('rain');
	//different sizes
	emitter.minParticleScale = 0.05;
	emitter.maxParticleScale = .2;
	//rain speed
	emitter.setYSpeed(300, 500);
	emitter.setXSpeed(-5, 5);
	//no rotation
	emitter.minRotation = 0;
	emitter.maxRotation = 0;

	emitter.start(false, 1600, 5, 0);

	//badPlatforms
	badPlatforms = game.add.group();
	badPlatforms.enableBody = true;
	//lakeBackground
	mirrorBackground = game.add.tileSprite(0, 520, 1024, 1024, 'mirrorBackground');
	//mirrorGoodPlatforms
	mirrorGoodPlatforms = game.add.group();
	mirrorGoodPlatforms.enableBody = true;
	//mirrorBadPlatforms
	mirrorBadPlatforms = game.add.group();
	mirrorBadPlatforms.enableBody=true;
	mirror= game.add.tileSprite(0, 495, 1024, 1024, 'mirror');
	breakSound= game.sound.add('break');
	jump= game.sound.add('jump');
	walk=game.sound.add('walk');

	scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});

	jumpButton= game.input.keyboard.addKey(Phaser.Keyboard.UP);
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
	//player.animations.add('jump', [2], 15, true);

	//starting ground
	start = goodPlatforms.create(400, 493, 'goodP');
	mirrorStart= mirrorGoodPlatforms.create(400, 525, 'mirrorGoodP');
	mirrorStart.scale.setTo(1, .25);
	start.body.immovable=true;
	//loop for generating first five platforms
	for(var i=0; i<10; i++)
	{
		if(x==800)
		{
			x=200;
			if(count==0)
			{
				y=393;
				my=555;
			}
			else
			{
				y=193;
				my=615;
			}
		}
		else if(x==200)
		{
			x=600;
		}
		else if(x==600)
		{
			x=0;
			if(count==0)
			{
				y=293;
				my=585;
			}
			else
			{
				y=93;
				my=645;
			}
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
		platform.body.height=5;
		platform.body.checkCollision.down=false;
		platform.body.checkCollision.left=false;
		platform.body.checkCollision.right=false;
	}
	game.time.events.add(Phaser.Timer.SECOND * 10, raiseWater, this);
},
//run game loop
update: function() 
{
	if(score>40)
	{
		console.log(background.y);
	}
	//Collide player with the fake platforms
	var fakePlatform= game.physics.arcade.overlap(player, badPlatforms, fadePlatform, null, this);
	//if the player lands on a fake platform, they fall into the water. colliding
	//with fake platform turns off collision with normal platforms
	var hitPlatform = game.physics.arcade.collide(player, goodPlatforms, moveCurrentPlatform, null, this);
	//mirror platforms cancel out with top platforms
	game.physics.arcade.overlap(goodPlatforms, mirrorGoodPlatforms, destroyGoodPlatforms, null, this);
	game.physics.arcade.overlap(badPlatforms, mirrorBadPlatforms, destroyBadPlatforms, null, this);
	if(mirror.y<520)
	{
		if(lakeLevelDown!=60)
		{
			mirror.y+=1.25;
			mirrorBackground.y+=1.25;
			lakeLevelDown+=1;
		}
	}
	else
	{
		lakeLevelDown=60;
	}
	if(timeDelay!=0)
	{
		mirrorBackground.y-=.5;
		mirror.y-=.5;
	}
	waterHeight=mirror.y - 25;
	//Resets players velocity
	player.body.velocity.x = 0;
	//moves background image
	if(BGCount==1)
	{
		if(0<background.y<525)
		{
			space.tilePosition.y+=1;
			background.y+=1;
		}
		else if(background.y>=525)
		{
			space.tilePosition.y+=1;
		}
		else
		{
			background.y+=1;
		}
		game.time.events.add(Phaser.Timer.SECOND * 1, stopScroll, this);
	}
	else
	{
		if(0<background.y<525)
		{
			space.tilePosition.y+=0;
			background.y+=0;
		}
		else if(background.y>=525)
		{
			space.tilePosition.y+=0;
		}
		else
		{
			background.y +=0;
		}
	}
	//programs input keys
	cursors = game.input.keyboard.createCursorKeys();
	if(cursors.left.isDown)
	{
		isFacingLeft=true;
		player.body.velocity.x = -125;
		if(hitPlatform)
		{
			player.animations.play('left');
		}
	}
	else if(cursors.right.isDown)
	{
		isFacingLeft=false;
		player.body.velocity.x = 125;
		if(hitPlatform)
		{
			player.animations.play('right');
		}
	}
	else
	{
		player.animations.stop();
	}
	//press up to jump
	jumpButton.onDown.add(jumpUp, this, null, hitPlatform);

	//platforms move down, and new platforms are generated
	if(player.y<240 && hitPlatform && alreadyMoved==0)
	{
		timeDelay=0;
		game.time.events.add(Phaser.Timer.SECOND * 1, raiseWater, this);
		score+=1;
		scoreText.text= 'Score: ' + score;
		keyDown = true;
		alreadyCounted=0;
		movePlatforms();
	}
	if(countCollision==0 && fakePlatform)
	{
		countCollision++;
		breakSound.play();

	}
	if(player.y>=waterHeight+20)
	{
		timeDelay=0;
		x=800;
		countCollision=0;
		game.state.start('GameOver');
	}
}
}

function jumpUp(hitPlatform)
{
	if(player.body.touching.down && hitPlatform && !isMoving)
	{
		countCollision=0;
		count2=0;
		alreadyMoved=0;
		player.body.velocity.y = -350;
		jump.play();
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
		BGCount=1;
		isMoving=true;
		keyDown=false;
		goodPlatforms.body.velocity.y=100;
		player.body.velocity.y=100;
		alreadyMoved++;
	}
}
//goodPlatforms and mirrorGoodPlatforms are destroyed when they collide with
//each other
function fadePlatform(player, badPlatforms)
{
	badPlatforms.alpha =.2;
	game.time.events.add(Phaser.Timer.SECOND * .25, function(){badPlatforms.alpha=1}, this);
}
function stopScroll()
{
	BGCount=0;
}
function raiseWater()
{
	timeDelay=1;
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
			mirrorPlatform.scale.setTo(1, .25);
			platform.body.checkCollision.down=false;
			platform.body.checkCollision.left=false;
			platform.body.checkCollision.right=false;
		}
		else if(bad==1)
		{
			good=false;
			platform = goodPlatforms.create(x, 0, 'goodP');
			mirrorPlatform = mirrorGoodPlatforms.create(x, 668, 'mirrorGoodP');
			mirrorPlatform.scale.setTo(1, .25);
			platform.body.immovable=true;
			platform.body.checkCollision.down=false;
			platform.body.checkCollision.left=false;
			platform.body.checkCollision.right=false;
		}
		platform.body.moveTo(1000, 92, Phaser.ANGLE_DOWN);
		mirrorPlatform.body.moveTo(1000, 23, Phaser.ANGLE_UP);
		lakeLevelDown=0;
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
		game.add.sprite(0, 0, 'gameover');
		logo= game.add.sprite(200, 575, 'logo');
		logo.scale.setTo(.1, .1);
		logo.angle=90;
		console.log('GameOver: create')
		//displays game over
		//scoreText = game.add.text(400, 200, 'Game Over', {fontSize: '40px', fill: '#fff'});
		scoreText = game.add.text(440, 50, 'Score: '+ score, {fontSize: '32px', fill: '#000'});
		//displays replay instruction
		scoreText = game.add.text(260, 630, 'Press SPACEBAR to play again', {fontSize: '32px', fill: '#000'});
	},
	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			score=0;
			count=0;
			game.state.start('MainMenu');
		}
	}
}

game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');