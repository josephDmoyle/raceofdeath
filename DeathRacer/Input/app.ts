/// <reference path="phaser.d.ts"/>

var game = new Phaser.Game(1600, 900, Phaser.CANVAS, 'content', {
    create: create, preload: preload,
    update: update, render: render
});


//Car sprite
var car1;
//Secret Second Player
var car2;
//The guys to hit
var guys;
//The bounds to hit
var walls;
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
//Grave sound
var crunch;
//Metal song
var metal;
//Text object for display
var scoreText;
//Kill count
var score;
//Prev Score
var prevScore;
//Text object for displaying the time
var timeText;
//Text object for displaying the time
var waveText;
//Timer object for displaying the time
var timer;
//Time Count
var time;
//0 for base, 1 for clearing
var state;
//Global round
var round;

var lightning;

//Load in all the graphical content
function preload() {
    game.load.image("racer", "racer.png");
    game.load.image("guy0", "guy0.png");
    game.load.image("guy1", "guy1.png");
    game.load.image("dead", "dead.png");
    game.load.image("wallU", "wallU.png");
    game.load.image("wallD", "wallD.png");
    game.load.image("wallL", "wallL.png");
    game.load.image("wallR", "wallR.png");
    game.load.image("graveyard", "graveyard.png");
    game.load.image("lightning", "lightning.png");
    game.load.spritesheet("guy", "guy.png", 40, 40, 2);
    game.load.audio("s1", "s1.mp3");
    game.load.audio("crunch", "crunch.mp3");
    game.load.audio("metal", "metal.mp3");
}

//Initialize all the objects within the game
function create() {
    var graveyard = game.add.sprite(403, 68, "graveyard");

    walls = game.add.group();
    walls.enableBody = true;
    var wallU = walls.create(0, 0, 'wallU', 1);
    wallU.body.immovable = true;
    wallU.body.moves = false;
    wallU.body.allowGravity = false;
    var wallD = walls.create(0, 856, 'wallD', 1);
    wallD.body.immovable = true;
    wallD.body.moves = false;
    wallD.body.allowGravity = false;
    var wallL = walls.create(0, 0, 'wallL', 1);
    wallL.body.immovable = true;
    wallL.body.moves = false;
    wallL.body.allowGravity = false;
    var wallR = walls.create(1198, 0, 'wallR', 1);
    wallR.body.immovable = true;
    wallR.body.moves = false;
    wallR.body.allowGravity = false;

    lightning = game.add.sprite(0, 0, "lightning");
    lightning.visible = false;

    //Initiate the physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    scoreText = game.add.text(1348, 426, "0");
    scoreText.fill = "red";

    score = 0;
    prevScore = score;

    round = 0;
    state = 0;

    timeText = game.add.text(1348, 354, "0");
    timeText.fill = "red";

    waveText = game.add.text(1348, 507, "0");
    waveText.fill = "red";

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

    crunch = game.add.audio("crunch");
    crunch.allowMultiple = true;

    metal = game.add.audio("metal");
    metal.allowMultiple = false;
    metal.play();


    for (var i = 0; i < 6; i++) {
        spawnGuys();
    }

    //Load in the image of the racer to get the proper dimensions
    var carImage = game.cache.getImage("racer");

    //Create the car as a sprite with the loaded content
    car1 = game.add.sprite(410 + Math.random() * 790, 75 + Math.random() * 780, "racer");
    car1.scale.set(0.2, 0.2);

    //Create the car as a sprite with the loaded content
    car2 = game.add.sprite(410 + Math.random() * 790, 75 + Math.random() * 780, "racer");
    car2.scale.set(0.2, 0.2);

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

    game.physics.arcade.collide(guys, walls);
    game.physics.arcade.collide(car1, walls);
    game.physics.arcade.collide(car2, walls);
    game.physics.arcade.collide(guys, graves);


    if (state < 2) {
        //Set cart velocity to zero so we can directly manipulate each frame
        car1.body.velocity.x = 0;
        car1.body.velocity.y = 0;
        car1.body.angularVelocity = 0;
    }

    car2.body.velocity.x = 0;
    car2.body.velocity.y = 0;
    car2.body.angularVelocity = 0;



    switch (state) {
        case 0:
            //Process collisions with car to guys
            game.physics.arcade.collide(car1, guys, vehicularManslaughter, null);

            //Process collisions with car to guys
            game.physics.arcade.collide(car1, graves);

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
        case 1:
            //Process collisions with car to guys
            game.physics.arcade.collide(car2, graves, graveRobber, null);
            game.physics.arcade.collide(car2, guys);

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
        default:
            break;
    }
}

function render() {
    switch (state) {
        case 0:
        case 1:
            scoreText.text = score;
            timeText.text = time;
            waveText.text = round;
            break;
        default:
            var loseText = game.add.text(200, 256, "YOU LOSE");
            loseText.fill = "red";
            break;
    }

    


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
    guy.kill();
    grave.anchor.set(0.5);
    grave.scale.set(0.1);
    grave.body.immovable = true;
    spawnGuys();
    s1.play();
}

function graveRobber(car, grave) {
    grave.kill();
    crunch.play();
}

function spawnGuys() {
    var s = guys.create(410 + Math.random() * 790, 75 + Math.random() * 780, 'guy', 5);
    s.name = 'guy' + s;
    s.body.collideWorldBounds = true;
    s.body.bounce.setTo(0.8, 0.8);
    var neggy = 1;
    var negge = 1;
    if (Math.random() < .5)
        neggy = -1;
    if (Math.random() < .5)
        negge = -1;
    s.body.velocity.setTo(neggy * Math.random() * 40, negge * Math.random() * 40);
    s.anchor.set(0.5);
    var anim = s.animations.add("guy");
    anim.play(10, true);
}

function updateCounter() {
    switch (state) {
        case 0:
            //Decrement timer
            if (time > 0)
                time--;

            //Time's up
            if (time == 0) {
                state = 1;
                time = 5;
                //You survived a round
                round++;
                //Didn't get any kills
                if (score == prevScore) {
                    state = 2;
                }
            }
            break;
        case 1:
            //Decrement timer
            if (time > 0)
                time--;

            //Time's up
            if (time == 0) {
                prevScore = score;
                state = 0;
                time = 10;
                lightning.visible = true;
                setTimeout(lghtng, 200);
                //Every six rounds add six guys
                if (round % 1 == 0) {
                    for (var i = 0; i < 6; i++) {
                        spawnGuys();
                    }
                }

            }
            break;
        default:
            //End game
            break;
    }
}

function lghtng() {
    lightning.visible = false;
}


