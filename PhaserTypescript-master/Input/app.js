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
        var loader = this.game.load.image("racer", "racer_0.png");
        this.game.load.image("racer", "racer_0.png");
    };
    SimpleGame.prototype.create = function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        var image0 = this.game.cache.getImage("racer");
        this.sprite = this.game.add.sprite(this.game.width / 2 - image0.width / 2, this.game.height / 2 - image0.height / 2, "racer");
        this.sprite.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.allowRotation = false;
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
        // Check each of the arrow keys and move accordingly
        // If the Ctrl Key + Left or Right arrow are pressed, move at a greater rate
        if (this.cursors.down.isDown || this.S.isDown)
            this.sprite.position.y += 5;
        if (this.cursors.up.isDown || this.W.isDown)
            this.sprite.position.y -= 5;
        if (this.cursors.left.isDown || this.A.isDown)
            this.sprite.position.x -= 5;
        if (this.cursors.right.isDown || this.D.isDown)
            this.sprite.position.x += 5;
    };
    return SimpleGame;
}());
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=app.js.map