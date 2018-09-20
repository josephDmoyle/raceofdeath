/// <reference path="phaser.d.ts"/>
var game = new Phaser.Game(1600, 900, Phaser.CANVAS, 'content', {
    create: create, preload: preload,
    update: update, render: render
});
//Car sprite
var reaper;
//Secret Second Player
var cultist;
var robGrave;
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
var whip;
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
//Text object for displaying the time
var remainingText;
var rem;
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
    game.load.spritesheet("cultist", "cultist.png", 256, 256, 3);
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
    game.load.audio("whip", "lightning.mp3");
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
    scoreText = game.add.text(1360, 394, "0");
    scoreText.fill = '#660f0f';
    score = 0;
    prevScore = score;
    round = 0;
    state = 0;
    timeText = game.add.text(1360, 330, "0");
    timeText.fill = '#660f0f';
    waveText = game.add.text(1360, 460, "0");
    waveText.fill = '#660f0f';
    remainingText = game.add.text(1330, 600, "0");
    remainingText.fill = '#660f0f';
    remainingText.fontSize = 60;
    rem = 3;
    round = 1;
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
    whip = game.add.audio("whip");
    whip.allowMultiple = true;
    metal = game.add.audio("metal");
    metal.allowMultiple = false;
    metal.play();
    for (var i = 0; i < 6; i++) {
        spawnGuys();
    }
    //Load in the image of the racer to get the proper dimensions
    var carImage = game.cache.getImage("racer");
    //Create the car as a sprite with the loaded content
    reaper = game.add.sprite(game.width / 2, game.height / 2, "racer");
    reaper.scale.set(0.2, 0.2);
    //Create the car as a sprite with the loaded content
    cultist = game.add.sprite(game.width / 2, 80, "cultist");
    cultist.scale.set(0.3, 0.3);
    robGrave = cultist.animations.add("cultist");
    //Set the pivot point to the center of the car
    reaper.anchor.set(0.5);
    //Set the pivot point to the center of the car
    cultist.anchor.set(0.5);
    //Enable the arcade physics interactions
    game.physics.arcade.enable(reaper);
    //Enable the arcade physics interactions
    game.physics.arcade.enable(cultist);
    //Set car to stay on screen
    reaper.body.collideWorldBounds = true;
    //Set the bounciness of the car
    reaper.body.bounce.set(0.8);
    //Allow the car body to be rotated by us
    reaper.body.allowRotation = true;
    //Set car to stay on screen
    cultist.body.collideWorldBounds = true;
    //Set the bounciness of the car
    cultist.body.bounce.set(0.8);
    //Allow the car body to be rotated by us
    cultist.body.allowRotation = true;
    cultist.visible = false;
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
    game.physics.arcade.collide(reaper, walls);
    game.physics.arcade.collide(cultist, walls);
    game.physics.arcade.collide(guys, graves);
    if (state < 2) {
        //Set cart velocity to zero so we can directly manipulate each frame
        reaper.body.velocity.x = 0;
        reaper.body.velocity.y = 0;
        reaper.body.angularVelocity = 0;
    }
    cultist.body.velocity.x = 0;
    cultist.body.velocity.y = 0;
    cultist.body.angularVelocity = 0;
    switch (state) {
        case 0:
            //Process collisions with car to guys
            game.physics.arcade.collide(reaper, guys, vehicularManslaughter, null);
            //Process collisions with car to guys
            game.physics.arcade.collide(reaper, graves);
            //Angular rotations given by A/l and D/r
            if (A.isDown)
                reaper.body.angularVelocity = -200;
            else if (D.isDown)
                reaper.body.angularVelocity = 200;
            //Driving pedals given by W/u and S/d
            if (W.isDown)
                reaper.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(reaper.angle, 300));
            else if (S.isDown)
                reaper.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(reaper.angle, -100));
            break;
        case 1:
            //Process collisions with car to guys
            game.physics.arcade.collide(cultist, graves, graveRobber, null);
            game.physics.arcade.collide(cultist, guys);
            //Angular rotations given by A/l and D/r
            if (A.isDown)
                cultist.body.angularVelocity = -200;
            else if (D.isDown)
                cultist.body.angularVelocity = 200;
            //Driving pedals given by W/u and S/d
            if (W.isDown)
                cultist.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(cultist.angle, 300));
            else if (S.isDown)
                cultist.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(cultist.angle, -100));
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
            remainingText.text = rem;
            break;
        default:
            var loseText = game.add.text(game.width / 2 - 200, game.height / 2, "YOU LOSE");
            loseText.fontSize = 100;
            loseText.fill = '#660f0f';
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
    if (rem > 0)
        rem--;
    var grave = graves.create(guy.x, guy.y, 'dead', 5);
    guy.kill();
    grave.anchor.set(0.5);
    grave.scale.set(0.1);
    grave.body.immovable = true;
    spawnGuys();
    s1.play();
}
function graveRobber(car, grave) {
    robGrave.play(12, false);
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
                whip.play();
                cultist.visible = true;
                cultist.position.x = game.width / 2;
                cultist.position.y = 80;
                lightning.visible = true;
                setTimeout(lghtng, 100);
                //You survived a round
                round++;
                //Didn't get any kills
                if (rem > 0) {
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
                whip.play();
                state = 0;
                time = 10;
                cultist.visible = false;
                lightning.visible = true;
                setTimeout(lghtng, 100);
                rem = round * 3;
                //Every six rounds add six guys
                for (var i = 0; i < 6; i++) {
                    spawnGuys();
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
//# sourceMappingURL=app.js.map