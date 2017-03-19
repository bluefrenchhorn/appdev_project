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

	this.sfx_shoot = this.game.add.audio('shoot');
	this.sfx_death = this.game.add.audio('death');

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

		if (this.cursors.shoot.isDown && this.unlockedFire && !this.immune) {
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
			this.sfx_shoot.play();
		}
	}
}

SideScroller.Player.prototype.death = function(context, x, y) {
	if (this.immune == true) return;
	if (this.shield == true) {
		context.shield_ind.frameName = 'shield_inactive';
		this.shield = false;
	} else {
		this.sfx_death.play();
		this.kill();
		this.reset(x, y);
		this.body.velocity.y = 0;
		this.revive();
		this.game.camera.setPosition(x - 100, 0);
		this.game.playerLives--;
		context.lives_ind.removeChildAt(context.lives_ind.children.length - 1).destroy();
		if (this.game.playerLives == 0) {
			context.bgmusic.stop();
			context.state.start('Gameover');
		}
		this.immune = true;
		this.game.time.events.add(Phaser.Timer.SECOND * 3, function(){
			this.immune = false;
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

SideScroller.Menu = function(context, game, level){
	this.level = level;
	this.game = game;

	this.menu_graphics = this.game.add.graphics(0, 0);
	this.menu_graphics.lineStyle(0);
	this.menu_graphics.beginFill(0x121212, 0.7);
	this.menu_graphics.drawRect(0, 0, this.game.camera.width, this.game.camera.height);
	this.menu_graphics.visible = false;
	this.menu_graphics.fixedToCamera = true;

	this.menu_text = this.game.add.text(400, 100, 'Game is paused', { fill: '#ffffff' });
	this.menu_text.visible = false;
	this.menu_text.fixedToCamera = true;

	this.menu_resume = this.game.add.button(100, 200, 'resume');
	this.menu_resume.visible = false;
	this.menu_resume.fixedToCamera = true;
	this.menu_resume.hitArea = new Phaser.Rectangle(100, 200, 250, 50);

	this.menu_savenquit = this.game.add.button(100, 270, 'savenquit');
	this.menu_savenquit.visible = false;
	this.menu_savenquit.fixedToCamera = true;
	this.menu_savenquit.hitArea = new Phaser.Rectangle(100, 270, 350, 50);

	this.menu_quit = this.game.add.button(100, 340, 'quit');
	this.menu_quit.visible = false;
	this.menu_quit.fixedToCamera = true;
	this.menu_quit.hitArea = new Phaser.Rectangle(100, 340, 140, 50);

	this.menu_volume = this.game.add.text(120, 500, "Volume: " + this.game.sound.volume * 10, {fill: '#fff'});
	this.menu_volume.visible = false;
	this.menu_volume.fixedToCamera = true;

	this.menu_volume_up = this.game.add.button(270, 477, 'volumeup');
	this.menu_volume_up.visible = false;
	this.menu_volume_up.fixedToCamera = true;
	this.menu_volume_up.hitArea = new Phaser.Rectangle(270, 477, 100, 80);

	this.menu_volume_down = this.game.add.button(360, 495, 'volumedown');
	this.menu_volume_down.visible = false;
	this.menu_volume_down.fixedToCamera = true;
	this.menu_volume_down.hitArea = new Phaser.Rectangle(360, 495, 100, 80);

	this.volume = this.game.sound.volume;

	this.game.input.keyboard.callbackContext = this;
	this.game.input.keyboard.onUpCallback = function(event) {
		if(event.keyCode == Phaser.KeyCode.ESC) {
			this.game.paused = true;
			this.menu_resume.visible = true;
			this.menu_savenquit.visible = true;
			this.menu_quit.visible = true;
			this.menu_volume.visible = true;
			this.menu_volume_up.visible = true;
			this.menu_volume_down.visible = true;
			this.menu_text.visible = true;
			this.menu_graphics.visible = true;
		}
	};

	this.game.input.onDown.add(function(event){
		if (this.game.paused) {
			if (this.menu_resume.hitArea.contains(event.x, event.y)) {
				this.game.paused = false;
				this.menu_resume.visible = false;
				this.menu_savenquit.visible = false;
				this.menu_quit.visible = false;
				this.menu_volume.visible = false;
				this.menu_volume_up.visible = false;
				this.menu_volume_down.visible = false;
				this.menu_text.visible = false;
				this.menu_graphics.visible = false;
			} else if (this.menu_quit.hitArea.contains(event.x, event.y)) {
				if (confirm('Are you sure you want to quit?')) {
					window.location.replace("../index.php");
				}
			} else if (this.menu_savenquit.hitArea.contains(event.x, event.y)) {
				if (level != 4 && confirm('Are you sure you want to save and quit? You will be reset to the last checkpoint.')) {
					var save_data = {
						level: this.level,
						checkpoint: context.curSpawn,
						lives: this.game.playerLives
					};
					if (SideScroller.save_id) save_data.save_id = SideScroller.save_id;
					$.ajax({
						url: '../game/savegame.php',
						data: save_data, 
						method: 'post',
						success: function(data){
							window.location.replace('../index.php');
						}
					});
				} else if (confirm('Quit? You cannot save at the game over screen.')) {
					window.location.replace("../index.php");
				}
			} else if (this.menu_volume_up.hitArea.contains(event.x, event.y)) {
				var current = this.volume * 10;
				if (current < 10) {
					current++;
					this.menu_volume.setText('Volume: ' + current);
					current/= 10;
					this.volume = current;
				}
			} else if (this.menu_volume_down.hitArea.contains(event.x, event.y)) {
				var current = this.volume * 10;
				if (current > 0) {
					current--;
					this.menu_volume.setText('Volume: ' + current);
					current/= 10;
					this.volume = current;
				}
			}
		}
	}, this);
};