var SideScroller  = SideScroller || {};

SideScroller.Preload = function(){};

SideScroller.Preload.prototype = {
	preload: function() {
		this.load.tilemap('level1', 'assets/stage1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('level2', 'assets/stage2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('gameTiles', 'assets/platformertiles.png');
		this.load.image('jungleTiles', 'assets/jungle.png');
		this.load.image('scifiTiles', 'assets/scifi_platformTiles_32x32.png');
		this.load.image('caveTiles', 'assets/platformertiles_redone.png');
		this.load.spritesheet('powerup', 'assets/powerup.png', 32, 32);
		this.load.atlas('player', 'assets/spritesheet.png', 'assets/sprites.json');
		this.load.atlas('tank', 'assets/tank.png', 'assets/tank.json');
		this.load.atlas('enemy', 'assets/enemy.png', 'assets/enemy.json');
		this.load.image('bullet', 'assets/bullet.png');
		this.load.image('enemybullet', 'assets/enemybullet.png')
		this.load.audio('backgroundmusic', 'assets/musicStage2.ogg');

		this.game.playerLives = 9999;
	},

	create: function() {
		this.state.start('Stage1');
	}
};