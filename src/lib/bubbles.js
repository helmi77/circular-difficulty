export default class extends Phaser.Physics.Arcade.Group
{
	static get KEY() { return "bubble"; }

	static get COLORS()
	{
		return [
			0x90244e, 0x439c2d, 0x2d639c
		];
	}

	constructor(scene)
	{
		super(scene.physics.world, scene);

		scene.physics.add.existing(this);
	}

	createFromParent(parent)
	{
		let bubble = this.create(parent.x, parent.y, this.constructor.KEY);
		bubble.parent = parent;
		bubble.maxY = parent.maxY + 150;
		bubble.depth = parent.depth + 1 || 0;
		bubble.sizeModifier = parent.sizeModifier - 0.35;
		bubble.setTint(this.constructor.COLORS[bubble.depth]);
		bubble.setScale(bubble.sizeModifier);
		bubble.setCollideWorldBounds(true);
		bubble.setBounceX(1);
		return bubble;
	}
	createMultiple(config)
	{
		super.createMultiple(config);
		this.children.iterate(child => {
			child.maxY = 150;
			child.sizeModifier = 1;
			child.setCollideWorldBounds(true);
			child.setGravityY(600);
			child.setBounceX(1);
			child.setVelocityX(110);
			child.setTint(this.constructor.COLORS[0]);
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

		// TODO: Larger bubbles fly lower
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
		// TODO: Calculate duration based on diff between current Y and target Y
		bubble.setGravityY(0);
		bubble.setBounceY(0);
		bubble.hadFirstBounce = true;
		this.scene.tweens.add({
			targets: bubble,
			y: bubble.maxY,
			duration: 1100 - bubble.maxY,
			ease: 'Sine.easeOut',
			onComplete: () => {
				if (bubble !== undefined && bubble.body !== undefined) {
					bubble.setGravityY(800);
				}
			}
		})
	}

	stop()
	{
		this.children.iterate(child => {
			child.setGravityY(0);
			child.setVelocity(0);
		});
	}
}