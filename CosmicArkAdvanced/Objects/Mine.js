var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    /**
     * @Description A floating obstacle that will explode if the player gets too close
     * @property game {Phaser.game}                 - The game context used by everything else in the game.
     * @property tag {CosmicArkAdvanced.PhysicsTag} - What type of physics object is this?
     */
    var Mine = (function (_super) {
        __extends(Mine, _super);
        function Mine(_game, _x, _y, _name) {
            _super.call(this, _game, _x, _y, "mine"); // Create the sprite at the x,y coordinate in game
            this.tag = CosmicArkAdvanced.PhysicsTag.MINE; // Label what type of object this is
            this.game.add.existing(this); //  Add this object to the gamestate
            this.anchor.set(0.5, 0.5); // Center the position over the center of the mind sprite
            this.game.physics.enable(this, Phaser.Physics.ARCADE); // Enable physics for this object so collisions are possible
            this.body.setCircle(this.width / 2, 0, 0); // Change the collider to a circle
        }
        /**
         * @Descirption Handles what should happen the imediate frame after a collision first occurs.
         * @param other The object this object collided with
         */
        Mine.prototype.OnCollisionEnter = function (other) {
        };
        /**
         * @description Handles what should happen the exact frame a collision occurs. Answers the question "Do I want procede with this collision?"
         * @param other The object this object collided with
         * @returns {boolean} Should this object accept the collision, or act like nothing happened?
         */
        Mine.prototype.OnCollisionProposal = function (other) {
            return true; // We want to accept the collision by default
        };
        /**
         * @descirption Handles what should happen for EVERY FRAME of a collision EXCEPT for the first, which is only handled by OnCollisionProposal.
         * @see {this.OnCollisionProposal}
         * @param other The object this object collided with
         */
        Mine.prototype.OnCollision = function (other) {
        };
        /**
         * @Descirption Handles what should happen the imediate frame after a collision stops occurring.
         * @param other The object this object collided with
         */
        Mine.prototype.OnCollisionExit = function (other) {
        };
        return Mine;
    })(Phaser.Sprite);
    CosmicArkAdvanced.Mine = Mine;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=Mine.js.map