var SideScroller = SideScroller || {};

SideScroller.Boot = function(){};

SideScroller.Boot.prototype = {
	preload: function() {
		this.stage.disableVisibilityChange = true;
	},

	create: function() {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
//		this.scale.setScreenSize(true);
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.state.start('Preload');
	}
};