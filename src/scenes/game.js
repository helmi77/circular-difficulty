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
		this.bubbles.children.iterate(function (child) {
			child.setCollideWorldBounds(true);
			child.setGravityY(800);
			child.setBounce(1);
			child.setVelocityX(110);
			child.setAngularDrag(0);
			child.setDrag(0, -5.8);
			child.setFriction(0, 0);
			child.setMass(0);
			child.maxY = 100;
			child.sizeModifier = 1;
		});

		this.player = this.physics.add.sprite(width / 2, height - 50, 'player');
		this.player.setCollideWorldBounds(true);
		this.player.setGravityY(800);
		this.player.shooting = false;

		this.physics.add.overlap(this.player, this.bubbles, this.playerHit.bind(this));
		console.log(this.player);
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
	    bubble.destroy();
		bullet.destroy();
		this.player.shooting = false;
		if (typeof this.bulletTween !== 'undefined') {
			this.bulletTween.stop();
		}

		if (bubble.depth >= 2) 
			return;

		let leftBubble = this.bubbles.create(bubble.x, bubble.y, 'bubble');
		let rightBubble = this.bubbles.create(bubble.x, bubble.y, 'bubble');
		leftBubble.depth = rightBubble.depth = bubble.depth + 1 || 0;
		leftBubble.maxY = rightBubble.maxY = bubble.maxY + 100;
		leftBubble.sizeModifier = rightBubble.sizeModifier = bubble.sizeModifier - 0.2;

		leftBubble.setVelocityX(-110);
		leftBubble.setCollideWorldBounds(true);
		leftBubble.setBounce(1);
		leftBubble.setScale(leftBubble.sizeModifier);

		rightBubble.setVelocityX(110);
		rightBubble.setCollideWorldBounds(true);
		rightBubble.setBounce(1);
		rightBubble.setScale(rightBubble.sizeModifier);

		this.tweens.add({
			targets: [ leftBubble, rightBubble ],
			y: leftBubble.y - 150,
			duration: 700,
			ease: 'Sine.easeOut',
			onComplete: function () {
				if (leftBubble !== undefined && leftBubble.body !== undefined)
					leftBubble.setGravityY(800);
				if (rightBubble !== undefined && rightBubble.body !== undefined)
					rightBubble.setGravityY(800);
				}
		});
	}

	playerHit(player, bubble)
	{
		player.isAlive = false;
		this.gameOver();
	}

	gameOver() 
	{
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