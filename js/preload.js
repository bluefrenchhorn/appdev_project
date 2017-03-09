var SideScroller  = SideScroller || {};

SideScroller.Preload = function(){};

SideScroller.Preload.prototype = {
	preload: function() {
		this.load.tilemap('level1', 'assets/level1-test.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('gameTiles', 'assets/platformertiles.png');
		this.load.image('jungleTiles', 'assets/jungle.png');
		this.load.atlas('player', 'assets/spritesheet.png', 'assets/sprites.json');
		this.load.image('bullet', 'assets/bullet.png');
	},

	create: function() {
		this.state.start('Game');
	}
};