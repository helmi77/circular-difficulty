import Bullet from '../lib/bullet';

export default class Player extends Phaser.Physics.Arcade.Sprite
{
	static get KEY() { return "player"; }

	constructor(scene, x, y)
	{
		super(scene, x, y, Player.KEY);

        scene.sys.displayList.add(this);
        scene.sys.updateList.add(this);
        scene.physics.add.existing(this);

		this.setCollideWorldBounds(true);
		this.setGravityY(800);
		this.shooting = false;
	}

	isAlive()
	{
		return this.alive === undefined || this.alive;
	}

	update()
	{
		if (!this.shooting && Phaser.Input.Keyboard.JustDown(this.scene.keys.shoot)) {
			this.shoot();
			this.scene.physics.add.overlap(this.bullet, this.scene.bubbles, this.bubbleHit.bind(this));
		}

		if (this.scene.keys.left.isDown) {
			this.setVelocityX(-1 * 125);
		} else if (this.scene.keys.right.isDown) {
			this.setVelocityX(125);
		} else {
			this.setVelocityX(0);
		}
	}

	hit(player, bubble)
	{
		player.alive = false;
		this.gameOver();
	}

	bubbleHit(bullet, bubble)
	{
		if (!this.isAlive())
			return;

		this.stopShooting();
		this.scene.bubbles.split(bubble);
	}

	shoot() 
	{
		this.shooting = true;
		this.bullet = new Bullet(this.scene, this);
	}

	stopShooting()
	{
		this.shooting = false;
		this.bullet.stop();
	}
}