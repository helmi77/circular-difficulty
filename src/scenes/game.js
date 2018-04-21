import Bullet from '../lib/bullet';
import Bubbles from '../lib/bubbles';
import Player from '../lib/player';

class GameScene extends Phaser.Scene 
{
	constructor() 
	{
		super('Game');
	}

	preload()
	{
		this.load.image(Player.KEY, 'assets/player.png');
		this.load.image(Bubbles.KEY, 'assets/bubble.png');
		this.load.image(Bullet.KEY, 'assets/bullet.png');
	}
	
	create()
	{
		let height = this.sys.game.config.height;
		let width = this.sys.game.config.width;

		this.player = new Player(this, width / 2, height - 50);
		this.bubbles = new Bubbles(this);
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

		this.physics.add.overlap(this.player, this.bubbles, this.player.hit.bind(this));

		this.keys = this.input.keyboard.addKeys({
			'left': 65,
			'right': 68,
			'shoot': 87,
		});
	}

	update()
	{
		if (!this.player.isAlive())
			return;

		this.player.update();
	}

	gameOver() 
	{
		this.tweens.killAll();
		this.player.setVelocityX(0);
		this.bubbles.stop();
		
		this.cameras.main.fade(250);
		this.time.delayedCall(250, () => {
			this.scene.restart();
			this.cameras.main.fadeFrom(250, (camera, progress) => {
				if (progress === 1)
					cameras.resetFX();
			});
		}, [], this);
	}
}

export default GameScene;