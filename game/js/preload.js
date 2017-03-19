var SideScroller  = SideScroller || {};

SideScroller.Preload = function(){};

SideScroller.Preload.prototype = {
	preload: function() {
		//tilemaps
		this.load.tilemap('level1', 'assets/tilemaps/stage1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('level2', 'assets/tilemaps/stage2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('level3', 'assets/tilemaps/stage3.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('gameover', 'assets/tilemaps/gameover.json', null, Phaser.Tilemap.TILED_JSON);

		//tilesets
		this.load.image('gameTiles', 'assets/images/platformertiles.png');
		this.load.image('jungleTiles', 'assets/images/jungle.png');
		this.load.image('scifiTiles', 'assets/images/scifi_platformTiles_32x32.png');
		this.load.image('caveTiles', 'assets/images/platformertiles_redone.png');

		//spritesheets
		this.load.spritesheet('powerup', 'assets/images/powerup.png', 32, 32);
		this.load.atlas('player', 'assets/images/spritesheet.png', 'assets/atlas/sprites.json');
		this.load.atlas('enemy', 'assets/images/enemy.png', 'assets/atlas/enemy.json');
		this.load.atlas('enemy_shoot', 'assets/images/enemy.png', 'assets/atlas/enemy_shoot.json');
		this.load.atlas('hud_icons', 'assets/images/hud_icons.png', 'assets/atlas/hud_icons.json');
		this.load.image('bullet', 'assets/images/bullet.png');
		this.load.image('enemybullet', 'assets/images/enemybullet.png');

		//menu items
		this.load.image('quit', 'assets/images/quit.png');
		this.load.image('savenquit', 'assets/images/savenquit.png');
		this.load.image('resume', 'assets/images/resume.png');
		this.load.image('volumeup', 'assets/images/volume_up.png');
		this.load.image('volumedown', 'assets/images/volume_down.png');

		//music
		this.load.audio('backgroundmusic', 'assets/audio/musicStage2.ogg');

		//sfx
		this.load.audio('shoot', 'assets/audio/shoot.mp3');
		this.load.audio('pickup', 'assets/audio/pickupShield.mp3');
		this.load.audio('gameoversfx', 'assets/audio/gameover.mp3');
		this.load.audio('death', 'assets/audio/die.mp3');

		this.game.playerLives = SideScroller.playerLives;
	},

	create: function() {
		this.state.start('Stage'+SideScroller.stage);
	}
};