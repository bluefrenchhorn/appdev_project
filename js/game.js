var SideScroller = SideScroller || {};

SideScroller.Game = function(){};

SideScroller.Game.prototype = {
	preload: function() {
		this.game.time.advancedTiming = true;
	},

	create: function() {
		this.bgmusic = this.game.add.audio('backgroundmusic');
		this.bgmusic.play();
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
		this.walkingEnemies.createMultiple(20, 'player');
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

		/////////////////////////////End of Object layer stuff////////////////////////////////////
		
		this.player = new SideScroller.Player(this.game, 100, 300);

		this.water = this.map.createLayer('liquid');

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

		this.bulletBlock = this.game.add.sprite(this.game.camera.width, 0, null);
		this.game.physics.arcade.enable(this.bulletBlock);
		this.bulletBlock.body.setSize(50, this.game.camera.height);
		this.bulletBlock.body.immovable = true;
		this.bulletBlock.fixedToCamera = true;

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

		this.collideMid = true;
	    this.map.setTileIndexCallback(2, function(sprite) { 
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
	    this.map.setTileIndexCallback(2, function(sprite) { 
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
	},

	update: function() {
		this.shooterEnemies.children.forEach(function(e){
			if (e.inCamera) {
				e.weapon.fireAtSprite(this.player);
			}
		}, this);

		this.game.physics.arcade.collide(this.player, this.cameraBlock);
		if (this.winZone.contains(this.player.x + this.player.width/2, this.player.y + this.player.height/2)) {
			console.log("we have a winner!!!");
		}
		
		this.game.physics.arcade.overlap(this.bulletBlock, this.player.weapon.bullets, function(a, b){
			b.kill();
		}, null, this);

		this.game.physics.arcade.overlap(this.player, this.walkingEnemies, function(a, b) {
			this.player.kill();
			this.player.reset(this.player.x, 0);
			this.player.body.velocity.y = 0;
			this.player.revive();
		}, null, this);

		this.game.physics.arcade.overlap(this.player.weapon.bullets, this.walkingEnemies, function(a, b) {
			a.kill();
			b.kill();
			b.body.velocity.x = 0;
		}, null, this);

		this.game.physics.arcade.overlap(this.player.weapon.bullets, this.shooterEnemies, function(a, b) {
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

		this.game.physics.arcade.overlap(this.player.weapon.bullets, this.sweeper, function(a, b){
			b.kill();
		}, null, this);

		this.shooterEnemies.children.forEach(function(e){
			this.game.physics.arcade.overlap(this.sweeper, e.weapon.bullets, function(a, b){
				b.kill();
			}, null, this);
		}, this);

		this.player.update();
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