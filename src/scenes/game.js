import Phaser from "phaser";
import Bullet from "../lib/bullet";
import Bubbles from "../lib/bubbles";
import Player from "../lib/player";

class GameScene extends Phaser.Scene 
{
	constructor() 
	{
		super("Game");
	}

	preload()
	{
		this.load.image(Player.KEY, "assets/player.png");
		this.load.image(Bubbles.KEY, "assets/bubble.png");
		this.load.image(Bullet.KEY, "assets/bullet.png");
	}
	
	create()
	{
		let height = this.sys.game.config.height;
		let width = this.sys.game.config.width;

		this.player = new Player(this, width / 2, height - 100);
		this.bubbles = new Bubbles(this);
		this.bubbles.createMultiple({
			key: Bubbles.KEY,
			repeat: 2,
			setXY: {
				x: 100,
				y: 200,
				stepX: 45*4,
				stepY: 0
			}
		});

		this.floor = this.physics.add.staticSprite(0, 550, "bullet");
		this.floor.setOrigin(0).setScale(800, 20).refreshBody();

		this.ceiling = this.physics.add.staticSprite(0, 0, "bullet");
		this.ceiling.setOrigin(0).setScale(800, 20).refreshBody();

		this.physics.add.collider(this.bubbles, this.ceiling, (_, bubble) => this.bubbles.hitCeiling(bubble));
		this.physics.add.collider(this.bubbles, this.floor, (_, bubble) => this.bubbles.hitFloor(bubble));
		this.physics.add.collider(this.player, this.floor);

		this.physics.add.overlap(this.player, this.bubbles, this.player.hit.bind(this));

		this.keys = this.input.keyboard.addKeys({
			"left": 65,
			"right": 68,
			"shoot": 87,
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
					camera.resetFX();
			});
		}, [], this);
	}
}

export default GameScene;