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

		this.player = new SideScroller.Player(this.game, 50, 50);

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

		this.water = this.map.createLayer('water');

		this.game.camera.follow(this.player, null);
		this.game.camera.deadzone = new Phaser.Rectangle(0, 0, this.game.camera.width/2, this.game.camera.height);
	
		this.cameraBlock = new SideScroller.Blocker(this.game, -50, 0);
		this.sweeper = new SideScroller.Blocker(this.game, -100, 0);
		this.bulletBlock = new SideScroller.Blocker(this.game, this.game.camera.width, 0);

		this.control = this.game.input.keyboard.addKeys({
			'pause': Phaser.KeyCode.P
		});

		this.game.input.keyboard.onDownCallback = function(event){
			if(event.keyCode == Phaser.KeyCode.P && this.game.paused)
				this.game.paused = false;
		};
	},

	update: function() {
		this.game.physics.arcade.collide(this.player, this.layer_b);
		this.game.physics.arcade.collide(this.player, this.layer_f);
		this.game.physics.arcade.collide(this.player, this.layer_f_f);

		this.game.physics.arcade.collide(this.cameraBlock, this.player);

		this.player.update();

		if(this.control.pause.isDown)
			this.game.paused = true;
	},
	
	render: function() {	
		this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
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