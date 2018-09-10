﻿/// <reference path="phaser.d.ts"/>

// Demonstrate the use of arrow keys in a Phaser app
// This application demonstrates creation of a Cursor and polling for input
class SimpleGame {
    //The game itself
    game: Phaser.Game;
    //Car sprite
    car: Phaser.Sprite;
    //The four arrows
    cursors: Phaser.CursorKeys;
    //W key
    W: Phaser.Key;
    //A key
    A: Phaser.Key;
    //S key
    S: Phaser.Key;
    //D key
    D: Phaser.Key;

    //Creates the game graphically
    constructor() {
        this.game = new Phaser.Game(640, 480, Phaser.AUTO, 'content', {
            create: this.create, preload: this.preload,
            update: this.update
        });
    }

    //Load in all the graphical content
    preload() {
        this.game.load.image("racer", "racer.png");
    }

    //Initialize all the objects within the game
    create() {
        //Initiate the physics engine
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Load in the image of the racer to get the proper dimensions
        var image0 = <Phaser.Image>this.game.cache.getImage("racer");

        //Create the car as a sprite with the loaded content
        this.car = this.game.add.sprite(this.game.width / 2 - image0.width / 2, this.game.height / 2 - image0.height / 2, "racer");

        //Se the pivot point to the center of the car
        this.car.anchor.set(0.5);

        //Enable the arcade physics interactions
        this.game.physics.enable(this.car, Phaser.Physics.ARCADE);

        //Set car to stay on screen
        this.car.body.collideWorldBounds = true;
        //Set the bounciness of the car
        this.car.body.bounce.set(0.8);
        //Allow the car body to be rotated by us
        this.car.body.allowRotation = true;
        //Set the car to be infinite weight
        this.car.body.immovable = true;

        // create the cursor key object
        this.cursors = this.game.input.keyboard.createCursorKeys();

        // create the WASD movements
        this.W = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    }

    update() {
        // Update input state
        this.game.input.update();

        //Set velocities to zero so we can directly manipulate them each frame
        this.car.body.velocity.x = 0;
        this.car.body.velocity.y = 0;
        this.car.body.angularVelocity = 0;

        //Angular rotations given by A/l and D/r
        if (this.cursors.left.isDown || this.A.isDown)
            this.car.body.angularVelocity = -200;
        else if (this.cursors.right.isDown || this.D.isDown)
            this.car.body.angularVelocity = 200;

        //Driving pedals given by W/u and S/d
        if (this.cursors.up.isDown || this.W.isDown)
            this.car.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.car.angle, 300));
        else if (this.cursors.down.isDown || this.S.isDown)
            this.car.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.car.angle, -100));
    }
}

window.onload = () => {
    var game = new SimpleGame();
};