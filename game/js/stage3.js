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
		this.powerups = this.game.add.group();
		this.powerups.enableBody = true;
		this.map.createFromObjects('obj', 947, 'powerup', 141, true, false, this.powerups);
		this.map.createFromObjects('obj', 908, 'powerup', 102, true, false, this.powerups);

		//load player spawn locations
		this.spawns = SideScroller.findObjectsByType('playerSpawn', this.map, 'obj');
	    this.curSpawn = 0;
	    if (SideScroller.stage == 3) this.curSpawn = SideScroller.checkpoint;

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
		this.game.camera.setPosition(this.spawns[this.curSpawn].x - 100, 0);
		this.game.camera.deadzone = new Phaser.Rectangle(0, 0, this.game.camera.width/2, this.game.camera.height);
	
		this.cameraBlock = new SideScroller.Blocker(this.game, -50, 0);
		this.sweeper = new SideScroller.Blocker(this.game, -100, 0);
		this.bulletBlock = new SideScroller.Blocker(this.game, this.game.camera.width, 0);

		//winzone
		var result = SideScroller.findObjectsByType('endPoint', this.map, 'obj')[0];
		this.winZone = new Phaser.Rectangle(result.x, result.y, result.width, result.height);

		//walking enemies
		this.walkingEnemies = this.game.add.group();
		this.walkingEnemies.createMultiple(20, 'enemy');
		this.walkingEnemies.children.forEach(function(e){
			e.animations.add('standright', ["standright"], 5, true);
			e.animations.add('standleft', ["standleft"], 5, true);
			e.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 8), 5, true);
			e.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 8), 5, true);
			e.animations.play('left');

			this.game.physics.arcade.enable(e);
			e.body.gravity.y = 1000;
			e.collideWorldBounds = true;
		}, this);

		result = SideScroller.findObjectsByType('doubleSpawn', this.map, 'obj')[0];
		this.doubleSpawn = new Phaser.Rectangle(result.x, result.y, result.width, result.height);

		result = SideScroller.findObjectsByType('noSpawn', this.map, 'obj');
		this.noSpawn = [];
		result.forEach(function(zone, i){
			var rect = new Phaser.Rectangle(zone.x, zone.y, zone.width, zone.height);
			this.noSpawn[i] = rect;
		}, this);

		this.game.time.events.loop(2000, function(){
			var level = Math.floor(Math.random() * 2) + 1; 
			if (!this.doubleSpawn.contains(this.game.camera.x + this.game.camera.width, this.spawns[0].y)) level = 1;
			var enemy = this.walkingEnemies.getFirstExists(false);
			if (enemy != null) {
				(level == 1) ? ypos = this.spawns[0].y : ypos = 50;
				var flag = true;
				this.noSpawn.forEach(function(rect){
					if (rect.contains(this.game.camera.x + this.game.camera.width, ypos)) {
						flag = false;
					}
				}, this);
				if (flag) {
					enemy.reset(this.game.camera.x + this.game.camera.width, ypos);
					enemy.revive();
					enemy.body.velocity.x = -300;
				}
			}
		}, this);

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

		this.labcomp = this.game.add.sprite(this.winZone.x - 400, 224, 'comp');

		//bg music
		this.bgmusic = this.game.add.audio('music_stage3');
		this.bgmusic.play();

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

		this.menu = new SideScroller.Menu(this, this.game, 3);
	},

	update: function() {
		this.game.sound.volume = this.menu.volume;

		//detect if player reached level end
		if (this.winZone.contains(this.player.x + this.player.width/2, this.player.y + this.player.height/2)) {
			this.bgmusic.stop();
			this.state.start('Gameover');
			//(TODO): add condition to make sure computer is destroyed
		}

		//platform collisions
		this.game.physics.arcade.collide(this.player, this.front);
		this.game.physics.arcade.collide(this.shooterEnemies, this.front);
		this.game.physics.arcade.collide(this.walkingEnemies, this.front);

		//update player spawn location
		if (this.curSpawn + 1 < this.spawns.length && this.player.x > this.spawns[this.curSpawn+1].x)
			this.curSpawn += 1;

		//sweeper to player/enemy collisions
		this.game.physics.arcade.collide(this.cameraBlock, this.player);
		this.game.physics.arcade.overlap(this.sweeper, this.walkingEnemies, function(sweeper, enemy){
			enemy.kill();
		});

		//sweeper to bullet collisions
		this.game.physics.arcade.overlap(this.bulletBlock, this.player.weapon.bullets, this.bulletSweepKill);
		this.game.physics.arcade.overlap(this.sweeper, this.player.weapon.bullets, this.bulletSweepKill);
		this.shooterEnemies.children.forEach(function(e){
			this.game.physics.arcade.overlap(this.sweeper, e.weapon.bullets, this.bulletSweepKill);
		}, this);

		//player death to enemy detection
		this.game.physics.arcade.overlap(this.player, this.walkingEnemies, function(player, enemy){
			if (!enemy.shielded) {
				if (this.player.shield) {
					enemy.shielded = true;
					this.game.time.events.add(500, function(){
						enemy.shielded = false;
					}, this);
				}
				player.death(this, this.spawns[this.curSpawn].x, this.spawns[this.curSpawn].y);
			}
		}, null, this);
		this.shooterEnemies.children.forEach(function(e){
			this.game.physics.arcade.overlap(this.player, e.weapon.bullets, function(player, bullet){
				player.death(this, this.spawns[this.curSpawn].x, this.spawns[this.curSpawn].y);
				bullet.kill();
			}, null, this);
		}, this);

		//enemy death to player detection
		this.game.physics.arcade.overlap(this.player.weapon.bullets, this.walkingEnemies, function(bullet, enemy) {
			bullet.kill();
			enemy.kill();
			enemy.body.velocity.x = 0;
			this.player.sfx_death.play();
		}, null, this);
		this.game.physics.arcade.overlap(this.player.weapon.bullets, this.shooterEnemies, function(bullet, enemy) {
			bullet.kill();
			enemy.destroy();
			enemy.weapon.destroy();
			this.player.sfx_death.play();
		}, null, this);

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
		this.game.physics.arcade.overlap(this.player, this.powerups, function(a, b){
			switch(b.name) {
				case 'life':
				var num_elems = this.lives_ind.children.length;
				var ind = this.lives_ind.create(20 * (num_elems + 1) + 60 * num_elems, 20, 'hud_icons', 'life');
				ind.fixedToCamera = true;
				this.game.playerLives++;
				break;

				case 'shield':
				this.shield_ind.frameName = 'shield_active';
				this.player.shield = true;
				break;

				case 'burst':
				this.burst_ind.frameName = 'burst_active';
				this.player.fireRate = 100;
				this.game.time.events.add(Phaser.Timer.SECOND * 5, function(){
					this.burst_ind.frameName = 'burst_inactive';
					this.player.fireRate = 850;
				}, this);
				break;
			}
			b.destroy();
		}, null, this);

		this.player.update();
	},

	bulletSweepKill: function(sweeper, bullet) {
		bullet.kill();
	}
};