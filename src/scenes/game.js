class GameScene extends Phaser.Scene 
{
	constructor() 
	{
		super({
			key: 'Game',
		});
		this.bubbles = [];
	}

	preload()
	{
	    this.load.image('bubble', 'assets/bubble.png');
	}
	
	create() 
	{
		console.log(this);

	    let bubble = this.physics.add.sprite(0, 600, 'bubble');
	    bubble.setOrigin(0, 1);
	    //bubble.body.collideWorldBounds = true;

	    this.tweens.add({
	        targets: bubble,
	        x: 800,
	        duration: 6000,
	        ease: 'Linear',
	        yoyo: true,
	        loop: -1
	    });
	    this.tweens.add({
	        targets: bubble,
	        y: 300,
	        duration: 750,
	        ease: 'Sine.easeOut',
	        yoyo: true,
	        loop: -1
	    });
	}

	update()
	{
		/*this.physics.overlap(this.bubbles[0], this.bubbles[1], function () {
			
		});*/
	}
}

export default GameScene;