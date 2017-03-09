var SideScroller = SideScroller || {};

SideScroller.Game = function(){};

SideScroller.Game.prototype = {
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
		this.platformsHigh = this.map.createLayer('platformsHigh');
		this.platformsMid = this.map.createLayer('platformsMid');
		this.platformsLow = this.map.createLayer('platformsLow');
		

		this.map.setCollisionBetween(1, 3, true, 'platformsLow');
		this.map.setCollision(9, true, 'platformsLow');
		this.map.setCollision(11, true, 'platformsLow');
		this.map.setCollisionBetween(1, 3, true, 'platformsMid');
		this.map.setCollisionBetween(1, 3, true, 'platformsHigh');

	    setTileCollision(this.platformsMid, [1, 2, 3], {
	        top: true,
	        bottom: false,
	        left: false,
	        right: false
	    });

	    setTileCollision(this.platformsHigh, [1, 2, 3], {
	        top: true,
	        bottom: false,
	        left: false,
	        right: false
	    });

	    this.collideMid = true;
	    this.map.setTileIndexCallback(2, function() { 
	    	if (this.cursors.down.isDown && this.cursors.jump.isDown || this.collideMid == false) {          
	     		this.collideMid = false;
	     		setTimeout(function(){
	     			this.collideMid = true;
	     		}.bind(this), 500);
	     		return false;
	     	}
	     	return true;           
	     }, this, this.platformsMid);

	    this.collideHigh = true;
	    this.map.setTileIndexCallback(2, function() { 
	    	if (this.cursors.down.isDown && this.cursors.jump.isDown || this.collideHigh == false) {          
	     		this.collideHigh = false;
	     		setTimeout(function(){
	     			this.collideHigh = true;
	     		}.bind(this), 500);
	     		return false;
	     	}
	     	return true;           
	     }, this, this.platformsHigh);

		this.background.resizeWorld();

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
		this.walkingEnemies.createMultiple(10, 'player');
		this.walkingEnemies.children.forEach(function(e){
			e.animations.add('standright', ["standright"], 5, true);
			e.animations.add('standleft', ["standleft"], 5, true);
			e.animations.add('duckleft', ["duckleft1"], 5, true);
			e.animations.add('duckright', ["duckright4"], 5, true);
			e.animations.add('jumpleft', ["sprite45"], 5, true);
			e.animations.add('jumpright', ["sprite44"], 5, true);
			e.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 11), 5, true);
			e.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 11), 5, true);
			e.animations.play('left');

			this.game.physics.arcade.enable(e);
			e.body.gravity.y = 1000;
			e.collideWorldBounds = true;
		}, this);

		setInterval(function(){
			var enemy = this.walkingEnemies.getFirstExists(false);
			if (enemy != null) {
				enemy.reset(this.spawns[0].x, this.spawns[0].y);
				enemy.revive();
				enemy.body.velocity.x = -300;
			}
		}.bind(this), 2000);



		/////////////////////////////End of Object layer stuff////////////////////////////////////

		this.player = this.game.add.sprite(100, 300, 'player');
		this.player.animations.add('standright', ["standright"], 5, true);
		this.player.animations.add('standleft', ["standleft"], 5, true);
		this.player.animations.add('duckleft', ["duckleft1"], 5, true);
		this.player.animations.add('duckright', ["duckright4"], 5, true);
		this.player.animations.add('jumpleft', ["sprite45"], 5, true);
		this.player.animations.add('jumpright', ["sprite44"], 5, true);
		this.player.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 11), 5, true);
		this.player.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 11), 5, true);
		this.player.animations.play('standright');


		this.water = this.map.createLayer('liquid');

		this.weapon = this.game.add.weapon(50, 'bullet');
		this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
		this.weapon.bulletSpeed = 600;
		this.weapon.fireRate = 100;
		this.weapon.trackSprite(this.player, this.player.width/2, this.player.height/2);

		this.game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 1000;
		this.player.body.collideWorldBounds = true;
		this.game.camera.follow(this.player, null);
		this.game.camera.deadzone = new Phaser.Rectangle(0, 0, this.game.camera.width/2, this.game.camera.height);

		/////////////////////// BLOCKERS ////////////////////////////////

		this.cameraBlock = this.game.add.sprite(-10, 0, null);
		this.game.physics.arcade.enable(this.cameraBlock);
		this.cameraBlock.body.setSize(10, this.game.camera.height);
		this.cameraBlock.body.immovable = true;
		this.cameraBlock.fixedToCamera = true;

		this.sweeper = this.game.add.sprite(-100, 0, null);
		this.game.physics.arcade.enable(this.sweeper);
		this.sweeper.body.setSize(50, this.game.camera.height);
		this.sweeper.body.immovable = true;
		this.sweeper.fixedToCamera = true;

		///////////////////// END OF BLOCKERS /////////////////////////////

		this.shooterEnemies = this.game.add.group();

		result = this.findObjectsByType('shooterSpawn', this.map, 'objectLayer');
		result.forEach(function(spawn){
			var e = this.shooterEnemies.create(spawn.x, spawn.y, 'player');
			e.animations.add('standright', ["standright"], 5, true);
			e.animations.add('standleft', ["standleft"], 5, true);
			e.animations.add('duckleft', ["duckleft1"], 5, true);
			e.animations.add('duckright', ["duckright4"], 5, true);
			e.animations.add('jumpleft', ["sprite45"], 5, true);
			e.animations.add('jumpright', ["sprite44"], 5, true);
			e.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 11), 5, true);
			e.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 11), 5, true);
			e.animations.play('standleft');

			this.game.physics.arcade.enable(e);
			e.body.gravity.y = 1000;
			e.collideWorldBounds = true;

			e.weapon = this.game.add.weapon(30, 'bullet');
			e.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
			e.weapon.bulletSpeed = 600;
			e.weapon.fireRate = 2000;
			e.weapon.trackSprite(e);
		}, this);

		this.cursors = this.game.input.keyboard.addKeys({
			'up': Phaser.KeyCode.W,
			'down': Phaser.KeyCode.S,
			'left': Phaser.KeyCode.A,
			'right': Phaser.KeyCode.D,
			'jump': Phaser.KeyCode.J,
			'shoot': Phaser.KeyCode.K
		});
	},

	direction: "right",

	unlockedFire: true,

	update: function() {
		this.shooterEnemies.children.forEach(function(e){
			e.weapon.fireAtSprite(this.player);
		}, this);

		this.game.physics.arcade.collide(this.player, this.cameraBlock);
		if (this.winZone.contains(this.player.x + this.player.width/2, this.player.y + this.player.height/2)) {
			console.log("we have a winner!!!");
		}
		
		this.game.physics.arcade.overlap(this.player, this.walkingEnemies, function(a, b) {
			this.player.kill();
			this.player.reset(this.player.x, 0);
			this.player.body.velocity.y = 0;
			this.player.revive();
		}, null, this);

		this.game.physics.arcade.overlap(this.weapon.bullets, this.walkingEnemies, function(a, b) {
			a.kill();
			b.kill();
			b.body.velocity.x = 0;
		}, null, this);

		this.game.physics.arcade.overlap(this.weapon.bullets, this.shooterEnemies, function(a, b) {
			a.kill();
			b.destroy();
			b.weapon.destroy();
		}, null, this);

		this.shooterEnemies.children.forEach(function(e){
			this.game.physics.arcade.overlap(this.player, e.weapon.bullets, function(){
				this.player.kill();
				this.player.reset(this.player.x, 0);
				this.player.body.velocity.y = 0;
				this.player.revive();
			}, null, this);
		}, this);

		this.game.physics.arcade.collide(this.walkingEnemies, this.platformsLow);
		this.game.physics.arcade.collide(this.walkingEnemies, this.platformsMid);
		this.game.physics.arcade.collide(this.walkingEnemies, this.platformsHigh);
		this.game.physics.arcade.overlap(this.walkingEnemies, this.waterDetection, function(a){
			a.body.velocity.x = 0;
			a.kill();
		}.bind(this));

		this.game.physics.arcade.collide(this.shooterEnemies, this.platformsLow);
		this.game.physics.arcade.collide(this.shooterEnemies, this.platformsMid);
		this.game.physics.arcade.collide(this.shooterEnemies, this.platformsHigh);

		this.game.physics.arcade.collide(this.player, this.platformsLow, this.playerHit, null, this);
		this.game.physics.arcade.collide(this.player, this.platformsMid, this.playerHit, null, this);
		this.game.physics.arcade.collide(this.player, this.platformsHigh, this.playerHit, null, this);
		
		this.game.physics.arcade.overlap(this.player, this.waterDetection, function(){
			this.player.kill();
			this.player.reset(this.player.x, 0);
			this.player.body.velocity.y = 0;
			this.player.revive();
		}.bind(this));

		this.game.physics.arcade.overlap(this.shooterEnemies, this.sweeper, function(a, b){
			b.weapon.destroy();
			b.destroy();
		}, null, this);

		this.game.physics.arcade.overlap(this.walkingEnemies, this.sweeper, function(a, b){
			b.kill();
		}, null, this);

		this.player.body.velocity.x = 0;

		if (this.cursors.left.isDown) {
			this.player.body.velocity.x = -300;
			if (this.player.body.blocked.down)
				this.player.animations.play('left');
			else 
				this.player.animations.play('jumpleft');
			this.direction = "left";
		} else if (this.cursors.right.isDown) {
			this.player.body.velocity.x = 300;
			if (this.player.body.blocked.down)
				this.player.animations.play('right');
			else 
				this.player.animations.play('jumpright');
			this.direction = "right";
		} else if (this.cursors.down.isDown) {
			if (this.player.body.blocked.down) {
				if (this.direction == "right") {
					this.player.animations.play('duckright');
				} else {
					this.player.animations.play('duckleft');
				}
			}
		} else {
			if (this.direction == "right") {
				this.player.animations.play('standright');
			} else {
				this.player.animations.play('standleft');
			}
		}
		
		if (this.cursors.jump.isDown && this.player.body.blocked.down) {
			this.player.body.velocity.y = -600;
			if (this.direction == "right") {
				this.player.animations.play('jumpright');
			} else {
				this.player.animations.play('jumpleft');
			}
		}


		if (this.cursors.shoot.isDown && this.unlockedFire) {
			/*
			if (this.direction == "right") {
				this.weapon.fireAngle = Phaser.ANGLE_RIGHT;
			} else {
				this.weapon.fireAngle = Phaser.ANGLE_LEFT;
			}
			
			//this.weapon.fireRate = 0;

			for ( var i = 0; i < 5; i++ ) {

				// Left bullets
				var left = new Phaser.Point(this.player.position.x - (10+i*6), this.player.position.y - 20);
				this.weapon.fireAngle = -95 - i*10;
				this.weapon.fire(left);
							
				// Right bullets
				var right = new Phaser.Point(this.player.position.x + (10+i*6), this.player.position.y - 20);
				this.weapon.fireAngle = -85 + i*10;
				this.weapon.fire(right);

			}
			*/
			this.unlockedFire = false;
			this.weapon.fireRate = 0;
			var angles = [0, 15, -15, 30, -30];
			for(var i = 0; i < angles.length; i++) {
				this.weapon.fireAngle = angles[i];
				if (this.direction == "left") this.weapon.fireAngle += 180;
				this.weapon.fire();
			}
			this.weapon.fireRate = 100;
			setTimeout(function(){
				this.unlockedFire = true;
			}.bind(this), 100);
		}
	},

	render: function() {	
		this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
	},

	playerHit: function(player, ground) {

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

function setTileCollision(mapLayer, idxOrArray, dirs) {
 
    var mFunc; // tile index matching function
    if (idxOrArray.length) {
        // if idxOrArray is an array, use a function with a loop
        mFunc = function(inp) {
            for (var i = 0; i < idxOrArray.length; i++) {
                if (idxOrArray[i] === inp) {
                    return true;
                }
            }
            return false;
        };
    } else {
        // if idxOrArray is a single number, use a simple function
        mFunc = function(inp) {
            return inp === idxOrArray;
        };
    }
 
    // get the 2-dimensional tiles array for this layer
    var d = mapLayer.map.layers[mapLayer.index].data;
     
    for (var i = 0; i < d.length; i++) {
        for (var j = 0; j < d[i].length; j++) {
            var t = d[i][j];
            if (mFunc(t.index)) {
                 
                t.collideUp = dirs.top;
                t.collideDown = dirs.bottom;
                t.collideLeft = dirs.left;
                t.collideRight = dirs.right;
                 
                t.faceTop = dirs.top;
                t.faceBottom = dirs.bottom;
                t.faceLeft = dirs.left;
                t.faceRight = dirs.right;
                 
            }
        }
    }
 
}