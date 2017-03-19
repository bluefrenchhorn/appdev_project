var SideScroller = SideScroller || {};

SideScroller.Stage3 = function(){};

SideScroller.Stage3.prototype = {
	preload: function() {
		this.game.time.advancedTiming = true;
	},

	create: function() {
		this.map = this.game.add.tilemap('level3');
		this.map.addTilesetImage('scifi_platformTiles_32x32', 'scifiTiles');

		this.background = this.map.createLayer('background');
		this.front = this.map.createLayer('front');

		this.background.resizeWorld();

		//collisions
		this.map.setCollisionBetween(246, 252, true, 'front');
		this.map.setCollision(179, true, 'front');

		SideScroller.setTileCollision(this.front, 179, {
			top: true,
			bottom: false,
			left: false,
			right: false
		});

		//powerups

		//load player spawn locations
		this.spawns = SideScroller.findObjectsByType('playerSpawn', this.map, 'obj');
	    this.curSpawn = 0;

		this.player = new SideScroller.Player(this.game, this.spawns[this.curSpawn].x, this.spawns[this.curSpawn].y);

		//jumping through platforms code

		this.game.camera.follow(this.player, null);
		this.game.camera.deadzone = new Phaser.Rectangle(0, 0, this.game.camera.width/2, this.game.camera.height);
	
		this.cameraBlock = new SideScroller.Blocker(this.game, -50, 0);
		this.sweeper = new SideScroller.Blocker(this.game, -100, 0);
		this.bulletBlock = new SideScroller.Blocker(this.game, this.game.camera.width, 0);

		//winzone
		var result = SideScroller.findObjectsByType('endPoint', this.map, 'obj')[0];
		this.winZone = new Phaser.Rectangle(result.x, result.y, result.width, result.height);

		//walking enemies

		//shooting enemies

		//bg music

		this.control = this.game.input.keyboard.addKeys({
			'pause': Phaser.KeyCode.P
		});

		this.game.input.keyboard.onDownCallback = function(event){
			if(event.keyCode == Phaser.KeyCode.P && this.game.paused)
				this.game.paused = false;
		};

		//hud
		this.lives_ind = this.game.add.group();
		for(var i = 0; i < this.game.playerLives; i++) {
			var sprite = this.lives_ind.create((20 * (i+1)) + 60 * i, 20, 'hud_icons', 'life');
			sprite.fixedToCamera = true;
		}
		this.shield_ind = this.game.world.create(20, this.game.camera.height - 80, 'hud_icons', 'shield_inactive');
		this.shield_ind.fixedToCamera = true;
		this.burst_ind = this.game.world.create(100, this.game.camera.height - 80, 'hud_icons', 'burst_inactive');
		this.burst_ind.fixedToCamera = true;
	},

	update: function() {
		//detect if player reached level end
		if (this.winZone.contains(this.player.x + this.player.width/2, this.player.y + this.player.height/2)) {
			this.state.start('Gameover');
			//(TODO): add condition to make sure computer is destroyed
		}

		//platform collisions
		this.game.physics.arcade.collide(this.player, this.front);

		//update player spawn location

		//sweeper to player/enemy collisions
		this.game.physics.arcade.collide(this.cameraBlock, this.player);
	}
};