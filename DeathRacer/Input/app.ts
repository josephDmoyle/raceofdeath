﻿/// <reference path="phaser.d.ts"/>

// Demonstrate the use of arrow keys in a Phaser app
// This application demonstrates creation of a Cursor and polling for input
class SimpleGame {
    //The game itself
    game: Phaser.Game;
    //Car sprite
    car: Phaser.Sprite;
    //Secret Second Player
    car2: Phaser.Sprite;
    //The guys to hit
    guys: Phaser.Group;
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
    //Space key
    Space: Phaser.Key;
    //Scream sound
    s1: Phaser.Sound;
    //Text object for display
    scoreText: Phaser.Text;
    //Kill count
    score;
    //Text object for displaying the time
    timeText: Phaser.Text;
    //Timer object for displaying the time
    timer: Phaser.Timer;

    //Creates the game graphically
    constructor() {
        this.game = new Phaser.Game(640, 480, Phaser.CANVAS, 'content', {
            create: this.create, preload: this.preload,
            update: this.update, render: this.render
        });
    }

    //Load in all the graphical content
    preload() {
        this.game.load.image("racer", "racer.png");
        this.game.load.image("guy0", "guy0.png");
        this.game.load.image("guy1", "guy1.png");
        this.game.load.image("dead", "dead.png");
        this.game.load.spritesheet("guy", "guy.png", 32, 32, 2);
        this.game.load.audio("s1", "s1.mp3");
    }

    //Initialize all the objects within the game
    create() {
        //Initiate the physics engine
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.scoreText = this.game.add.text(32, 32, "KILLS: ");
        this.scoreText.fill = "white";
        this.score = 0;

        this.timeText = this.game.add.text(32, 64, "TIME: ");
        this.timeText.fill = "white";

        this.timer = this.game.time.create(false);

        this.timer.loop(30000, this.updateCounter, this);

        this.timer.start();

        this.guys = this.game.add.group();
        this.guys.enableBody = true;

        this.s1 = this.game.add.audio("s1");
        this.s1.allowMultiple = true;

        for (var i = 0; i < 2; i++) {
            var s = this.guys.create(this.game.world.randomX, this.game.world.randomY, 'guy', 5);
            s.name = 'guy' + s;
            s.body.collideWorldBounds = true;
            s.body.bounce.setTo(0.8, 0.8);
            s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
            s.anchor.set(0.5);
            var anim = s.animations.add("guy");
            anim.play(10, true);
        }

        //Load in the image of the racer to get the proper dimensions
        var carImage = this.game.cache.getImage("racer");

        //Create the car as a sprite with the loaded content
        this.car = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, "racer");

        //Create the car as a sprite with the loaded content
        //this.car2 = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, "racer");



        //Set the pivot point to the center of the car
        this.car.anchor.set(0.5);

        //Set the pivot point to the center of the car
        //this.car2.anchor.set(0.5);

        //Enable the arcade physics interactions
        this.game.physics.arcade.enable(this.car);

        //Enable the arcade physics interactions
        //this.game.physics.arcade.enable(this.car2);

        //Set car to stay on screen
        this.car.body.collideWorldBounds = true;
        //Set the bounciness of the car
        this.car.body.bounce.set(0.8);
        //Allow the car body to be rotated by us
        this.car.body.allowRotation = true;
        //Set the car to be infinite weight
        this.car.body.immovable = true;

        //Set car to stay on screen
        //this.car2.body.collideWorldBounds = true;
        //Set the bounciness of the car
        //this.car2.body.bounce.set(0.8);
        //Allow the car body to be rotated by us
        //this.car2.body.allowRotation = true;
        //Set the car to be infinite weight
        //this.car2.body.immovable = true;

        // create the cursor key object
        this.cursors = this.game.input.keyboard.createCursorKeys();

        // create the WASD movements
        this.W = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.Space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    update() {
        // Update input state
        this.game.input.update();


        //this.game.physics.arcade.collide(this.car, this.car2);

        //Process collisions with car to guys
        this.guys.forEachAlive(function (guy) {
            //if (this.game.physics.arcade.collide(this.car, guy) || this.game.physics.arcade.collide(this.car2, guy)) {
            if (this.game.physics.arcade.collide(this.car, guy)) {
                this.score++;
                var grave = this.game.add.sprite(guy.x, guy.y, "dead");
                grave.scale.set(guy.scale.x, 1);
                guy.x = this.game.world.randomX;
                guy.y = this.game.world.randomY;
                guy.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
                this.s1.play();
            }
            if (guy.body.velocity.x < 0) {
                guy.scale.set(-1, 1);
            }
            else {
                guy.scale.set(1, 1);
            }

        }, this);

        //Set velocities to zero so we can directly manipulate them each frame
        this.car.body.velocity.x = 0;
        this.car.body.velocity.y = 0;
        this.car.body.angularVelocity = 0;

        //Set velocities to zero so we can directly manipulate them each frame
        //this.car2.body.velocity.x = 0;
        //this.car2.body.velocity.y = 0;
        //this.car2.body.angularVelocity = 0;

        //Angular rotations given by A/l and D/r
        if (this.A.isDown)
            this.car.body.angularVelocity = -200;
        else if (this.D.isDown)
            this.car.body.angularVelocity = 200;
        //Driving pedals given by W/u and S/d
        if (this.W.isDown)
            this.car.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.car.angle, 300));
        else if (this.S.isDown)
            this.car.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.car.angle, -100));

        //Angular rotations given by A/l and D/r
        //if (this.cursors.left.isDown)
          //  this.car2.body.angularVelocity = -200;
        //else if (this.cursors.right.isDown)
          //  this.car2.body.angularVelocity = 200;
        //Driving pedals given by W/u and S/d
        //if (this.cursors.up.isDown)
          //  this.car2.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.car2.angle, 300));
        //else if (this.cursors.down.isDown)
          //  this.car2.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.car2.angle, -100));
    }

    render() {
        this.scoreText.text = "KILLS: " + this.score;
        var tiempo = Math.abs(30 - this.timer.seconds).toFixed(0);
        this.timeText.text = "TIME: " + tiempo;
    }

    updateCounter() {
        var q = 0;
    }
}

window.onload = () => {
    var game = new SimpleGame();
};
