﻿module CosmicArkAdvanced {

    export class Player extends Phaser.Sprite {
        game: Phaser.Game;              // Game Context
        cursor: Phaser.CursorKeys;      // Arrow Key input

        moveDistThreshold: number;      // How far away the touch must be before moving towards it

        moveSpeed: number;              // How fast the ship moves across the screen


        constructor(_game: Phaser.Game, _x: number, _y: number) {
            this.game = _game; // get game context

            this.moveSpeed = 15; // Set current walking speed

            this.moveDistThreshold = 5; // Set threshold for moving the ship based on tapping the screen

            super(_game, _x, _y, "ship"); // Create the sprite at the x,y coordinate in game
            this.anchor.set(0.0, 1.0); // Move anchor point to the bottom-left
            this.scale.set(2.0, 2.0);

            this.cursor = this.game.input.keyboard.createCursorKeys(); // Register the "Arrow Keys"
        }
        
        create() {
            
        }

        update() {
            this.arrowKeyMovement();

            this.touchMovement();
        }

        touchMovement() {
            let pos = this.game.input.position;
            let ang = Phaser.Math.angleBetweenPoints(this.position, pos);
            let moveAmtX = this.realSpeed() * Math.cos(ang);
            let moveAmtY = this.realSpeed() * Math.sin(ang);

            if (this.game.input.pointer1.isDown || this.game.input.mousePointer.isDown) {   // If touching the screen
                if (Phaser.Point.distance(this.position, pos) > this.moveDistThreshold){    // And the touch if far enough away
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
        }



        arrowKeyMovement() {
            // TODO: Make it so that if the ship is moving diagonally, both speeds are multiplied by 0.707, aka sin(45)

            // Horizontal movement
            if (this.cursor.right.isDown == true) {
                this.x += this.realSpeed(); // this.walkingSpeed / player.maxSpeed = a percentage
            }
            else if (this.cursor.left.isDown == true) {
                this.x -= this.realSpeed(); // this.walkingSpeed / player.maxSpeed = a percentage
            }

            //Vertical movement
            if (this.cursor.up.isDown == true) {
                this.y -= this.realSpeed() // this.walkingSpeed / player.maxSpeed = a percentage
            }
            else if (this.cursor.down.isDown == true) {
                this.y += this.realSpeed(); // this.walkingSpeed / player.maxSpeed = a percentage
            }
        }

        getDeltaTime() {
            return (this.game.time.elapsedMS / 60);
        }

        realSpeed() {
            return (this.moveSpeed * this.getDeltaTime());
        }
    }
}