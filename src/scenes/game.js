class GameScene extends Phaser.Scene 
{
	constructor() 
	{
		super({
			key: 'Game',
		});
		this.bubbleHeight = [];
		this.config = {
			'playerSpeed': 125,
		};
	}

	preload()
	{
	    this.load.image('bullet', 'assets/bullet.png');
	    this.load.image('bubble', 'assets/bubble.png');
	    this.load.image('player', 'assets/player.png');
	}
	
	create()
	{
		this.keys = this.input.keyboard.addKeys({
			'left': 65,
			'right': 68,
			'shoot': 87,
		});

		this.bubbles = this.physics.add.group({
			key: 'bubble',
			repeat: 2,
			setXY: {
				x: 110,
				y: 100,
				stepX: 45*4,
				stepY: 0
			}
		});
		this.bubbles.children.iterate(function (child) {
		    child.setCollideWorldBounds(true);
		    child.setGravityY(800);
		    child.setBounce(1);
		    child.setVelocityX(110);
		    child.setAngularDrag(0);
		    child.setDrag(0, -5.8);
		    child.setFriction(0, 0);
		    child.setMass(0);
		});

		this.player = this.physics.add.sprite(400, 580, 'player');
		this.player.setCollideWorldBounds(true);
		this.player.setGravityY(800);
	}

	update()
	{
		if (Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
			shoot.call(this);
			this.physics.add.overlap(this.bullet, this.bubbles, function (bullet, bubble) {
				bubble.destroy();
			});
		}

		if (this.keys.left.isDown) {
			this.player.setVelocityX(-1 * this.config.playerSpeed);
		} else if (this.keys.right.isDown) {
			this.player.setVelocityX(this.config.playerSpeed);
		} else {
			this.player.setVelocityX(0);
		}		
	}
}

function shoot() {
	let bullet = this.bullet = this.physics.add.sprite(this.player.x, 600, 'bullet');
	this.tweens.add({
		targets: this.bullet,
		scaleY: 600,
		duration: 2000,
		ease: 'Linear',
		onComplete: function () {
			bullet.destroy();
		}
	});
}

export default GameScene;