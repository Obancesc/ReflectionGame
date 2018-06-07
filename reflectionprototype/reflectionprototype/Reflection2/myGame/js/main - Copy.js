var game = new Phaser.Game(800, 300, Phaser.AUTO, 'game');
var platforms;
var platform;
var player;
var score = 0;
var scoreText;
var spaceKey;
var topVal = 300;
var titleText;
var music;
var space;
var musicPlaying=0;
var thudSound;
var falling;

var MainMenu= function(game){};
MainMenu.prototype = 
{
	preload: function()
	{
		console.log('MainMenu: preload');
		game.load.audio('music', 'assets/audio/electronic.wav');
		game.load.image('space', 'assets/img/deep-space.jpg');
	},
	create: function()
	{
		space = game.add.tileSprite(0, 0, 1024, 1024, 'space');
		if(musicPlaying==0)
		{
			music = game.add.audio('music');
			music.loopFull();
			musicPlaying=1;
		}
		console.log('MainMenu: create');
		titleText = game.add.text(280, 90, 'Gravity Ball', {fontSize: '48px', fill: '#fff'});
		titleText = game.add.text(180, 180, 'Press SPACEBAR to play', {fontSize: '38px', fill: '#fff'});
	},
	update: function()
	{
		space.tilePosition.x += -2;
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			console.log("key pressed");
			game.state.start('GamePlay');
		}
	}
}
var GamePlay = function(game){};
GamePlay.prototype=
{
//preload assets
preload: function() 
{
	game.load.image('space', 'assets/img/deep-space.jpg');
	game.load.image('platform', 'assets/img/metalPlatform.png');
	game.load.audio('thud', 'assets/audio/ballEffect.mp3')
	game.load.spritesheet('dude', 'assets/img/metalBall.png', 32, 32);
},
//place your assets
create: function() 
{
	//creates basic world
	//enables Arcade Physics system
	game.physics.startSystem(Phaser.Physics.ARCADE)
	thudSound= game.sound.add('thud');
	//adds backgorund
	space = game.add.tileSprite(0, 0, 1024, 1024, 'space');
	//platform group contains ground and 2 ledges to jump on
	platforms = game.add.group();
	//enables physics for any object that is created in this group
	platforms.enableBody = true;

	//spacebar
	//register keys
	spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	//stop keys from propagating up to the browser
	game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

	//creates player
	//player and player settings, numbers = position in game
	player = game.add.sprite(50, 150, 'dude');
	//enables physics on player
	game.physics.arcade.enable(player);
	//player physics properties. gives a slight bounce
	player.body.bounce.y = 0;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds= true;
	//running animation for player
	player.animations.add('run', [0, 1, 2, 3], 20, true);
	player.animations.play('run');
	
	//creates scoreText
	scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#fff'});

	//starting ground
	platform = platforms.create(0, 268, 'platform');
	platform.scale.setTo(3.2,1);
	platform.body.immovable = true;
	platform.body.velocity.x= -800;

	//makes new platform every .45 seconds
	game.time.events.repeat(Phaser.Timer.SECOND * .4, 1000, makePlatforms, this);
},
//run game loop
update: function() 
{
	//moves backgorund
	space.tilePosition.x += -10;
	//Collide player with the platforms
	var hitPlatform = game.physics.arcade.collide(player, platforms, setFriction, null, this);
	//Resets players velocity
	player.body.velocity.x = 0;
	//changes gravity
	if(spaceKey.isDown && hitPlatform)
	{
		score+=1
		scoreText.text= 'Score: ' + score;
		if(player.body.gravity.y>0)
		{
			//player goes up
			player.body.gravity.y=-2500;
		}
		else
		{
			//player goes down
			player.body.gravity.y=2500;
		}
	}
	if(!hitPlatform)
	{
		falling=true;
	}
	if(hitPlatform && falling==true)
	{
		falling=false;
		thudSound.play();
	}
	//game over state
	if(player.y>=252 || player.y==0)
	{
		game.state.start('GameOver');
	}
},
}
//makes one platform that spawns at random y position and random size
function makePlatforms()
{
	//platforms.removeAll();
	platform = platforms.create(0, 0, "platform");
	//platforms.add(platform);
	platform.x= 1000;
	if(topVal<100)
	{
		topVal= (Math.random() * 85)+ 184
	}
	else
	{
		topVal= (Math.random() * 84);
	}
	platform.y=topVal;
	platform.scale.setTo((Math.random() * .55) + .55, 1)
	platform.body.velocity.x = -800;
	platform.body.immovable = true;
}
//makes player slide on platforms, rather than get pushed with them
function setFriction(player, platform)
{
	player.body.x -= platform.body.x - platform.body.prev.x;
}

var GameOver= function(game){};
GameOver.prototype=
{
	preload: function()
	{
		console.log('GameOver: preload');
		game.load.image('space', 'assets/img/deep-space.jpg');
	},
	create:function()
	{
		space = game.add.tileSprite(0, 0, 1024, 1024, 'space');
		console.log('GameOver: create')
		//displays game over
		scoreText = game.add.text(300, 75, 'Game Over', {fontSize: '40px', fill: '#fff'});
		//displays score
		scoreText = game.add.text(335, 125, 'Score: '+ score, {fontSize: '32px', fill: '#fff'});
		//displays replay instruction
		scoreText = game.add.text(200, 200, 'Press ENTER to play again', {fontSize: '32px', fill: '#fff'});
	},
	update: function()
	{
		space.tilePosition.x += -2;
		score=0;
		topVal=300;
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
		{
			game.state.start('MainMenu');
		}
	}
}

game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');