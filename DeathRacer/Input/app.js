/// <reference path="phaser.d.ts"/>
// Demonstrate the use of arrow keys in a Phaser app
// This application demonstrates creation of a Cursor and polling for input
var SimpleGame = /** @class */ (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(640, 480, Phaser.AUTO, 'content', {
            create: this.create, preload: this.preload,
            update: this.update
        });
    }
    SimpleGame.prototype.preload = function () {
        this.game.load.image("racer", "racer.png");
    };
    SimpleGame.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var image0 = this.game.cache.getImage("racer");
        this.car = this.game.add.sprite(this.game.width / 2 - image0.width / 2, this.game.height / 2 - image0.height / 2, "racer");
        this.car.anchor.set(0.5);
        this.game.physics.enable(this.car, Phaser.Physics.ARCADE);
        this.car.body.collideWorldBounds = true;
        this.car.body.bounce.set(0.8);
        this.car.body.allowRotation = true;
        this.car.body.immovable = true;
        // create the cursor key object
        this.cursors = this.game.input.keyboard.createCursorKeys();
        // create the WASD movements
        this.W = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.S = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.D = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    };
    SimpleGame.prototype.update = function () {
        // Update input state
        this.game.input.update();
        this.car.body.velocity.x = 0;
        this.car.body.velocity.y = 0;
        this.car.body.angularVelocity = 0;
        //Angular rotations given by A/l and D/r
        if (this.cursors.left.isDown || this.A.isDown)
            this.car.body.angularVelocity = -200;
        else if (this.cursors.right.isDown || this.D.isDown)
            this.car.body.angularVelocity = 200;
        if (this.cursors.up.isDown || this.W.isDown)
            this.car.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.car.angle, 300));
        else if (this.cursors.down.isDown || this.S.isDown)
            this.car.body.velocity.copyFrom(this.game.physics.arcade.velocityFromAngle(this.car.angle, -100));
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=app.js.map