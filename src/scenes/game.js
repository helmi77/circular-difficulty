class GameScene extends Phaser.Scene 
{
	constructor() 
	{
		super({
			key: 'Game',
		});
		this.config = {
			'playerSpeed': 125,
		};
	}

	preload()
	{
	    this.load.image('bubble', 'assets/bubble.png');
	    this.load.image('player', 'assets/player.png');
	}
	
	create()
	{
		this.keys = this.input.keyboard.addKeys({
			'left': 65,
			'right': 68,
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
		    child.setVelocityX(100);
		});

		this.player = this.physics.add.sprite(400, 580, 'player');
		this.player.setCollideWorldBounds(true);
		this.player.setGravityY(800);
	}

	update()
	{
		if (this.keys.left.isDown)
		{
			this.player.setVelocityX(-1 * this.config.playerSpeed);
		}
		else if (this.keys.right.isDown)
		{
			this.player.setVelocityX(this.config.playerSpeed);
		}
		else
		{
			this.player.setVelocityX(0);
		}
		/*this.physics.overlap(this.bubbles[0], this.bubbles[1], function () {});*/
	}
}

export default GameScene;