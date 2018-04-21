export default class
{
	static get KEY() { return "player"; }

	constructor(scene)
	{
		this.key = 'player';
		this.scene = scene;
	}

	preload()
	{
	}

	stop()
	{
		this.group.children.iterate(function (child) {
			child.setGravityY(0);
			child.setVelocity(0);
		});
	}
}