﻿module CosmicArkAdvanced {

    // Yo yo yo this be ethan dawg!

    // TODO: Is supercollider still needed? Can IPhysics ready be gutted? How much of this code is dead now?

    /**
     * @Description The meat and potatoes of the game. This is where the actual "game" part lives.
     * @Property game {Phaser.Game}                         - The game context
     * @Property player {Phaser.Sprite}                     - The player object 
     * @Property man1 {CosmicArkAdvanced.Man}               - Test Alien
     * @Property aliens {CosmicArkAdvance.IPhysicsReady[]}  - List of aliens in this scene that are capable of recieving physics calls
     * @Property dict {any[]}                               - A 2-keyed dictionary which maps 2 strings to a boolean value. Maps out physics collision states.
     * @Property gun1 {CosmicArkAdvanced.Gun}               - Test Gun
     * @Property mine1 {CosmicArkAdvanced.Mine}             - Test Mine
     * @Property hook1 {CosmicArkAdvanced.Hook}             - Test Hook
     * @Property uiText {Phaser.BitmapText}                 - Temp UI element for displaying score information
     * @Property uiText_Score {Phaser.BitmapText}           - Temp UI element for displaying the literal score information <edf>
     */
    export class GamePlayState extends Phaser.State {
        game: Phaser.Game;                  // Game Refence
        player: CosmicArkAdvanced.Player;   // Player object
        aliens: CosmicArkAdvanced.IPhysicsReady[];          // List of aliens in this scene that are capable of recieving physics calls

        men: Phaser.Group;

        alienBatch: Phaser.SpriteBatch;     // Collection of aliens in the game 

        guns: CosmicArkAdvanced.Gun[];      // Collection of guns  in the game
        mines: CosmicArkAdvanced.Mine[];    // Collection of mines in the game
        hooks: CosmicArkAdvanced.Hook[];    // Collection of hooks in the game

        mothership: Phaser.Sprite;          // Mothership object

        dict: any[];                        // 2 key dictionary of IPhysicsReady object's names which define a boolean value for if the two objects were colliding as of the previous frame.

        uiText: Phaser.BitmapText;          // UI Text for updating score information
        uiText_Score: Phaser.BitmapText;    // UI Text for updating the literal score information <edf>
        uiBtn_Pause: Phaser.Button;
        uiText_Pause: Phaser.BitmapText;

        tweenSize: Phaser.Tween;
        tweenColor: Phaser.Tween;
        

        difficulty: number;                 // Value 1-3 which assists in level generation
        numberToCapture: number;            // Number of aliens needed 
        alienTotal: number;                 // Total number of aliens walking along the ground

        timeToCapture: number;              // Number of seconds the player has to finish the level
        levelTimer: Phaser.Timer;           // Timer object that counts down the number of seconds the player has left to complete the level

        score: number;                 // Holds the current score to carry it over to the LevelFinishState

        /**
         * @Description Mostly empty. Does initialize the aliens list and the dictionary.
         * @Constructor
         */
        constructor() {
            super();
        }

        // Todo: document this
        init(difficulty: number, timeToCapture: number, numberToCapture: number, score: number) {
            // Assign aurguments to class level properties
            this.difficulty = difficulty;
            this.numberToCapture = numberToCapture;
            this.timeToCapture = timeToCapture;
            this.score = score;

            // Make the level timer
            this.levelTimer = this.game.time.create(false);
            this.levelTimer.loop(timeToCapture * 1000, this.OutOfTime, this);

            // Initialize arrays
            this.aliens = [];
            this.guns = [];
            this.mines = [];
            this.hooks = [];
            this.dict = [];
        }

        // Todo: Document this
        addMine(x?: number, y?: number) {
            if (x == null || x == undefined) {
                x = this.game.world.width * Math.random();
            }
            if (y == null || y == undefined) {
                y = Math.floor(this.game.world.height - ((Math.random() * 150) + 125)); // 125 - 274
            }
            let m = new Mine(this.game, x, y, "mine1");
            this.mines.push(m);
        }

        // Todo: document this
        addGun();
        addGun(spd?: number);
        addGun(spd?: number, x?: number, y: number = (this.game.world.height - 50)) {
            if (x == null) {  
                x = -1;       
                let minDist = 327 * (Math.E ^ (-0.592 * this.difficulty)); // Roughly equal to halfing the orginal 200, but weighting it to be a more giving in the higher levels

                while (x == -1) {
                    x = (Math.random() * 1472) + 64; // Creates a Range between 64 and (1600-64)
                    for (let g of this.guns) {
                        if (Phaser.Math.difference(x, g.x) < minDist) {
                            x = -1;
                            break;
                        }
                    }

                    minDist -= 0.05; // Lower the bounds in case more guns get added than the level can support
                }
            }
            if (spd == null) {

                spd = 20 * this.difficulty + 60;
            }

            let gun = new Gun(this.game, x, y, "gunTop", spd, this.player);

            //gun.bullets.fireRate = 6290 * (Math.E ^ (-0.233 * this.difficulty));

            gun.bullets.fireRate = (58 * this.difficulty * this.difficulty) - (1093 * this.difficulty) + 5946;
            gun.bullets.fireRateVariance = (Math.random() * 25 + 25) * ((this.difficulty % 3)+1);
                
            this.guns.push(gun);
        }

        // Todo: document this
        addHook();
        addHook(spd?: number);
        addHook(spd?: number, x?: number, y: number = (this.game.world.height - 50)) {
            if (x == null || x == undefined) {
                x = -1;
                let minDist = 327 * (Math.E ^ (-0.592 * this.difficulty));

                while (x == -1) {
                    x = (Math.random() * 1472) + 64; // Creates a Range between 64 and (1600-64)
                    for (let h of this.hooks) {
                        if (Phaser.Math.difference(x, h.x) < minDist) {
                            x = -1;
                            break;
                        }
                    }
                }
            }
            if (spd == null || spd == undefined) {
                spd = 20 * this.difficulty + 60;
            }
            
            let hook = new Hook(this.game, x, y, "gun", "hook1", this.player);
            // 2000ms was the original testing speed
            //hook.wep.fireRate = 6290 * (Math.E ^ (-0.233 * this.difficulty));
            hook.wep.fireRate = (58 * this.difficulty * this.difficulty) - (1093 * this.difficulty) + 5946;
            hook.wep.fireRateVariance = (Math.random() * 30 + 35) * ((this.difficulty % 3) + 1);

            this.hooks.push(hook);
        }

        /**
         * @Description Creates a AI man
         * @param x Start X position, default is random (keyed as -1, if you want -1, use something like -1.000000001)
         * @param y Start Y position, default is 70px from the bottom of the world
         */
        addMan(isRespawn: boolean = false, x: number = (-1), y: number = (this.game.world.height - 70)) {

            if (!isRespawn) {
                this.alienTotal++;
            }

            // Establish a random position
            if (x == -1) {
                x = (Math.random() * 1472) + 64;            // Creates a Range between 64 and (1600-64)
                while (Phaser.Math.difference(x, this.player.x) < 150) {
                    x = (Math.random() * 1472) + 64;
                }
            }
            // Create the alien
            let m = this.alienBatch.create(x, y, "man") as Phaser.Sprite;
            m.data = new CosmicArkAdvanced.AlienProperties();               // Holds additional info about the alien
            m.anchor.setTo(0.5, 1.0);
            (m.data as AlienProperties).initialY = y;                       // Save a copy of the initial y position in case it needs to be respawned
            
            // Calculate the speed and direction this alien will start with
            let spd = Math.floor(Math.random() * 35) + 40; // Creates a random integer between 40 and 80
            m.data.speed = spd;

            m.animations.add("walk", null, 12 * (spd/60), true);
            m.animations.play("walk");
            
            spd = (Math.random() - 0.5 >= 0) ? -spd : spd;  // Assign it to a random direction
            if (spd < 0) { m.scale.setTo(-1, 1) };          // If the speed if now negative, flip the sprite visuals to match

            // Enable Physics and set physics attributes
            this.game.physics.enable(m, Phaser.Physics.ARCADE);         // Activate physics
            m.body.setSize(Math.abs(m.width), m.height * 2, 0, m.height * -1); // Extend the collision box upwards so it can hit the ship
            // (m.body as Phaser.Physics.Arcade.Body).setSize(w, h, x, y);
            m.body.velocity.set(spd, 0);                                  // Set the initial velocity to be it's speed with the random direction
        }

        // TODO: Document this
        OutOfTime() {
            let capt = this.player.aliensCaptured;
            this.game.state.start("levelFinishState", true, false, this.difficulty, this.score, this.GetTimeRemaining(), this.numberToCapture, capt); // Jump to the Level Finish State
        }

        /**
         * @Description Creates the game world by both creating and initializing all the objects in the game state.
         */
        create() {

            console.log("GamePlayState has started");
            console.log("Level Difficulty is: " + this.difficulty);

            // Use this for debugging to measure FPS
            this.game.time.advancedTiming = true;
            // Set Level size
            this.game.world.setBounds(0, 0, 1600, 550);
            // Set Physics settings
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // Start the level timer
            this.levelTimer.start();

            // Make the objects
            this.makeBackgrounds();
            this.makeMotherShip();
            let pStartX = this.mothership.position.x + this.mothership.width / 2;
            this.player = new Player(this.game, pStartX , 144, "player");

            // Always start with at least ( 3 + Difficulty ) guns
            this.addGun();
            this.addGun();
            this.addGun();
            for (let i = Math.ceil(this.difficulty); i > 0; i--) {
                this.addGun();
                for (let n = Math.floor(this.difficulty); n > 0; n--) {
                    if (Math.random() <= 0.5) {
                        this.addGun();
                    }
                }
            }

            // Always start with at least 2+difficulty mines
            this.addMine();
            this.addMine();
            for (let i = Math.floor(this.difficulty); i > 0; i--) {
                this.addMine();
                // 60% chance of 1 additional mine
                // 30% chance of 2 additional mines
                // 10% chance of 3 additional mines
                let r = Math.random();
                if (r < 0.60) {
                    this.addMine();
                }
                else if (r < 0.90) {
                    this.addMine();
                    this.addMine();
                }
                else {
                    this.addMine();
                    this.addMine();
                    this.addMine();
                }
            }

            // Must at least be up to a normal difficulty curve to start seeing Hooks
            if (this.difficulty > 2.0) {
                // Add at least 1 hook for every difficulty level
                // 40% chance of an additional hook every time a single hook is added
                for (let i = Math.floor(this.difficulty); i > 0; i--) {
                    this.addHook();
                    if (Math.random() < 0.40) {
                        this.addHook();
                    }
                }
            }
            

            // Aliens should always be created after the player so that they don't accidently render behind the tractor beam
            this.alienBatch = this.game.add.spriteBatch(this.game.world); // Create the man sprite batch so they will all be rendered at once

            for (let i = this.numberToCapture; i > 0; i--) {
                this.addMan();
                if (Math.random() < (0.6 - ((this.difficulty - 1) * 0.1))) {
                    this.addMan();
                }
            }

            // Set Camera settings
            this.game.camera.follow(this.player);

            // UI
            this.uiText = this.game.add.bitmapText(8, 0, "EdoSZ",
                "IN TRANSIT: " + this.player.aliensOnBoard.toString() +
                "\nCAPTURED: " + this.player.aliensCaptured.toString());
            this.uiText.fixedToCamera = true;

            this.uiText_Score = this.game.add.bitmapText(650, 0, "EdoSZ", "Score: ");
            this.uiText_Score.fixedToCamera = true;

            this.uiBtn_Pause = this.game.add.button(this.game.width - 32, 0, "pause", this.pauseGame, this);
            
            this.uiBtn_Pause.fixedToCamera = true;

            // Add tweens to UI for when hit
            this.tweenSize = this.game.add.tween(this.uiText_Score.scale).to({ x: [1.75, 1], y: [1.75, 1] }, 500, Phaser.Easing.Linear.None, false, 0);
            this.tweenColor = this.game.add.tween(this.uiText_Score).to({ tint: [0xFF1122, 0xFF1122, 0xFF1122, 0xFFFFFF] }, 500, Phaser.Easing.Linear.None, false, 0);

            
            // this.game.add.text(8, 18, "Captured: " + this.aliensCaptured.toString(), { font: '16pt Arial', fill: 'red' });
        }

        pauseGame() {
            this.game.paused = true;
            this.game.input.onDown.add(this.unpauseGame, this, 0, this.input.position);

            this.uiText_Pause = this.game.add.bitmapText(0, 0, "EdoSZ", "PAUSE", 48);
            this.uiText_Pause.position.x = (this.game.width / 2) + this.camera.position.x - this.uiText_Pause.textWidth/2;
            this.uiText_Pause.position.y = (this.game.height / 2) + this.camera.position.y - this.uiText_Pause.textHeight / 2;

        }

        unpauseGame(pos : Phaser.Point) {
            if (this.uiBtn_Pause.getBounds().contains(pos.x, pos.y)) {
                this.game.paused = false;
                this.uiText_Pause.destroy();
            }
        }

        /**
         * @Descirption Creates the mothership sprite and adjust it's properties accordingly.
         */
        makeMotherShip() {
            this.mothership = this.game.add.sprite(0, 0, "mothership");
            this.mothership.scale.set(1, 1);
            // These numbers are largely abitrary. I did some trial and error and came up with these. -- Jake Gillenwater
            this.mothership.position.set(this.game.world.width / 2 - this.mothership.width / 2, (-this.mothership.height / 2) + 32);
            this.game.physics.enable(this.mothership, Phaser.Physics.ARCADE);
            this.mothership.body.setCircle(this.mothership.width * 0.75, this.mothership.width * -0.25, this.mothership.width * -1.18);
        }

        /**
         * @Description Adds the background images to the gamestate and scales them appropriately
         */
        makeBackgrounds() {
            // let bd = new Phaser.Image(this.game, 0, this.game.world.height, "city1");
            this.game.add.image(0, 0, "city1");
        }

        /**
         * @Description Check for collisions between objects, update the UI and coordinate AI movements
         */
        update() {
            this.collideObjects();      // Check for collisions
            this.moveMen();             // Move the men along the bottom of the screen
            
            for (let n = 0; n < this.alienBatch.hash.length; n++) {
                (this.alienBatch.hash[n] as CosmicArkAdvanced.Man).update();
            }

            this.uiText.text = "In Transit: " + this.player.aliensOnBoard.toString() +
                "\nCaptured: " + this.player.aliensCaptured.toString() + " / " + this.numberToCapture.toString();

            this.uiText_Score.text = this.GetTimeRemaining().toFixed(2);

            if (this.player.aliensCaptured >= this.numberToCapture) {
                let capt = this.player.aliensCaptured;
                console.log("Time Remaining: " + this.GetTimeRemaining());
                this.game.state.start("levelFinishState", true, false, this.difficulty, this.score, this.GetTimeRemaining(), this.numberToCapture, capt); // Jump to the Level Finished State
            }
            
        }

        //TODO: Document this
        GetTimeRemaining() {
            return (this.levelTimer.duration / 1000);
        }

        /**
         * Adds more time "levelTimer" object. Can be given a negative number to subtract time.
         * @param n The number of MILLISECONDS to change the timer by
         */
        addTime(n: number) {
            let d = this.levelTimer.duration + n
            this.levelTimer.stop(true);
            this.levelTimer.loop(d, this.OutOfTime, this);
            this.levelTimer.start();
        }

        /**
         * @Description Called ever frame through the update method. Place collision checks here.
         */
        collideObjects() {
            // Collide the player's ship with the gun's bullets
            for (let n = 0; n < this.guns.length; n++) {
                for (let i = 0; i < this.guns[n].bullets.bullets.length; i++) {
                    if (this.game.physics.arcade.overlap(this.player, this.guns[n].bullets.bullets.getAt(i))) {

                        // Destroy all bullets within the kill radius (Ess. provide a localized i-frame to the player for fairness)
                        let kill_radius = 150;
                        this.guns.forEach(function (g, gi, ga) {
                            for (let bi = 0; bi < g.bullets.bullets.length; bi++){
                                let bull = (g.bullets.bullets.getAt(bi) as Phaser.Bullet)
                                if (bull.alive) {
                                    if (Phaser.Math.distance(bull.x, bull.y, this.player.x, this.player.y) < kill_radius) {
                                        bull.kill();
                                    }
                                }
                            }
                        }, this);

                        // Play SFX
                        this.game.sound.play("explosion", this.game.music.volume * 0.50);

                        // Reduce Time
                        this.addTime(-5000);

                        // Reduce Transit Count
                        if (this.player.aliensOnBoard > 0) {
                            this.player.aliensOnBoard--;
                            // Replace that person
                            this.addMan(true);
                        }

                        // Change UI
                        this.tweenSize.start();
                        this.tweenColor.start();
                    }
                }
            }
            
            
            // Collide the player's ship with the hooks
            for (let n = 0; n < this.hooks.length; n++) {
                for (let i = 0; i <= this.hooks[n].wep.bullets.length; i++) {
                    if (this.game.physics.arcade.overlap(this.player, this.hooks[n].wep.bullets.getAt(i))) {
                        let b = this.hooks[n].wep.bullets.getAt(i) as Phaser.Bullet;
                        this.hooks[n].targetHooked();
                    }
                }
            }


            // Collide the player's ship with the aliens
            let atLeastOne = false;                     // Flag meaning "At least one alien is availble to be abducted"
            this.alienBatch.forEachAlive(function (alien: Phaser.Sprite) {
                if (this.game.physics.arcade.overlap(this.player, alien)) {
                    atLeastOne = true;
                    this.player.Abduct(alien);
                }
            }, this);
            if (!atLeastOne) {
                this.player.animations.frame = 0;       // TODO: Fix this so it doesn't laugh in the face of every OOP practice I've learned over the years
            }

            // Collide the player's ship with the mines
            for (let n = 0; n < this.mines.length; n++) {
                if (this.game.physics.arcade.overlap(this.player, this.mines[n])) {

                    // Make Explosion
                    let spt = this.game.add.sprite(0, 0, "bang");
                    spt.scale.set(1.35, 1.35);
                    spt.position.setTo(this.mines[n].x - spt.width / 2, this.mines[n].y - spt.height / 2);
                    spt.animations.add("bang_anim", null, 20, false);
                    spt.animations.play("bang_anim", null, false, true);

                    // Play SFX
                    this.game.sound.play("explosion", this.game.music.volume * 0.50);

                    // Reduce Time
                    this.addTime(-10000);

                    // Reduce Transit Count
                    for (var k = 0; k < 3; k++) {
                        if (this.player.aliensOnBoard > 0) {
                            this.player.aliensOnBoard--;
                            // Replace that person
                            this.addMan(true);
                        }
                    }
                    
                    

                    // Change UI
                    this.tweenSize.start();
                    this.tweenColor.start();

                    // Destroy mine
                    this.mines[n].destroy(true);
                }
            }
            

            // Collide the player's ship with the mothership
            if (this.game.physics.arcade.overlap(this.player, this.mothership)) {

                if (this.player.aliensOnBoard > 0) {
                    this.player.aliensCaptured += this.player.aliensOnBoard;

                    // Only play the SFX if this isn't the end of the level
                    if (this.player.aliensCaptured < this.numberToCapture) {
                        this.sfxRepeater("transport", this.player.aliensOnBoard, this.game.music.volume * 0.40);
                    }

                    this.player.aliensOnBoard = 0;
                }

            }
        }

        sfxRepeater(key: string, numberOfPlays: number, volume = 0.7) {

            let sfx = this.game.sound.play(key, volume, false);

            // Create Timer
            let sfxRepeatTimer = this.game.time.create(true);

            sfxRepeatTimer.repeat(sfx.durationMS, numberOfPlays-1, function () {
                sfx.play();
            }, this);

            sfxRepeatTimer.start();

        }

        /**
         * @Description Helper function which cycles through the sprite batch of men along the bottom the screen and applies logic into how they should move.
         */
        moveMen() {
            this.alienBatch.forEach(function (alien: Phaser.Sprite) {
                if (alien.x > this.game.world.width - Math.abs(alien.width)) {
                    alien.body.velocity.setTo(-alien.data.speed, 0);
                    alien.scale.set(-1, 1);
                }
                else if (alien.x < Math.abs(alien.width)) {
                    alien.body.velocity.setTo(alien.data.speed, 0);
                    alien.scale.set(1, 1);
                }
            }, this);
        }

        /**
         * @Description This is the super in-depth version of collision checking I (Jake) created. Checks for collisions between two objects and triggers the appropriate events on the object.
         * @Param obj1  The first object to check collision against
         * @Param obj2  The second object to check collision against
         */
        superCollider(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            if (this.game.physics.arcade.collide(obj1, obj2, this.OnCollisionCaller, this.OnCollisionProposalCaller)) {        
                // if there is a collision
                try {
                    if (this.dict[obj1.name, obj2.name] == false) { // but there wasn't one last time we checked
                        this.OnCollisionEnterCaller(obj1, obj2);    // then tell the objects a collision has started
                    }
                    this.dict[obj1.name, obj2.name] = true;         // and mark this collision as new
                }
                catch (err) {
                    this.dict[obj1.name, obj2.name] = false;        // If there was an exception, 
                    // it is because that dictionary entry doesn't exist yet. 
                    // So add it here.
                }
            }
            else {                                              // If there WASN'T a collision
                try {
                    if (this.dict[obj1.name, obj2.name] == true) {  // but there was last time we checked
                        this.OnCollisionExitCaller(obj1, obj2);     // then tell the objects the collision is over
                    }
                    this.dict[obj1.name, obj2.name] = false;        // and mark this collision as old
                }
                catch (err) {
                    this.dict[obj1.name, obj2.name] = false;        // If there was an exception, 
                    // it is because that dictionary entry doesn't exist yet. 
                    // So add it here.
                }
            }
        }

        /**
         * @Descirption Calls the OnCollisionProposal events on both objects, and return their answer. Both objects must accept the proposal before continueing.
         * @Param obj1
         * @Param obj2
         */
        OnCollisionProposalCaller(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            return (obj1.OnCollisionProposal(obj2) && obj2.OnCollisionProposal(obj1));
        }

        /**
         * @Descirption Calls the OnCollisionEnter events on both objects
         * @Param obj1
         * @Param obj2
         */
        OnCollisionEnterCaller(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            obj1.OnCollisionEnter(obj2);
            obj2.OnCollisionEnter(obj1);
        }

        /**
         * @Description Calls the OnCollision events on both objects
         * @Param obj1
         * @Param obj2
         */
        OnCollisionCaller(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            obj1.OnCollision(obj2);
            obj2.OnCollision(obj1);
        }

        /**
         * @Description Calls the OnCollisionExit events on both objects
         * @Param obj1
         * @Param obj2
         */
        OnCollisionExitCaller(obj1: IPhysicsReady, obj2: IPhysicsReady) {
            obj1.OnCollisionExit(obj2);
            obj2.OnCollisionExit(obj1);
        }

        /**
         * @Description Post rendering effects.
         */
        render() {
            // Debug features...
            //this.game.debug.body(this.player);
            // this.game.debug.body(this.man1, "rgba(255,0,0,0.4");
            // this.gun1.bullets.debug();
            // this.game.debug.body(this.mine1);
            // this.game.debug.ropeSegments(this.hook1.rope);
            // this.game.debug.body(this.mothership);
            this.game.debug.text(this.game.time.fps.toString(), 8, 80);
            //this.game.debug.body(this.myBatch.getFirstExists(true));
        }

        shutdown() {
            this.player.destroy(true);
            this.aliens = null;
            this.alienBatch.destroy(true);
            this.guns = null;
            this.mines = null;
            this.hooks = null;
            this.mothership.destroy();
            this.uiText.destroy();
            this.uiText_Score.destroy();
            this.levelTimer.destroy();
            this.game.sound.stopAll();
        }
    }
}
