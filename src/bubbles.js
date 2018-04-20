class Bubbles
{
	constructor(scene)
	{
		this.key = 'bubble';
		this.scene = scene;
	}

	preload()
	{
		this.scene.load.image(this.key, 'assets/bubble.png');
	}

	add(parent)
	{
		let bubble = this.group.create(parent.x, parent.y, this.key);
		bubble.depth = parent.depth + 1 || 0;
		bubble.maxY = parent.maxY + 100;
		bubble.sizeModifier = parent.sizeModifier - 0.2;
		bubble.setScale(bubble.sizeModifier);		
		bubble.setBounce(1);
		bubble.setCollideWorldBounds(true);
		return bubble;
	}
	addMultiple(config)
	{
		config['key'] = this.key;
		this.group = this.scene.physics.add.group(config);
		this.group.children.iterate(function (child) {
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

		let leftBubble = this.add(bubble);
		let rightBubble = this.add(bubble);

		leftBubble.setVelocityX(-110);
		rightBubble.setVelocityX(110);		

		this.scene.tweens.add({
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

	stop()
	{
		this.group.children.iterate(function (child) {
			child.setGravityY(0);
			child.setVelocity(0);
		});
	}
}

export default Bubbles;