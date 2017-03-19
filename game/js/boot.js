var SideScroller = SideScroller || {};

SideScroller.Boot = function(){};

SideScroller.Boot.prototype = {
	preload: function() {
		this.stage.disableVisibilityChange = true;
	},

	create: function() {
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.state.start('Preload');
	}
};