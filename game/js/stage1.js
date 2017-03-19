var SideScroller = SideScroller || {};

SideScroller.Stage1 = function(){};

SideScroller.Stage1.prototype = {
	preload: function() {
		this.game.time.advancedTiming = true;
	},

	create: function() {
		this.map = this.game.add.tilemap('level1');
		this.map.addTilesetImage('textures', 'gameTiles');
		this.map.addTilesetImage('water', 'jungleTiles');
		this.map.addTilesetImage('water_2', 'jungleTiles');

		this.background = this.map.createLayer('background');
		this.sky = this.map.createLayer('sky');
		this.background.resizeWorld();

		this.platformsHigh = this.map.createLayer('platformsHigh');
		this.platformsMid = this.map.createLayer('platformsMid');
		this.platformsLow = this.map.createLayer('platformsLow');
		
		this.map.setCollisionBetween(1, 3, true, 'platformsLow');
		this.map.setCollision(9, true, 'platformsLow');
		this.map.setCollision(11, true, 'platformsLow');
		this.map.setCollisionBetween(1, 3, true, 'platformsMid');
		this.map.setCollisionBetween(1, 3, true, 'platformsHigh');

	    SideScroller.setTileCollision(this.platformsMid, [1, 2, 3], {
	        top: true,
	        bottom: false,
	        left: false,
	        right: false
	    });

	    SideScroller.setTileCollision(this.platformsHigh, [1, 2, 3], {
	        top: true,
	        bottom: false,
	        left: false,
	        right: false
	    });

	   	//powerups
		this.powerups = this.game.add.group();
		this.powerups.enableBody = true;
		this.map.createFromObjects('objectLayer', 1071, 'powerup', 206, true, false, this.powerups);
		this.map.createFromObjects('objectLayer', 967, 'powerup', 102, true, false, this.powerups);
		this.map.createFromObjects('objectLayer', 1006, 'powerup', 141, true, false, this.powerups);
		this.map.createFromObjects('objectLayer', 989, 'powerup', 124, true, false, this.powerups);

	    this.spawns = SideScroller.findObjectsByType('playerSpawn', this.map, 'objectLayer');
	    this.curSpawn = 0;
	    if (SideScroller.stage == 1) this.curSpawn = SideScroller.checkpoint;

		this.player = new SideScroller.Player(this.game, this.spawns[this.curSpawn].x, this.spawns[this.curSpawn].y);

		this.collideMid = true;
	    this.map.setTileIndexCallback([1, 2, 3], function(sprite) { 
	    	if (this.collideMid == false && sprite == this.player) return false;
	    	if (this.player.cursors.down.isDown && this.player.cursors.jump.isDown && sprite == this.player) {          
	     		this.collideMid = false;
	     		setTimeout(function(){
	     			this.collideMid = true;
	     		}.bind(this), 500);
	     		return false;
	     	}
	     	return true;           
	    }, this, this.platformsMid);

	    this.collideHigh = true;
	    this.map.setTileIndexCallback([1, 2, 3], function(sprite) { 
	    	if (this.collideHigh == false && sprite == this.player) return false;
	    	if (this.player.cursors.down.isDown && this.player.cursors.jump.isDown && sprite == this.player) {        
	     		this.collideHigh = false;
	     		setTimeout(function(){
	     			this.collideHigh = true;
	     		}.bind(this), 500);
	     		return false;
	     	}
	     	
	     	return true;           
	    }, this, this.platformsHigh);

		this.game.camera.follow(this.player, null);
		this.game.camera.setPosition(this.spawns[this.curSpawn].x - 100, 0);
		this.game.camera.deadzone = new Phaser.Rectangle(0, 0, this.game.camera.width/2, this.game.camera.height);

		this.cameraBlock = new SideScroller.Blocker(this.game, -50, 0);
		this.sweeper = new SideScroller.Blocker(this.game, -100, 0);
		this.bulletBlock = new SideScroller.Blocker(this.game, this.game.camera.width, 0);

		///////////////////////Object layer stuff////////////////////////////

		var res = this.map.objects['objectLayer'][3];

		this.winZone = new Phaser.Rectangle(res.x, res.y, res.width, res.height);

		this.waterDetection = this.game.add.group();
		this.waterDetection.enableBody = true;

		var result = SideScroller.findObjectsByType('water', this.map, 'objectLayer');

		result.forEach(function(element){
			var sprite = this.waterDetection.create(element.x, element.y, element.id);
			sprite.body.setSize(element.width, element.height);
		}, this);

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

		result = SideScroller.findObjectsByType('noSpawn', this.map, 'objectLayer');
		this.noSpawn = [];
		result.forEach(function(zone, i){
			var rect = new Phaser.Rectangle(zone.x, zone.y, zone.width, zone.height);
			this.noSpawn[i] = rect;
		}, this);

		setInterval(function(){
			var level = Math.floor(Math.random() * 2) + 1; 

			var enemy = this.walkingEnemies.getFirstExists(false);
			if (enemy != null) {
				(level == 1) ? ypos = 50 : ypos = this.spawns[0].y;
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

		}.bind(this), 2000);

		this.water = this.map.createLayer('liquid');
		/////////////////////////////End of Object layer stuff////////////////////////////////////

		this.shooterEnemies = this.game.add.group();

		result = SideScroller.findObjectsByType('shooterSpawn', this.map, 'objectLayer');
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

		this.bgmusic = this.game.add.audio('backgroundmusic');
		this.bgmusic.play();
		this.sfx_powerup = this.game.add.audio('pickup');

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

		this.menu = new SideScroller.Menu(this, this.game, 1);
	},

	update: function() {
		this.game.sound.volume = this.menu.volume;

		//detect if player reached level end
		if (this.winZone.contains(this.player.x + this.player.width/2, this.player.y + this.player.height/2)) {
			this.bgmusic.stop();
			this.state.start('Stage2');
		}

		//platform collisions
		this.game.physics.arcade.collide(this.player, this.platformsLow);
		this.game.physics.arcade.collide(this.player, this.platformsMid);
		this.game.physics.arcade.collide(this.player, this.platformsHigh);

		this.game.physics.arcade.collide(this.shooterEnemies, this.platformsLow);
		this.game.physics.arcade.collide(this.shooterEnemies, this.platformsMid);
		this.game.physics.arcade.collide(this.shooterEnemies, this.platformsHigh);

		this.game.physics.arcade.collide(this.walkingEnemies, this.platformsLow);
		this.game.physics.arcade.collide(this.walkingEnemies, this.platformsMid);
		this.game.physics.arcade.collide(this.walkingEnemies, this.platformsHigh);

		//update player spawn location
		if (this.curSpawn + 1 < this.spawns.length && this.player.x > this.spawns[this.curSpawn+1].x)
			this.curSpawn += 1;

		//water collisions
		this.game.physics.arcade.overlap(this.player, this.waterDetection, function(player){
			player.death(this, this.spawns[this.curSpawn].x, this.spawns[this.curSpawn].y);
		}, null, this);
		this.game.physics.arcade.overlap(this.walkingEnemies, this.waterDetection, function(enemy){
			enemy.body.velocity.x = 0;
			enemy.kill();
		});

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

		this.game.physics.arcade.overlap(this.player, this.powerups, function(a, b){
			this.sfx_powerup.play();
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
	
	render: function() {	
	//	this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
	},

	bulletSweepKill: function(sweeper, bullet) {
		bullet.kill();
	},

	findObjectsByType: function(type, map, layerName) {
		var result = new Array();

		map.objects[layerName].forEach(function(element){
			if(element.type === type) {
				result.push(element);
			}
		});

		return result;
	}
};
