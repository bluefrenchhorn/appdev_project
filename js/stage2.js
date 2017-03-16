var SideScroller = SideScroller || {};

SideScroller.Stage2 = function(){};

SideScroller.Stage2.prototype = {
	preload: function() {
		this.game.time.advancedTiming = true;
	},

	create: function() {
		this.map = this.game.add.tilemap('level2');
		this.map.addTilesetImage('textures', 'gameTiles');
		this.map.addTilesetImage('water', 'jungleTiles');
		this.map.addTilesetImage('textures_sci', 'scifiTiles');
		this.map.addTilesetImage('textures_rd', 'caveTiles');

		this.background = this.map.createLayer('background');
		this.back = this.map.createLayer('back');
		this.mid = this.map.createLayer('mid');
		this.front = this.map.createLayer('front');
		this.decor = this.map.createLayer('decor');

		this.background.resizeWorld();

		this.map.setCollisionBetween(1, 3, true, 'back');
		this.map.setCollisionBetween(1, 3, true, 'mid');
		this.map.setCollisionBetween(1, 3, true, 'front');
		this.map.setCollisionBetween(25, 805, true, 'front');

		var settings = {
			top: true,
			bottom: false,
			left: false,
			right: false
		};

		SideScroller.setTileCollision(this.back, [1, 2, 3], settings);
		SideScroller.setTileCollision(this.mid, [1, 2, 3], settings);
		SideScroller.setTileCollision(this.front, [1, 2, 3], settings);

		//powerups
		this.powerups = this.game.add.group();
		this.powerups.enableBody = true;
		this.map.createFromObjects('obj', 1480, 'powerup', 206, true, false, this.powerups);
		this.map.createFromObjects('obj', 1389, 'powerup', 102, true, false, this.powerups);
		this.map.createFromObjects('obj', 1415, 'powerup', 141, true, false, this.powerups);
		this.map.createFromObjects('obj', 1376, 'powerup', 124, true, false, this.powerups);

		// load player spawn locations
		this.spawns = SideScroller.findObjectsByType('playerSpawn', this.map, 'obj');
	    this.curSpawn = 0;

		this.player = new SideScroller.Player(this.game, this.spawns[this.curSpawn].x, this.spawns[this.curSpawn].y);

		this.collideBack = true;
		this.collideMid = true;
		this.collideFront = true;

		this.map.setTileIndexCallback([1, 2, 3], function(sprite) { 
	    	if (this.collideBack == false && sprite == this.player) return false;
	    	if (this.player.cursors.down.isDown && this.player.cursors.jump.isDown && sprite == this.player) {          
	     		this.collideBack = false;
	     		setTimeout(function(){
	     			this.collideBack = true;
	     		}.bind(this), 500);
	     		return false;
	     	}
	     	return true;           
	    }, this, this.back);

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
	    }, this, this.mid);

		this.map.setTileIndexCallback([1, 2, 3], function(sprite) { 
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

		//winzone code here

		this.waterDetection = this.game.add.group();
		this.waterDetection.enableBody = true;

		var result = SideScroller.findObjectsByType('water', this.map, 'obj');

		result.forEach(function(element){
			var sprite = this.waterDetection.create(element.x, element.y, element.id);
			sprite.body.setSize(element.width, element.height);
		}, this);

		//walking enemies

		this.water = this.map.createLayer('water');

		//shooting enemies
		this.shooterEnemies = this.game.add.group();

		result = SideScroller.findObjectsByType('shooterSpawn', this.map, 'obj');
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
		//level end detection here

		//platform collisions
		this.game.physics.arcade.collide(this.player, this.back);
		this.game.physics.arcade.collide(this.player, this.mid);
		this.game.physics.arcade.collide(this.player, this.front);

		this.game.physics.arcade.collide(this.shooterEnemies, this.back);
		this.game.physics.arcade.collide(this.shooterEnemies, this.mid);
		this.game.physics.arcade.collide(this.shooterEnemies, this.front);

		//update player spawn location
		if (this.curSpawn + 1 < this.spawns.length && this.player.x > this.spawns[this.curSpawn+1].x)
			this.curSpawn += 1;

		//water collisions
		this.game.physics.arcade.overlap(this.player, this.waterDetection, function(player){
			player.death(this, this.spawns[this.curSpawn].x, this.spawns[this.curSpawn].y);
		}, null, this);

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
				e.weapon.fireAtSprite(this.player);
				if (e.x - this.player.x > 0) e.animations.play('standleft');
				else e.animations.play('standright');
			}
		}, this);

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

		if(this.control.pause.isDown)
			this.game.paused = true;
	},

	bulletSweepKill: function(sweeper, bullet) {
		bullet.kill();
	},

	render: function() {	
	//	this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
	}
};