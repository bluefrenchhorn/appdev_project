var SideScroller = SideScroller || {};

SideScroller.Player = function(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.game.add.existing(this);

	this.animations.add('standright', ['standright'], 5, true);
	this.animations.add('standleft', ['standleft'], 5, true);
	this.animations.add('duckleft', ['duckleft'], 5, true);
	this.animations.add('duckright', ['duckright'], 5, true);
	this.animations.add('jumpleft', ['jumpleft'], 5, true);
	this.animations.add('jumpright', ['jumpright'], 5, true);
	this.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 11), 5, true);
	this.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 11), 5, true);
	this.animations.play('standright');

	this.animations.add('deadstandright', ['deadstandright'], 5, true);
	this.animations.add('deadstandleft', ['deadstandleft'], 5, true);
	this.animations.add('deadduckleft', ['deadduckleft'], 5, true);
	this.animations.add('deadduckright', ['deadduckright'], 5, true);
	this.animations.add('deadjumpleft', ['deadjumpleft'], 5, true);
	this.animations.add('deadjumpright', ['deadjumpright'], 5, true);
	this.animations.add('deadleft', Phaser.Animation.generateFrameNames('deadleft', 1, 11), 5, true);
	this.animations.add('deadright', Phaser.Animation.generateFrameNames('deadright', 1, 11), 5, true);

	this.game.physics.arcade.enable(this);
	this.body.gravity.y = 1500;
	this.body.collideWorldBounds = true;

	this.cursors = this.game.input.keyboard.addKeys({
		'down': SideScroller.duckkey,
		'left': SideScroller.leftkey,
		'right': SideScroller.rightkey,
		'jump': SideScroller.jumpkey,
		'shoot': SideScroller.shootkey
	});

	this.fireRate = 850;
	this.shield = false;
	this.immune = false;

	this.weapon = this.game.add.weapon(50, 'bullet');
	this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
	this.weapon.bulletSpeed = 600;
	this.weapon.fireRate = 100;
	this.weapon.trackSprite(this, this.width/2, this.height/2);

	this.unlockedFire = true;
	this.direction = 'right';
	this.isDucked = false;

	this.body.setSize(37, 46, 0, 0);
}

SideScroller.Player.prototype = Object.create(Phaser.Sprite.prototype);
SideScroller.Player.prototype.constructor = SideScroller.Player;

SideScroller.Player.prototype.update = function() {
	if (this.alive) {
		this.body.velocity.x = 0;

		var dead = '';
		if (this.immune == true) dead = 'dead';

		if (this.cursors.left.isDown) {
			this.body.velocity.x = -300;
			if (this.body.blocked.down) {
				this.animations.play(dead + 'left');
			} else { 
				this.animations.play(dead + 'jumpleft');
			}
			this.direction = 'left';
		} else if (this.cursors.right.isDown) {
			this.body.velocity.x = 300;
			if (this.body.blocked.down) {
				this.animations.play(dead + 'right');
			} else { 
				this.animations.play(dead + 'jumpright');
			}
			this.direction = 'right';
		} else if (this.cursors.down.isDown) {
			if (this.body.blocked.down) {
				if (this.direction == 'right') {
					this.animations.play(dead + 'duckright');
				} else {
					this.animations.play(dead + 'duckleft');
				}
				//set sprite size
				this.body.setSize(59, 18, 0, 28);
				this.weapon.trackSprite(this, this.width/2, 37);
				this.isDucked = true;
			}
		} else {
			if (this.direction == 'right') {
				this.animations.play(dead + 'standright');
			} else {
				this.animations.play(dead + 'standleft');
			}
			if (this.isDucked) {
				//reset sprite size
				this.body.setSize(37, 46, 0, 0);
				this.weapon.trackSprite(this, this.width/2, this.height/2);
				this.isDucked = false;
			}
		}
		
		if (this.cursors.jump.isDown && this.body.blocked.down) {
			this.body.velocity.y = -750;
			if (this.direction == 'right') {
				this.animations.play(dead + 'jumpright');
			} else {
				this.animations.play(dead + 'jumpleft');
			}
		}

		if (this.cursors.shoot.isDown && this.unlockedFire) {
			this.unlockedFire = false;
			this.weapon.fireRate = 0;
			var angles = [0, 15, -15, 30, -30];
			for(var i = 0; i < angles.length; i++) {
				this.weapon.fireAngle = angles[i];
				if (this.direction == 'left') this.weapon.fireAngle += 180;
				this.weapon.fire();
			}
			this.weapon.fireRate = 100;
			setTimeout(function(){
				this.unlockedFire = true;
			}.bind(this), this.fireRate);
		}
	}
}

SideScroller.Player.prototype.death = function(context, x, y) {
	if (this.immune == true) return;
	if (this.shield == true) {
		context.shield_ind.frameName = 'shield_inactive';
		this.shield = false;
	} else {
		this.kill();
		this.reset(x, y);
		this.body.velocity.y = 0;
		this.revive();
		this.game.camera.setPosition(x - 100, 0);
		this.game.playerLives--;
		context.lives_ind.removeChildAt(context.lives_ind.children.length - 1).destroy();
		if (this.game.playerLives == 0) context.state.start('Gameover');
		this.immune = true;
		this.unlockedFire = false;
		this.game.time.events.add(Phaser.Timer.SECOND * 3, function(){
			this.immune = false;
			this.unlockedFire = true;
		}, this);
	}
};

SideScroller.Blocker = function(game, x, y){
	Phaser.Sprite.call(this, game, x, y, null);
	this.game.add.existing(this);
	this.game.physics.arcade.enable(this);
	this.body.setSize(50, this.game.camera.height);
	this.body.immovable = true;
	this.fixedToCamera = true;
};

SideScroller.Blocker.prototype = Object.create(Phaser.Sprite.prototype);
SideScroller.Blocker.prototype.constructor = SideScroller.Blocker;