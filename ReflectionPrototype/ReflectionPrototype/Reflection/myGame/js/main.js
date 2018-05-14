var game = new Phaser.Game(1000, 700, Phaser.AUTO, 'game');
var topPlatforms;
var platform;
var player;
var spaceKey;
var badP;
var mirrorPlatforms;
var badPlatforms;
var music;
var breakSound;
var musicPlaying=0;
var countCollision=0;

var MainMenu= function(game){};
MainMenu.prototype = 
{
	preload: function()
	{
		console.log('MainMenu: preload');
		game.load.audio('music', 'assets/audio/Supercollider song (draft).wav');
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
//preload assets
var GamePlay = function(game){};
GamePlay.prototype = 
{
preload: function() 
{
	game.load.image('space', 'assets/img/sky.png');
	game.load.image('mirror', 'assets/img/waterBack.png')
	game.load.image('goodP', 'assets/img/mirrorLog_main.png');
	game.load.image('mirrorGoodP', 'assets/img/Log_main.png');
	game.load.image('mirrorBadP', 'assets/img/Trick_log.png');
	game.load.image('waterAnim', 'assets/img/Water_main.png');
	game.load.image('badP', 'assets/img/badPlatform.png');
	game.load.audio('break', 'assets/audio/Branch Break.wav');
	//game.load.audio('music', 'assets/audio/Supercollider song (draft).wav');
	game.load.spritesheet('dude', 'assets/img/blob.png', 32, 28);
},
//place your assets
create: function() 
{
	breakSound = game.sound.add('break');
	space = game.add.tileSprite(0, 0, 1024, 1024, 'space');
	lake = game.add.tileSprite(0, 350, 1024, 1024, 'mirror');
	//creates basic world
	//enables Arcade Physics system
	game.physics.startSystem(Phaser.Physics.ARCADE)
	//platform group contains ground and 2 ledges to jump on
	topPlatforms = game.add.group();
	//enables physics for any object that is created in this group
	topPlatforms.enableBody = true;
	//mirrorPlatforms = game.add.group();
	badPlatforms= game.add.group();
	badPlatforms.enableBody = true;
	water = game.add.tileSprite(0, 30, 1000, 1000, 'waterAnim');
	mirrorPlatforms = game.add.group();
	//spacebar
	//register keys
	spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	//stop keys from propagating up to the browser
	game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

	//creates player
	//player and player settings, numbers = position in game
	player = game.add.sprite(500, 150, 'dude');
	//enables physics on player
	game.physics.arcade.enable(player);
	//player physics properties. gives a slight bounce
	player.body.bounce.y = 0;
	player.body.gravity.y = 300;
	//player.body.collideWorldBounds= true;

	player.animations.add('right', [1], 15, true);
	player.animations.add('left', [0], 15, true);

	//starting ground
	platform = topPlatforms.create(400, 318, 'goodP');
	mirrorPlatform= mirrorPlatforms.create(400, 350, 'mirrorGoodP');
	ledge =topPlatforms.create(200, 218, 'goodP');
	mirrorLedge = mirrorPlatforms.create(200, 450, 'mirrorGoodP');
	three = badPlatforms.create(600, 218, 'goodP');
	mirrorThree = mirrorPlatforms.create(600, 450, 'mirrorBadP');
	four = badPlatforms.create(0, 118, 'goodP');
	mirrorFour = mirrorPlatforms.create(0, 550, 'mirrorBadP');
	five = topPlatforms.create(400, 118, 'goodP');
	mirrorFive = mirrorPlatforms.create(400, 550, 'mirrorGoodP');
	six = topPlatforms.create(800, 118, 'goodP');
	mirrorSix = mirrorPlatforms.create(800, 550, 'mirrorGoodP');
	seven = badPlatforms.create(200, 18, 'goodP');
	mirrorSeven = mirrorPlatforms.create(200, 650, 'mirrorBadP');
	eight = topPlatforms.create(600, 18, 'goodP');
	mirrorEight = mirrorPlatforms.create(600, 650, 'mirrorGoodP');
	ledge.body.immovable = true;
	platform.body.immovable = true;
	five.body.immovable = true;
	six.body.immovable = true;
	eight.body.immovable = true;

},
//run game loop
update: function() 
{
	//console.log(player.y);
	//Collide player with the platforms
	var hitPlatform = game.physics.arcade.collide(player, topPlatforms);
	var fakePlatform = game.physics.arcade.collide(player, badPlatforms);
	//Resets players velocity
	player.body.velocity.x = 0;
	three.x=600;
	four.x=0;
	seven.x=200;
	cursors = game.input.keyboard.createCursorKeys();
	if(cursors.left.isDown && !fakePlatform)
	{
		player.body.velocity.x = -150;
		player.animations.play('left');
	}
	else if(cursors.right.isDown && !fakePlatform)
	{
		player.body.velocity.x = 150;
		player.animations.play('right');
	}
	else
	{
		player.animations.stop();
	}
	//changes gravity
	if(cursors.up.isDown && player.body.touching.down && hitPlatform && !fakePlatform)
	{
		player.body.velocity.y = -270;
	}
	if(fakePlatform && countCollision==0)
	{
		countCollision++;
		breakSound.play();
	}
	if(player.y>=318)
	{
		countCollision=0;
		game.state.start('GameOver');
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
		//displays replay instruction
		scoreText = game.add.text(280, 300, 'Press SPACEBAR to play again', {fontSize: '32px', fill: '#fff'});
	},
	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('MainMenu');
		}
	}
}

game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');