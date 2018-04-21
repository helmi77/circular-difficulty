import Bubbles from '../lib/bubbles';
import Player from '../lib/player';

class GameScene extends Phaser.Scene 
{
	constructor() 
	{
		super({
			key: 'Game',
		});
		this.config = {
			playerSpeed: 125,
		};
	}

	preload()
	{
		this.load.image('player', 'assets/player.png');
		this.load.image(Bubbles.KEY, 'assets/bubble.png');
		this.load.image('bullet', 'assets/bullet.png');
	}
	
	create()
	{
		this.bubbles = new Bubbles(this);
		this.physics.add.existing(this.bubbles);

		let height = this.sys.game.config.height;
		let width = this.sys.game.config.width;

		this.keys = this.input.keyboard.addKeys({
			'left': 65,
			'right': 68,
			'shoot': 87,
		});

		this.bubbles.createMultiple({
			key: Bubbles.KEY,
			repeat: 2,
			setXY: {
				x: 100,
				y: 100,
				stepX: 45*4,
				stepY: 0
			}
		});

		this.player = this.physics.add.sprite(width / 2, height - 50, 'player');
		this.player.setCollideWorldBounds(true);
		this.player.setGravityY(800);
		this.player.shooting = false;

		this.physics.add.overlap(this.player, this.bubbles, this.playerHit.bind(this));
	}

	update()
	{
		if (this.player.isAlive !== undefined && !this.player.isAlive)
			return;

		if (!this.player.shooting && Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
			shoot.call(this);
			this.physics.add.overlap(this.bullet, this.bubbles, this.bubbleHit.bind(this));
		}

		if (this.keys.left.isDown) {
			this.player.setVelocityX(-1 * this.config.playerSpeed);
		} else if (this.keys.right.isDown) {
			this.player.setVelocityX(this.config.playerSpeed);
		} else {
			this.player.setVelocityX(0);
		}
	}

	bubbleHit(bullet, bubble)
	{
		if (this.player.isAlive !== undefined && !this.player.isAlive)
			return;

		bullet.destroy();
		this.player.shooting = false;
		if (typeof this.bulletTween !== 'undefined') {
			this.bulletTween.stop();
		}

		this.bubbles.split(bubble);
	}

	playerHit(player, bubble)
	{
		player.isAlive = false;
		this.gameOver();
	}

	gameOver() 
	{
		this.tweens.killAll();
		this.player.setVelocityX(0);
		this.bubbles.stop();
		
		this.cameras.main.fade(250);
		this.time.delayedCall(250, function() {
			this.scene.restart();
			this.cameras.main.fadeFrom(250, function (camera, progress) {
				if (progress === 1)
					cameras.resetFX();
			});
		}, [], this);
	}
}

function shoot() {
	let that = this;
	let height = this.sys.game.config.height;
	let bullet = this.bullet = this.physics.add.sprite(this.player.x, height, 'bullet');
	this.player.shooting = true;
	this.bulletTween = this.tweens.add({
		targets: this.bullet,
		scaleY: height,
		duration: 2000,
		ease: 'Linear',
		onComplete: function () {
			bullet.destroy();
			that.player.shooting = false;
		}
	});
}

export default GameScene;