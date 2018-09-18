/// <reference path="phaser.d.ts"/>
var game = new Phaser.Game(640, 480, Phaser.CANVAS, 'content', {
    create: create, preload: preload,
    update: update, render: render
});
//Car sprite
var car1;
//Secret Second Player
var car2;
//The guys to hit
var guys;
//The graves to hit
var graves;
//The four arrows
var cursors;
//W key
var W;
//A key
var A;
//S key
var S;
//D key
var D;
//Space key
var Space;
//Scream sound
var s1;
//Text object for display
var scoreText;
//Kill count
var score;
//Prev Score
var prevScore;
//Text object for displaying the time
var timeText;
//Timer object for displaying the time
var timer;
//Time Count
var time;
//0 for base, 1 for clearing
var state;
//Global round
var round;
//Load in all the graphical content
function preload() {
    game.load.image("racer", "racer.png");
    game.load.image("guy0", "guy0.png");
    game.load.image("guy1", "guy1.png");
    game.load.image("dead", "dead.png");
    game.load.spritesheet("guy", "guy.png", 32, 32, 2);
    game.load.audio("s1", "s1.mp3");
}
//Initialize all the objects within the game
function create() {
    //Initiate the physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);
    scoreText = game.add.text(32, 32, "KILLS: ");
    scoreText.fill = "white";
    score = 0;
    prevScore = score;
    round = 0;
    state = 0;
    timeText = game.add.text(32, 64, "TIME: ");
    timeText.fill = "white";
    timer = game.time.create(false);
    timer.loop(1000, updateCounter, this);
    timer.start();
    time = 10;
    guys = game.add.group();
    guys.enableBody = true;
    graves = game.add.group();
    graves.enableBody = true;
    s1 = game.add.audio("s1");
    s1.allowMultiple = true;
    for (var i = 0; i < 6; i++) {
        var s = guys.create(game.world.randomX, game.world.randomY, 'guy', 5);
        s.name = 'guy' + s;
        s.body.collideWorldBounds = true;
        s.body.bounce.setTo(0.8, 0.8);
        s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
        s.anchor.set(0.5);
        var anim = s.animations.add("guy");
        anim.play(10, true);
    }
    //Load in the image of the racer to get the proper dimensions
    var carImage = game.cache.getImage("racer");
    //Create the car as a sprite with the loaded content
    car1 = game.add.sprite(game.world.randomX, game.world.randomY, "racer");
    car1.scale.set(0.1, 0.1);
    //Create the car as a sprite with the loaded content
    car2 = game.add.sprite(game.world.randomX, game.world.randomY, "racer");
    car2.scale.set(0.1, 0.1);
    //Set the pivot point to the center of the car
    car1.anchor.set(0.5);
    //Set the pivot point to the center of the car
    car2.anchor.set(0.5);
    //Enable the arcade physics interactions
    game.physics.arcade.enable(car1);
    //Enable the arcade physics interactions
    game.physics.arcade.enable(car2);
    //Set car to stay on screen
    car1.body.collideWorldBounds = true;
    //Set the bounciness of the car
    car1.body.bounce.set(0.8);
    //Allow the car body to be rotated by us
    car1.body.allowRotation = true;
    //Set car to stay on screen
    car2.body.collideWorldBounds = true;
    //Set the bounciness of the car
    car2.body.bounce.set(0.8);
    //Allow the car body to be rotated by us
    car2.body.allowRotation = true;
    // create the cursor key object
    cursors = game.input.keyboard.createCursorKeys();
    // create the WASD movements
    W = game.input.keyboard.addKey(Phaser.Keyboard.W);
    A = game.input.keyboard.addKey(Phaser.Keyboard.A);
    S = game.input.keyboard.addKey(Phaser.Keyboard.S);
    D = game.input.keyboard.addKey(Phaser.Keyboard.D);
    Space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}
function update() {
    // Update input state
    game.input.update();
    game.physics.arcade.collide(guys, graves);
    //Set cart velocities to zero so we can directly manipulate them each frame
    car1.body.velocity.x = 0;
    car1.body.velocity.y = 0;
    car1.body.angularVelocity = 0;
    car2.body.velocity.x = 0;
    car2.body.velocity.y = 0;
    car2.body.angularVelocity = 0;
    switch (state) {
        case 0:
            //Process collisions with car to guys
            game.physics.arcade.collide(car1, graves);
            //Process collisions with car to guys
            game.physics.arcade.collide(car1, guys, vehicularManslaughter, null);
            //Angular rotations given by A/l and D/r
            if (A.isDown)
                car1.body.angularVelocity = -200;
            else if (D.isDown)
                car1.body.angularVelocity = 200;
            //Driving pedals given by W/u and S/d
            if (W.isDown)
                car1.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(car1.angle, 300));
            else if (S.isDown)
                car1.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(car1.angle, -100));
            break;
        default:
            //Process collisions with car to guys
            game.physics.arcade.collide(car2, graves, graveRobber, null);
            //Angular rotations given by A/l and D/r
            if (A.isDown)
                car2.body.angularVelocity = -200;
            else if (D.isDown)
                car2.body.angularVelocity = 200;
            //Driving pedals given by W/u and S/d
            if (W.isDown)
                car2.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(car2.angle, 300));
            else if (S.isDown)
                car2.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(car2.angle, -100));
            break;
    }
}
function render() {
    scoreText.text = "KILLS: " + score;
    timeText.text = "TIME: " + time;
    guys.forEachAlive(function (guy) {
        if (guy.body.velocity.x < 0) {
            guy.scale.set(-1, 1);
        }
        else {
            guy.scale.set(1, 1);
        }
    }, this);
}
function vehicularManslaughter(car, guy) {
    score++;
    var grave = graves.create(guy.x, guy.y, 'dead', 5);
    grave.anchor.set(0.5);
    grave.scale.set(guy.scale.x, 1);
    grave.body.immovable = true;
    guy.x = game.world.randomX;
    guy.y = game.world.randomY;
    guy.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    s1.play();
}
function graveRobber(car, grave) {
    grave.kill();
}
function updateCounter() {
    switch (state) {
        case 0:
            if (time > 0)
                time--;
            if (time == 0) {
                state = 1;
                time = 5;
                round++;
            }
            if (score == prevScore) {
                //you lose
            }
            break;
        default:
            if (time > 0)
                time--;
            if (time == 0) {
                prevScore = score;
                state = 0;
                time = 10;
                if (round % 6 == 0) {
                    for (var i = 0; i < 6; i++) {
                        var s = guys.create(game.world.randomX, game.world.randomY, 'guy', 5);
                        s.name = 'guy' + s;
                        s.body.collideWorldBounds = true;
                        s.body.bounce.setTo(0.8, 0.8);
                        s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
                        s.anchor.set(0.5);
                        var anim = s.animations.add("guy");
                        anim.play(10, true);
                    }
                }
            }
            break;
    }
}
//# sourceMappingURL=app.js.map