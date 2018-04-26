import Phaser from "phaser";
import GameScene from "./scenes/game";

let config = {
	backgroundColor: "#f0f8ff",
	type: Phaser.AUTO,
	parent: "game",
	physics: {
		default: "arcade"
	},
	width: 800,
	height: 600,
	scene: [
		GameScene
	]
};

new Phaser.Game(config);