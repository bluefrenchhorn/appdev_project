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

		this.player = new SideScroller.Player(this.game, 100, 300);

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
		this.game.camera.deadzone = new Phaser.Rectangle(0, 0, this.game.camera.width/2, this.game.camera.height);

		this.cameraBlock = new SideScroller.Blocker(this.game, -50, 0);
		this.sweeper = new SideScroller.Blocker(this.game, -100, 0);
		this.bulletBlock = new SideScroller.Blocker(this.game, this.game.camera.width, 0);

		///////////////////////Object layer stuff////////////////////////////

		var res = this.map.objects['objectLayer'][1];

		this.winZone = new Phaser.Rectangle(res.x, res.y, res.width, res.height);

		this.waterDetection = this.game.add.group();
		this.waterDetection.enableBody = true;

		var result = this.findObjectsByType('water', this.map, 'objectLayer');

		result.forEach(function(element){
			var sprite = this.waterDetection.create(element.x, element.y, element.id);
			sprite.body.setSize(element.width, element.height);
		}, this);

		this.spawns = this.findObjectsByType('spawnPoint', this.map, 'objectLayer');
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

		result = this.findObjectsByType('noSpawn', this.map, 'objectLayer');
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

		result = this.findObjectsByType('shooterSpawn', this.map, 'objectLayer');
		result.forEach(function(spawn){
			var e = this.shooterEnemies.create(spawn.x, spawn.y, 'enemy');
			
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

		this.control = this.game.input.keyboard.addKeys({
			'pause': Phaser.KeyCode.P
		});

		this.game.input.keyboard.onDownCallback = function(event){
			if(event.keyCode == Phaser.KeyCode.P && this.game.paused)
				this.game.paused = false;
		};
	},

	update: function() {
		//detect if player reached level end
		if (this.winZone.contains(this.player.x + this.player.width/2, this.player.y + this.player.height/2)) {
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

		//water collisions
		this.game.physics.arcade.overlap(this.player, this.waterDetection, function(player){
			player.kill();
			player.reset(player.x, 0);
			player.body.velocity.y = 0;
			player.revive();
		});
		this.game.physics.arcade.overlap(this.walkingEnemies, this.waterDetection, function(enemy){
			enemy.body.velocity.x = 0;
			enemy.kill();
		});

		//sweeper to player/enemy collisions
		this.game.physics.arcade.collide(this.cameraBlock, this.player);
		this.game.physics.arcade.overlap(this.sweeper, this.shooterEnemies, function(sweeper, enemy){
			enemy.weapon.destroy();
			enemy.destroy();
		});
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
		this.game.physics.arcade.overlap(this.player, this.walkingEnemies, function(player){
			player.kill();
			player.reset(player.x, 0);
			player.body.velocity.y = 0;
			player.revive();
		});
		this.shooterEnemies.children.forEach(function(e){
			this.game.physics.arcade.overlap(this.player, e.weapon.bullets, this.playerDeath);
		}, this);

		//enemy death to player detection
		this.game.physics.arcade.overlap(this.player.weapon.bullets, this.walkingEnemies, function(bullet, enemy) {
			bullet.kill();
			enemy.kill();
			enemy.body.velocity.x = 0;
		});
		this.game.physics.arcade.overlap(this.player.weapon.bullets, this.shooterEnemies, function(bullet, enemy) {
			bullet.kill();
			enemy.destroy();
			enemy.weapon.destroy();
		});

		//shooter enemies shoot at player
		this.shooterEnemies.children.forEach(function(e){
			if (e.inCamera) {
				e.weapon.fireAtSprite(this.player);
				if (e.x - this.player.x > 0) e.animations.play('standleft');
				else e.animations.play('standright');
			}
		}, this);

		this.player.update();

		if(this.control.pause.isDown)
			this.game.paused = true;
	},
	
	render: function() {	
		this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
	},
	
	playerDeath: function(player, bullet) {
		player.kill();
		player.reset(player.x, 0);
		player.body.velocity.y = 0;
		player.revive();
		if (bullet) {
			bullet.kill();
		}
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
