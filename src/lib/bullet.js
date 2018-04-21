export default class Bullet extends Phaser.Physics.Arcade.Sprite
{
	static get KEY() { return "bullet"; }

	constructor(scene, player)
	{
		super(scene, player.x, scene.sys.game.config.height, Bullet.KEY);

		scene.sys.displayList.add(this);
		scene.sys.updateList.add(this);
		scene.physics.add.existing(this);

		let bullet = this;
		this.tween = scene.tweens.add({
			targets: this,
			scaleY: scene.sys.game.config.height,
			duration: 2000,
			ease: 'Linear',
			onComplete: () => {
				bullet.destroy();
				player.shooting = false;
			}
		});
	}

	stop()
	{
		if (this.tween !== undefined)
			this.tween.stop();		
		this.destroy();
	}
}