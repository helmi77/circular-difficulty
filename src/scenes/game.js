class GameScene extends Phaser.Scene 
{
	constructor() 
	{
		super({
			key: 'Game',
		});
		this.bubbleHeight = [];
		this.config = {
			playerSpeed: 125,
		};

		let that = this;
		window.addEventListener('deviceorientation', function (e) {
			that.handleOrientation(e);
		});
	}

	preload()
	{
	    this.load.image('bullet', 'assets/bullet.png');
	    this.load.image('bubble', 'assets/bubble.png');
	    this.load.image('player', 'assets/player.png');
	}
	
	create()
	{
		let height = this.sys.game.config.height;
		let width = this.sys.game.config.width;

		this.keys = this.input.keyboard.addKeys({
			'left': 65,
			'right': 68,
			'shoot': 87,
		});

		this.bubbles = this.physics.add.group({
			key: 'bubble',
			repeat: 2,
			setXY: {
				x: 100,
				y: 100,
				stepX: 45*4,
				stepY: 0
			}
		});
		console.log(this);
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

		this.player = this.physics.add.sprite(width / 2, height - 50, 'player');
		this.player.setCollideWorldBounds(true);
		this.player.setGravityY(800);
	}

	update()
	{
		if (!this.shooting && Phaser.Input.Keyboard.JustDown(this.keys.shoot)) {
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
	
	handleOrientation(e) 
	{
		if (typeof e === 'undefined') return
		if (e.gamma < 0)
			this.player.setVelocityX(this.config.playerSpeed);
		else if (e.gamma > 0)
			this.player.setVelocityX(-1 * this.config.playerSpeed);
	}
}


function shoot() {
	let that = this;
	let height = this.sys.game.config.height;
	let bullet = this.bullet = this.physics.add.sprite(this.player.x, height, 'bullet');
	this.shooting = true;
	this.tweens.add({
		targets: this.bullet,
		scaleY: height,
		duration: 2000,
		ease: 'Linear',
		onComplete: function () {
			bullet.destroy();
			that.shooting = false;
		}
	});
}


export default GameScene;