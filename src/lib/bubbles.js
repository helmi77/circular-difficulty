export default class extends Phaser.Physics.Arcade.Group
{
	static get KEY() { return "bubble"; }

	constructor(scene)
	{
		super(scene.physics.world, scene);

		scene.physics.add.existing(this);
	}

	createFromParent(parent)
	{
		let bubble = this.create(parent.x, parent.y, this.constructor.KEY);
		bubble.parent = parent;
		bubble.depth = parent.depth + 1 || 0;
		bubble.maxY = parent.maxY + 100;
		bubble.sizeModifier = parent.sizeModifier - 0.2;
		bubble.setScale(bubble.sizeModifier);		
		bubble.setCollideWorldBounds(true);
		bubble.setBounceX(1);
		return bubble;
	}
	createMultiple(config)
	{
		super.createMultiple(config);
		this.children.iterate(child => {
			child.setCollideWorldBounds(true);
			child.setGravityY(800);
			child.setBounce(1);
			child.setVelocityX(110);
			child.maxY = 100;
			child.sizeModifier = 1;
		});
	}

	split(bubble)
	{
	    bubble.destroy();
		if (bubble.depth !== undefined && bubble.depth >= 2) 
			return;

		let leftBubble = this.createFromParent(bubble);
		let rightBubble = this.createFromParent(bubble);

		leftBubble.setVelocityX(-110);
		rightBubble.setVelocityX(110);		

		this.scene.tweens.add({
			targets: [ leftBubble, rightBubble ],
			y: leftBubble.y - 150,
			duration: 700,
			ease: 'Sine.easeOut',
			onComplete: () => {
				if (leftBubble !== undefined && leftBubble.body !== undefined)
					leftBubble.setGravityY(800);
				if (rightBubble !== undefined && rightBubble.body !== undefined)
					rightBubble.setGravityY(800);
				}
		});
	}

	hitCeiling(bubble)
	{
		bubble.destroy();
	}
	hitFloor(bubble)
	{
		if (bubble.parent === undefined)
			return;

		// TODO: Calculate duration based on diff between current Y and target Y
		if (bubble.hadFirstBounce === undefined || !bubble.hadFirstBounce) {
			console.log("bounce");
			bubble.setGravityY(0);
			bubble.setBounceY(0);
			bubble.hadFirstBounce = true;
			this.scene.tweens.add({
				targets: bubble,
				y: bubble.maxY,
				duration: 700,
				ease: 'Sine.easeOut',
				onComplete: () => {
					if (bubble !== undefined) {
						bubble.setBounceY(1);
						bubble.setGravityY(800);
					}
				}
			})
		}
	}

	stop()
	{
		this.children.iterate(child => {
			child.setGravityY(0);
			child.setVelocity(0);
		});
	}
}