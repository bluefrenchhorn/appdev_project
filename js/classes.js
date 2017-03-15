var SideScroller = SideScroller || {};

SideScroller.Player = function(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.game.add.existing(this);

	this.animations.add('standright', ['standright'], 5, true);
	this.animations.add('standleft', ['standleft'], 5, true);
	this.animations.add('duckleft', ['duckleft1'], 5, true);
	this.animations.add('duckright', ['duckright4'], 5, true);
	this.animations.add('jumpleft', ['sprite45'], 5, true);
	this.animations.add('jumpright', ['sprite44'], 5, true);
	this.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 11), 5, true);
	this.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 11), 5, true);
	this.animations.play('standright');

	this.game.physics.arcade.enable(this);
	this.body.gravity.y = 1500;
	this.body.collideWorldBounds = true;

	this.cursors = this.game.input.keyboard.addKeys({
		'up': Phaser.KeyCode.W,
		'down': Phaser.KeyCode.S,
		'left': Phaser.KeyCode.A,
		'right': Phaser.KeyCode.D,
		'jump': Phaser.KeyCode.J,
		'shoot': Phaser.KeyCode.K
	});

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

		if (this.cursors.left.isDown) {
			this.body.velocity.x = -300;
			if (this.body.blocked.down) {
				this.animations.play('left');
			} else { 
				this.animations.play('jumpleft');
			}
			this.direction = 'left';
		} else if (this.cursors.right.isDown) {
			this.body.velocity.x = 300;
			if (this.body.blocked.down) {
				this.animations.play('right');
			} else { 
				this.animations.play('jumpright');
			}
			this.direction = 'right';
		} else if (this.cursors.down.isDown) {
			if (this.body.blocked.down) {
				if (this.direction == 'right') {
					this.animations.play('duckright');
				} else {
					this.animations.play('duckleft');
				}
				//set sprite size
				this.body.setSize(59, 18, 0, 28);
				this.isDucked = true;
			}
		} else {
			if (this.direction == 'right') {
				this.animations.play('standright');
			} else {
				this.animations.play('standleft');
			}
			if (this.isDucked) {
				//reset sprite size
				this.body.setSize(37, 46, 0, 0);
				this.isDucked = false;
			}
		}
		
		if (this.cursors.jump.isDown && this.body.blocked.down) {
			this.body.velocity.y = -750;
			if (this.direction == 'right') {
				this.animations.play('jumpright');
			} else {
				this.animations.play('jumpleft');
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
			}.bind(this), 850);
		}
	}
}

SideScroller.Player.prototype.death = function(context, x, y) {
	this.kill();
	this.reset(x, y);
	this.body.velocity.y = 0;
	this.revive();
	this.game.camera.setPosition(x - 100, 0);
	this.game.playerLives--;
	if (this.game.playerLives == 0) context.state.start('Gameover');
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