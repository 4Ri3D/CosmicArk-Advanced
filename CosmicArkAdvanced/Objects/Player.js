var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(_game, _x, _y, _name) {
            this.game = _game; // get game context
            this.name = _name; // Set the objects unique name
            this.moveSpeed = 15; // Set current walking speed
            this.moveDistThreshold = 5; // Set threshold for moving the ship based on tapping the screen
            this.tag = CosmicArkAdvanced.PhysicsTag.PLAYER; // Physics tag to determine how other sections of code should interact with it.
            this.isAbudcting = false;
            _super.call(this, _game, _x, _y, "ship"); // Create the sprite at the x,y coordinate in game
            this.anchor.set(0.5, 1.0); // Move anchor point to the bottom-left
            this.scale.set(2.0, 2.0);
            this.cursor = this.game.input.keyboard.createCursorKeys(); // Register the "Arrow Keys"
        }
        Player.prototype.create = function () {
        };
        // preUpdate() {
        //     this.isAbudcting = false;   // Set isAbucting to false each frame
        // }
        Player.prototype.update = function () {
            if (!this.game.paused) {
                this.arrowKeyMovement();
                this.touchMovement();
            }
        };
        Player.prototype.touchMovement = function () {
            var pos = new Phaser.Point(this.game.input.worldX, this.game.input.worldY);
            var ang = Phaser.Math.angleBetweenPoints(this.position, pos);
            var moveAmtX = this.realSpeed() * Math.cos(ang);
            var moveAmtY = this.realSpeed() * Math.sin(ang);
            if (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown) {
                if (Phaser.Point.distance(this.position, pos) > this.moveDistThreshold) {
                    // Move along the X-axis
                    if (Phaser.Math.difference(this.position.x, pos.x) > this.moveDistThreshold) {
                        this.x += moveAmtX;
                    }
                    // Move along the Y-Axis
                    if (Phaser.Math.difference(this.position.y, pos.y) > this.moveDistThreshold) {
                        this.y += moveAmtY;
                    }
                }
            }
        };
        Player.prototype.arrowKeyMovement = function () {
            // Make it so that if the ship is moving diagonally, both speeds are multiplied by 0.707, aka sin(45)
            // This keeps the ship from moving too fast when diagonal. For more, look up "vector addition".
            var isDiagonal = ((this.cursor.right.isDown || this.cursor.left.isDown) && (this.cursor.up.isDown || this.cursor.down.isDown));
            // Horizontal movement
            if (this.cursor.right.isDown == true) {
                this.x += isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
            }
            else if (this.cursor.left.isDown == true) {
                this.x -= isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
            }
            //Vertical movement
            if (this.cursor.up.isDown == true) {
                this.y -= isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
            }
            else if (this.cursor.down.isDown == true) {
                this.y += isDiagonal ? (this.realSpeed() * 0.707) : this.realSpeed();
            }
        };
        Player.prototype.getDeltaTime = function () {
            return (this.game.time.elapsedMS / 60);
        };
        Player.prototype.realSpeed = function () {
            return (this.moveSpeed * this.getDeltaTime());
        };
        Player.prototype.OnCollisionEnter = function (other) {
            console.log("Player Enter");
        };
        Player.prototype.OnCollisionProposal = function (other) {
            return true; // We want to accept the collision by default
        };
        Player.prototype.OnCollision = function (other) {
            if (other.tag == CosmicArkAdvanced.PhysicsTag.ALIEN) {
                this.isAbudcting = true;
            }
        };
        Player.prototype.OnCollisionExit = function (other) {
            console.log("Player Exit");
        };
        return Player;
    })(Phaser.Sprite);
    CosmicArkAdvanced.Player = Player;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=Player.js.map