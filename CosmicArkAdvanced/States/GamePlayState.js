var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CosmicArkAdvanced;
(function (CosmicArkAdvanced) {
    var GamePlayState = (function (_super) {
        __extends(GamePlayState, _super);
        function GamePlayState() {
            _super.call(this);
            this.aliens = [];
            this.dict = [];
        }
        GamePlayState.prototype.create = function () {
            // Set Level size
            this.game.world.setBounds(0, 0, 1600, 550);
            // Be careful, the order the objects are added into the state, is the order they will be rendered onto the screen
            // Make the objects
            this.backdrop1 = new Phaser.Image(this.game, 0, 0, "nightSky");
            this.backdrop2 = new Phaser.Image(this.game, 0, this.game.world.height, "city");
            this.backdrop2_2 = new Phaser.Image(this.game, this.game.width, this.game.world.height, "city");
            this.player = new CosmicArkAdvanced.Player(this.game, 50, 50, "player");
            this.man1 = new CosmicArkAdvanced.Man(this.game, 50, this.game.world.height - 50, "man1"); // eventually, this creation should be in a loop. Don't forget to make the name unique!
            // Make adjustments to objects
            this.backdrop1.scale.setTo(this.game.world.width / this.backdrop1.width, this.game.world.height / this.backdrop1.height); // Scale it to fit the size of the screen
            this.backdrop2.anchor.setTo(0, 1);
            this.backdrop2_2.anchor.setTo(0, 1);
            this.backdrop2.scale.setTo(this.game.width / this.backdrop2.width, this.game.height / this.backdrop2.height); // Scale it to fit the size of the screen
            this.backdrop2_2.scale.setTo(this.game.width / this.backdrop2_2.width, this.game.height / this.backdrop2_2.height); // Scale it to fit the size of the screen
            // Add them into the state
            this.game.add.existing(this.backdrop1);
            this.game.add.existing(this.backdrop2);
            this.game.add.existing(this.backdrop2_2);
            this.game.add.existing(this.player);
            this.game.add.existing(this.man1);
            // Set Camera settings
            this.game.camera.follow(this.player);
            // Set Physics settings
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            // Turn on physics for the required objects
            this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
            this.player.body.collideWorldBounds = true; // Automatically lock the players sprite into the world so they cannot move off screen.
            this.game.physics.enable(this.man1, Phaser.Physics.ARCADE);
            this.aliens.push(this.man1); // Man one is a test case, in reality, these would be made inside of a for loop.
            var offset = 75;
            this.man1.body.setSize(this.man1.width, this.man1.height + offset, 0, -offset);
        };
        // TODO: Move the collision stuff from the update function into it's own method, maybe two, idk at the moment. 
        GamePlayState.prototype.update = function () {
            for (var i = 0; i < this.aliens.length; i++) {
                var alien = this.aliens[i];
                if (this.game.physics.arcade.collide(this.player, alien, this.OnCollisionCaller, this.OnCollisionProposalCaller)) {
                    // if there is a collision
                    try {
                        if (this.dict[this.player.name, alien.name] == false) {
                            this.OnCollisionEnterCaller(this.player, alien); // then tell the objects a collision has started
                        }
                        this.dict[this.player.name, alien.name] = true; // and mark this collision as new
                    }
                    catch (err) {
                        console.log('#');
                        this.dict[this.player.name, alien.name] = false; // If there was an exception, 
                    }
                }
                else {
                    try {
                        if (this.dict[this.player.name, alien.name] == true) {
                            this.OnCollisionExitCaller(this.player, alien); // then tell the objects the collision is over
                        }
                        this.dict[this.player.name, alien.name] = false; // and mark this collision as old
                    }
                    catch (err) {
                        console.log('#');
                        this.dict[this.player.name, alien.name] = false; // If there was an exception, 
                    }
                }
            }
        };
        GamePlayState.prototype.OnCollisionProposalCaller = function (obj1, obj2) {
            return (obj1.OnCollisionProposal(obj2) && obj2.OnCollisionProposal(obj1));
        };
        GamePlayState.prototype.OnCollisionEnterCaller = function (obj1, obj2) {
            obj1.OnCollisionEnter(obj2);
            obj2.OnCollisionEnter(obj1);
        };
        GamePlayState.prototype.OnCollisionCaller = function (obj1, obj2) {
            obj1.OnCollision(obj2);
            obj2.OnCollision(obj1);
        };
        GamePlayState.prototype.OnCollisionExitCaller = function (obj1, obj2) {
            obj1.OnCollisionExit(obj2);
            obj2.OnCollisionExit(obj1);
        };
        GamePlayState.prototype.render = function () {
            // Debug feature...
            this.game.debug.body(this.player);
            this.game.debug.body(this.man1, "rgba(255,0,0,0.4");
        };
        return GamePlayState;
    })(Phaser.State);
    CosmicArkAdvanced.GamePlayState = GamePlayState;
})(CosmicArkAdvanced || (CosmicArkAdvanced = {}));
//# sourceMappingURL=GamePlayState.js.map