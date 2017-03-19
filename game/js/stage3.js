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
	    if (SideScroller.stage == 1) this.curSpawn = SideScroller.checkpoint;

		this.player = new SideScroller.Player(this.game, this.spawns[this.curSpawn].x, this.spawns[this.curSpawn].y);

		//jumping through platforms code
		this.collideFront = true;
		this.map.setTileIndexCallback(179, function(sprite) { 
	    	if (this.collideFront == false && sprite == this.player) return false;
	    	if (this.player.cursors.down.isDown && this.player.cursors.jump.isDown && sprite == this.player) {          
	     		this.collideFront = false;
	     		setTimeout(function(){
	     			this.collideFront = true;
	     		}.bind(this), 500);
	     		return false;
	     	}
	     	return true;           
	    }, this, this.front);

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
		this.shooterEnemies = this.game.add.group();

		result = SideScroller.findObjectsByType('shooterSpawn', this.map, 'obj');
		result.forEach(function(spawn){
			var e = this.shooterEnemies.create(spawn.x, spawn.y, 'enemy_shoot');
			
			e.animations.add('standright', ["standright"], 5, true);
			e.animations.add('standleft', ["standleft"], 5, true);
			e.animations.play('standleft');

			this.game.physics.arcade.enable(e);
			e.body.gravity.y = 1000;
			e.collideWorldBounds = true;

			e.weapon = this.game.add.weapon(30, 'enemybullet');
			e.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
			e.weapon.bulletSpeed = 600;
			e.weapon.fireRate = 2000;
			e.weapon.trackSprite(e, e.width/2, e.height/2);
		}, this);

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
		this.game.physics.arcade.collide(this.shooterEnemies, this.front);

		//update player spawn location
		if (this.curSpawn + 1 < this.spawns.length && this.player.x > this.spawns[this.curSpawn+1].x)
			this.curSpawn += 1;

		//sweeper to player/enemy collisions
		this.game.physics.arcade.collide(this.cameraBlock, this.player);

		//sweeper to bullet collisions
		this.game.physics.arcade.overlap(this.bulletBlock, this.player.weapon.bullets, this.bulletSweepKill);
		this.game.physics.arcade.overlap(this.sweeper, this.player.weapon.bullets, this.bulletSweepKill);
		this.shooterEnemies.children.forEach(function(e){
			this.game.physics.arcade.overlap(this.sweeper, e.weapon.bullets, this.bulletSweepKill);
		}, this);

		//player death to enemy detection
		this.shooterEnemies.children.forEach(function(e){
			this.game.physics.arcade.overlap(this.player, e.weapon.bullets, function(player, bullet){
				player.death(this, this.spawns[this.curSpawn].x, this.spawns[this.curSpawn].y);
				bullet.kill();
			}, null, this);
		}, this);

		//enemy death to player detection
		this.game.physics.arcade.overlap(this.player.weapon.bullets, this.shooterEnemies, function(bullet, enemy) {
			bullet.kill();
			enemy.destroy();
			enemy.weapon.destroy();
		});

		//shooter enemies shoot at player
		this.shooterEnemies.children.forEach(function(e){
			if (e.inCamera) {
				var angle = Math.atan2(e.y - this.player.y, e.x - this.player.x);
				if (angle < 0) {
					angle += 2 * Math.PI;
				}
				angle *= (180/Math.PI);
				e.weapon.fireAtSprite(this.player);
				if (angle >= 353 && angle < 13) {
					e.frameName = 'standleft';
				} else if (angle >= 13 && angle < 38) {
					e.frameName = 'shootleft1';
				} else if (angle >= 38 && angle < 63) {
					e.frameName = 'shootleft2';
				} else if (angle >= 63 && angle < 88) {
					e.frameName = 'shootleft3';
				} else if (angle >= 88 && angle < 113) {
					e.frameName = 'shootright3';
				} else if (angle >= 113 && angle < 138) {
					e.frameName = 'shootright2';
				} else if (angle >= 138 && angle < 163) {
					e.frameName = 'shootright1';
				} else if (angle >= 163 && angle < 188) {
					e.frameName = 'standright';
				} else if (angle >= 188 && angle < 213) {
					e.frameName = 'shootright4';
				} else if (angle >= 213 && angle < 238) {
					e.frameName = 'shootright5';
				} else if (angle >= 238 && angle < 263) {
					e.frameName = 'shootright6';
				} else if (angle >= 263 && angle < 288) {
					e.frameName = 'shootleft6';
				} else if (angle >= 288 && angle < 313) {
					e.frameName = 'shootleft5';
				} else if (angle >= 313 && angle < 338) {
					e.frameName = 'shootleft4';
				} else {
					e.frameName = 'standleft';
				}
			}
		}, this);

		//powerups

		this.player.update();

		if(this.control.pause.isDown) {
			this.game.paused = true;
		}
	}
};