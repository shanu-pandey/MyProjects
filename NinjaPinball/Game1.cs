using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using System;
using System.Diagnostics;
using Microsoft.Xna.Framework.Media;
using Microsoft.Xna.Framework.Audio;

namespace NinjaPinball {
    /// <summary>
    /// This is the main type for your game.
    /// </summary>
    public class Game1 : Game {
        GraphicsDeviceManager graphics;
        SpriteBatch spriteBatch;

        const int windowWidth = 1440;
        const int windowHeight = 810;

        SpriteFont font;
        Song startScreenAudio, failScreenAudio, gameScreenAudio;

        //Texture files for sprites and menus
        Texture2D ninjaSprite, cannonball, standing, target, cannonBody, cannonStand, titlescreen, startButton, startButtonPressed, badGuy, badGuyDead, retry, retryPressedSprite, failed, winScreen;
        Texture2D[] noiseMeterSprites;
        Texture2D[][] obstacleSprites;
        Texture2D[][] brokenSprites;
        Texture2D[] background;

        //booleans for game states
        bool[][] broken;
        bool leftButtonClick = false;
        bool leftButtonrReleased = false;
        bool inside = false;
        bool moving = false;
        bool startScreen = true;
        bool killing = false;
        bool fail = false;
        bool win = false;
        bool startPressed = false;
        bool timeOver = false;

        //Vectors for positioning sprites
        Vector2 ninjaPosition = new Vector2(220, 730);
        Vector2 targeting;
        Vector2[][] obstaclePositions = new Vector2[5][]; 
        Vector2[][] brokenPositions = new Vector2[5][];
        Vector2 startingPoint = new Vector2(200, 700);

        //Timers and ninja position/angle/velocity variables
        double angle = 1.0;
        double time;
        int retryTimer = 0;
        int winTimer = 0;
        float velocityY = 0;
        float velocityX = 0;
        float power;
        float powerScalar = 4000;
        float timeRemaining = 0F;
        
        //Game state counters
        int currentScreen = 0;
        int maxScreen = 5;
        int noiseLevel;
        int maxNoiseLevel;
        int[][] noiseValues = new int[5][];

        //hitbox matrices
        Rectangle[][] horizontals;
        Rectangle[][] verticals;

        //audio 
        SoundEffect[][] collisionSounds = new SoundEffect[5][];
        SoundEffect killSound, launchSound, startSound;

        public Game1() {
            graphics = new GraphicsDeviceManager(this);
            Content.RootDirectory = "Content";

            graphics.PreferredBackBufferHeight = windowHeight;
            graphics.PreferredBackBufferWidth = windowWidth;
            IsMouseVisible = true;

        }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize() {
            targeting = startingPoint;

            noiseLevel = 0;
            maxNoiseLevel = 10;

            //5 different screens; adjust initialization to number of screens for the level
            background = new Texture2D[5];
            horizontals = new Rectangle[5][];
            verticals = new Rectangle[5][];
            obstacleSprites = new Texture2D[5][];
            brokenSprites = new Texture2D[5][];
            broken = new bool[5][];

            //horizontal hitbox initializations
            horizontals[0] = new Rectangle[] { new Rectangle(0, 810, 1445, 2) };
            horizontals[1] = new Rectangle[] { new Rectangle(0, 810, 1445, 2), new Rectangle(0, 105, 1445, 34) };
            horizontals[2] = new Rectangle[] { new Rectangle(0, 810, 1445, 2), new Rectangle(0, 105, 1445, 34) };
            horizontals[3] = new Rectangle[] { new Rectangle(0, 810, 1445, 2), new Rectangle(0, 105, 1445, 34) };
            horizontals[4] = new Rectangle[] { new Rectangle(0, 810, 1445, 2), new Rectangle(0, 105, 1445, 34) };

            //vertical hitbox initializations
            verticals[0] = new Rectangle[] { new Rectangle(1175, 387, 50, 140), new Rectangle(1170, 105, 50, 100) };
            verticals[1] = new Rectangle[] { };
            verticals[2] = new Rectangle[] { };
            verticals[3] = new Rectangle[] { };
            verticals[4] = new Rectangle[] { new Rectangle(1423, 105, 16, 705) };

            //Positioning for all obstacles 
            obstaclePositions[0] = new Vector2[] { new Vector2(1180, 530), new Vector2(1195, 175) };
            obstaclePositions[1] = new Vector2[] { new Vector2(572, 578), new Vector2(910, 138), new Vector2(890, 695), new Vector2(282, 140) };
            obstaclePositions[2] = new Vector2[] { new Vector2(883, 198), new Vector2(1315, 625), new Vector2(820, 625), new Vector2(270, 453) };
            obstaclePositions[3] = new Vector2[] { new Vector2(1017, 231), new Vector2(557, 383), new Vector2(210, 641) };
            obstaclePositions[4] = new Vector2[] { new Vector2(918, 616), new Vector2(321, 374), new Vector2(898, 140) };

            //Positioning for the broken versions of all obstacles 
            brokenPositions[0] = new Vector2[] { new Vector2(1180, 530), new Vector2(1195, 175) };
            brokenPositions[1] = new Vector2[] { new Vector2(578, 637), new Vector2(845, 138), new Vector2(904, 694), new Vector2(235, 140) };
            brokenPositions[2] = new Vector2[] { new Vector2(883, 545), new Vector2(1315, 682), new Vector2(820, 682), new Vector2(253, 633) };
            brokenPositions[3] = new Vector2[] { new Vector2(960, 231), new Vector2(557, 383), new Vector2(210, 641) };
            brokenPositions[4] = new Vector2[] { new Vector2(1181, 748), new Vector2(444, 658), new Vector2(876, 140) };

            //setting the broken tag to false for all obstacles initially
            for (int i = 0; i < 5; i++) {
                broken[i] = new bool[10];
            }

            for (int i = 0; i < 5; i++) {
                for (int j = 0; j < 10; j++) {
                    broken[i][j] = false;
                }
            }

            //noise values for each obstacles
            noiseValues[0] = new int[] { 0, 0 };
            noiseValues[1] = new int[] { 1, 1, 2, 1 };
            noiseValues[2] = new int[] { 1, 2, 2, 1 };
            noiseValues[3] = new int[] { 1, 2, 0 };
            noiseValues[4] = new int[] { 2, 4, 3 };

            base.Initialize();
        }

        /// <summary>
        /// LoadContent will be called once per game and is the place to load
        /// all of your content.
        /// </summary>
        protected override void LoadContent() {
            // Create a new SpriteBatch, which can be used to draw textures.
            spriteBatch = new SpriteBatch(GraphicsDevice);
            //sprites for menu/splash screens and buttons
            titlescreen = Content.Load<Texture2D>(@"graphics/titlescreen");
            startButton = Content.Load<Texture2D>(@"graphics/startButton");
            startButtonPressed = Content.Load<Texture2D>(@"graphics/startButtonPressed");
            retryPressedSprite = Content.Load<Texture2D>(@"graphics/retryPressed");
            winScreen = Content.Load<Texture2D>(@"graphics/WinScreen");
            retry = Content.Load<Texture2D>(@"graphics/retry");
            failed = Content.Load<Texture2D>(@"graphics/Failscreen");

            //background for each room
            background[0] = Content.Load<Texture2D>(@"graphics/main");
            background[1] = Content.Load<Texture2D>(@"graphics/kitchen");
            background[2] = Content.Load<Texture2D>(@"graphics/tvRoom");
            background[3] = Content.Load<Texture2D>(@"graphics/bathroom");
            background[4] = Content.Load<Texture2D>(@"graphics/bedroom");

            //obstacle sprites for each room
            obstacleSprites[0] = new Texture2D[] { Content.Load<Texture2D>(@"graphics/door"), Content.Load<Texture2D>(@"obstacles/window") };
            obstacleSprites[1] = new Texture2D[] { Content.Load<Texture2D>(@"obstacles/dishes"), Content.Load<Texture2D>(@"obstacles/pots"), Content.Load<Texture2D>(@"obstacles/table"), Content.Load<Texture2D>(@"obstacles/chandelier") };
            obstacleSprites[2] = new Texture2D[] { Content.Load<Texture2D>(@"obstacles/painting"), Content.Load<Texture2D>(@"obstacles/vase"), Content.Load<Texture2D>(@"obstacles/vase"), Content.Load<Texture2D>(@"obstacles/tv") };
            obstacleSprites[3] = new Texture2D[] { Content.Load<Texture2D>(@"obstacles/bottles"), Content.Load<Texture2D>(@"obstacles/mirror"), Content.Load<Texture2D>(@"obstacles/toilet") };
            obstacleSprites[4] = new Texture2D[] { Content.Load<Texture2D>(@"obstacles/lamp"), Content.Load<Texture2D>(@"obstacles/grandfatherClock"), Content.Load<Texture2D>(@"obstacles/lights") };

            //broken obstacle sprites for each room
            brokenSprites[0] = new Texture2D[] { Content.Load<Texture2D>(@"graphics/doorBroken"), Content.Load<Texture2D>(@"obstacles/windowBroken") };
            brokenSprites[1] = new Texture2D[] { Content.Load<Texture2D>(@"obstacles/dishesBroken"), Content.Load<Texture2D>(@"obstacles/potsBroken"), Content.Load<Texture2D>(@"obstacles/tableBroken"), Content.Load<Texture2D>(@"obstacles/chandelierBroken") };
            brokenSprites[2] = new Texture2D[] { Content.Load<Texture2D>(@"obstacles/paintingBroken"), Content.Load<Texture2D>(@"obstacles/vaseBroken"), Content.Load<Texture2D>(@"obstacles/vaseBroken"), Content.Load<Texture2D>(@"obstacles/tvBroken") };
            brokenSprites[3] = new Texture2D[] { Content.Load<Texture2D>(@"obstacles/bottlesBroken"), Content.Load<Texture2D>(@"obstacles/mirrorBroken"), Content.Load<Texture2D>(@"obstacles/toilet") };
            brokenSprites[4] = new Texture2D[] { Content.Load<Texture2D>(@"obstacles/lampBroken"), Content.Load<Texture2D>(@"obstacles/grandfatherClockBroken"), Content.Load<Texture2D>(@"obstacles/lightsBroken") };

            //noise meter sprites
            noiseMeterSprites = new Texture2D[] { Content.Load<Texture2D>(@"noise/meter_00"), Content.Load<Texture2D>(@"noise/meter_01"), Content.Load<Texture2D>(@"noise/meter_02"), Content.Load<Texture2D>(@"noise/meter_03"), Content.Load<Texture2D>(@"noise/meter_04"), Content.Load<Texture2D>(@"noise/meter_05"), Content.Load<Texture2D>(@"noise/meter_06"), Content.Load<Texture2D>(@"noise/meter_07"), Content.Load<Texture2D>(@"noise/meter_08"), Content.Load<Texture2D>(@"noise/meter_09"), Content.Load<Texture2D>(@"noise/meter_11"), };

            //sprites for characters and the cannon
            target = Content.Load<Texture2D>(@"graphics/aim");
            ninjaSprite = Content.Load<Texture2D>(@"graphics/flying");
            standing = Content.Load<Texture2D>(@"graphics/killerninja");
            cannonball = Content.Load<Texture2D>(@"graphics/cannonball");
            cannonBody = Content.Load<Texture2D>(@"graphics/cannonBody");
            cannonStand = Content.Load<Texture2D>(@"graphics/cannonStand");
            badGuy = Content.Load<Texture2D>(@"graphics/targetSleeping");
            badGuyDead = Content.Load<Texture2D>(@"graphics/targetDead");


            font = Content.Load<SpriteFont>("font");

            //audio initializations
            gameScreenAudio = Content.Load<Song>("background_song");

            collisionSounds[0] = new SoundEffect[] { Content.Load<SoundEffect>("DoorBreak_effect"), Content.Load<SoundEffect>("windowBreak_effect") };
            collisionSounds[1] = new SoundEffect[] { Content.Load<SoundEffect>("platerBreaking_effect"), Content.Load<SoundEffect>("breaking_effect"), Content.Load<SoundEffect>("tableBreak_effect"), Content.Load<SoundEffect>("chandalier_effect") };
            collisionSounds[2] = new SoundEffect[] { Content.Load<SoundEffect>("breaking_effect"), Content.Load<SoundEffect>("potsBreaking_effect"), Content.Load<SoundEffect>("potsBreaking_effect"), Content.Load<SoundEffect>("woodeFalling_effect") };
            collisionSounds[3] = new SoundEffect[] { Content.Load<SoundEffect>("potsBreaking_effect"), Content.Load<SoundEffect>("breaking_effect"), Content.Load<SoundEffect>("breaking_effect") };
            collisionSounds[4] = new SoundEffect[] { Content.Load<SoundEffect>("breaking_effect"), Content.Load<SoundEffect>("bigObjectFall_effect"), Content.Load<SoundEffect>("potsBreaking_effect") };
            killSound = Content.Load<SoundEffect>("killTarget_effect");
            launchSound = Content.Load<SoundEffect>("launch_effect");
            startSound = Content.Load<SoundEffect>("startClick_effect");

            failScreenAudio = Content.Load<Song>("background_song");
            startScreenAudio = Content.Load<Song>("background_song");
            MediaPlayer.Play(gameScreenAudio);
            MediaPlayer.IsRepeating = true;

        }

        /// <summary>
        /// UnloadContent will be called once per game and is the place to unload
        /// game-specific content.
        /// </summary>
        protected override void UnloadContent() {

        }

        /// <summary>
        /// Allows the game to run logic such as updating the world,
        /// checking for collisions, gathering input, and playing audio.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Update(GameTime gameTime) {
            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
                Exit();

            MouseState mouse = Mouse.GetState();

            //marker for swapping sprites after ninja has flown far enough
            if (ninjaPosition.X > 500) {
                inside = true;
            }

            if (mouse.LeftButton == ButtonState.Pressed) {
                leftButtonClick = true;
                leftButtonrReleased = false;

            }

            if (mouse.LeftButton == ButtonState.Released && leftButtonClick) {
                leftButtonrReleased = true;
                leftButtonClick = false;
                launchSound.Play();
            }

            //checking if player clicks start button
            if (startScreen && leftButtonClick) {
                if (mouse.X >= 476.5f && mouse.X <= 476.5f + startButton.Width && mouse.Y >= 333.5f && mouse.Y <= 333.5f + startButton.Height) {
                    startPressed = true;
                    startScreen = false;
                    timeRemaining = 30f;
                    timeOver = false;
                    time = 1;
                    startSound.Play();


                }
            }

            //retry button clicks
            if (fail && leftButtonClick) {
                if (mouse.X >= 476.5f && mouse.X <= 476.5f + startButton.Width && mouse.Y >= 333.5f && mouse.Y <= 333.5f + startButton.Height) {
                    retryTimer = 1;
                }
            }

            //timing the swap from start screen to first game screen
            if (time != 0) {
                time++;
            }
            if (time < 30) {
                leftButtonrReleased = false;
                leftButtonClick = false;
            }

            //launching logic
            if (!startScreen && time > 30 && !killing) {   
                if (leftButtonClick && !inside) {
                    targeting.X = mouse.X;
                    targeting.Y = mouse.Y;


                    if (targeting.X > 200) {
                        targeting.X = 200;
                    }
                    if (targeting.X < 0) {
                        targeting.X = 0;
                    }
                    if (targeting.Y > 805) {
                        targeting.Y = 805;
                    }
                    if (targeting.Y < 700) {
                        targeting.Y = 700;
                    }
                }

                if (leftButtonrReleased && !fail) {
                    #region Timer Calculation
                    float timeElapsed = (float)gameTime.ElapsedGameTime.TotalSeconds;
                    if (timeRemaining > 0) {
                        timeRemaining -= timeElapsed;
                    } else {
                        fail = true;
                    }
                    #endregion
                    if (!moving) {
                        power = (float)Math.Sqrt(Math.Pow(startingPoint.X - targeting.X, 2) + Math.Pow(targeting.Y - startingPoint.Y, 2));
                        Vector2 direction = new Vector2(targeting.X - startingPoint.X, targeting.Y - startingPoint.Y);
                        velocityX = direction.X * (power / powerScalar);
                        velocityY = direction.Y * (power / powerScalar);
                        moving = true;
                    }

                    if (moving) {
                        velocityY -= 0.025f;
                    }

                    //check floor/ceiling collisions
                    if (collisionDetectionH()) {
                        if (mouse.RightButton == ButtonState.Pressed) {
                            bounce(new Vector2(mouse.X, mouse.Y));
                        } else {
                            velocityY *= -1.0f;
                        }
                    //check vertical wall collisions
                    } else if (collisionDetectionV()) {
                        if (currentScreen == 0) {
                            fail = true;
                        } else {
                            if (mouse.RightButton == ButtonState.Pressed) {
                                bounce(new Vector2(mouse.X, mouse.Y));
                            } else {
                                velocityX *= -1.0f;
                            }
                        }
                    }

                    //update ninja positions
                    ninjaPosition.X -= velocityX;
                    ninjaPosition.Y -= velocityY;

                    //limit to vertical bounds of screen; swap screens if ninja hits the left or right side of the screen
                    if (ninjaPosition.X >= 1440 && currentScreen + 1 < maxScreen) {
                        currentScreen++;
                        ninjaPosition.X = 0;
                    } else if (ninjaPosition.X <= 0 && currentScreen > 1) {
                        currentScreen--;
                        ninjaPosition.X = 1435;
                    }

                    if (ninjaPosition.X <= 0 && currentScreen == 1) {
                        ninjaPosition.X = 0;
                        velocityX *= -1.0f;
                    }

                    //don't swap back to the initial launch screen
                    if (currentScreen != 0) {
                        angle = Math.Atan2(ninjaPosition.X, ninjaPosition.Y) * 10;
                    }

                    //check object collisions
                    hitObject();


                }
            }

            if (ninjaPosition.Y < 0) {
                fail = true;
            }

            //check kill conditions
            if (currentScreen == 4) {
                if (checkKill()) {
                    angle = 0;
                    killing = true;
                    bounce(new Vector2(1150, 722.5f));
                    ninjaPosition.X = 1215;
                    ninjaPosition.Y = 680;
                    win = true;
                    if (winTimer == 0) {
                        winTimer = 1;
                        if (winTimer == 1) {
                            killSound.Play();
                        }
                    }

                }
            }

            //timer for the win screen
            if (winTimer > 0) {
                winTimer++;
            }


            if (winTimer > 360) {
                winTimer = 0;
                startScreen = true;
                reset();
            }

            //check max noise level
            if (noiseLevel >= maxNoiseLevel) {
                fail = true;
            }

            //timer for the fail screen/ retry button click
            if (retryTimer != 0) {
                retryTimer++;
            }

            if (fail && retryTimer == 30) {
                reset();
            }
           
            base.Update(gameTime);
        }

        //reset all necessary variables for restarting the game
        protected void reset() {
            ninjaPosition = new Vector2(220, 730);
            currentScreen = 0;
            targeting = startingPoint;
            fail = false;
            moving = false;
            win = false;
            leftButtonClick = false;
            leftButtonrReleased = false;
            timeRemaining = 30f;
            angle = 1;
            timeOver = false;
            noiseLevel = 0;
            retryTimer = 0;
            inside = false;
            killing = false;
            for (int i = 0; i < broken.Length; i++) {
                for (int j = 0; j < broken[i].Length; j++) {
                    broken[i][j] = false;
                }
            }
        }

        //checking horizontal collisions
        protected bool collisionDetectionH() {
            Rectangle playerHitbox = new Rectangle((int)ninjaPosition.X - 30, (int)ninjaPosition.Y - 35, 60, 96);

            for (int i = 0; i < horizontals[currentScreen].Length; i++) {
                if (playerHitbox.Intersects(horizontals[currentScreen][i])) {
                    return true;
                }
            }
            return false;
        }

        //checking vertical collisions
        protected bool collisionDetectionV() {
            Rectangle playerHitbox = new Rectangle((int)ninjaPosition.X - 30, (int)ninjaPosition.Y - 35, 60, 96);
            for (int i = 0; i < verticals[currentScreen].Length; i++) {
                if (playerHitbox.Intersects(verticals[currentScreen][i])) {

                    return true;
                }
            }
            return false;
        }

        //checking obstacle collisions; increment noise levels; play sound; break object
        protected void hitObject() {
            Rectangle playerHitbox = new Rectangle((int)ninjaPosition.X - 30, (int)ninjaPosition.Y - 35, 60, 96);
            Rectangle testBox;
            for (int i = 0; i < obstaclePositions[currentScreen].Length; i++) {
                if (!broken[currentScreen][i]) {
                    if (currentScreen == 0) {
                        testBox = new Rectangle((int)obstaclePositions[currentScreen][i].X, (int)obstaclePositions[currentScreen][i].Y, obstacleSprites[currentScreen][i].Width, obstacleSprites[currentScreen][i].Height);
                    } else {
                        testBox = new Rectangle((int)obstaclePositions[currentScreen][i].X + 50, (int)obstaclePositions[currentScreen][i].Y + 50, obstacleSprites[currentScreen][i].Width - 100, obstacleSprites[currentScreen][i].Height - 100);
                    }
                    if (playerHitbox.Intersects(testBox)) {
                        noiseLevel += noiseValues[currentScreen][i];
                        collisionSounds[currentScreen][i].Play();
                        if (noiseLevel > maxNoiseLevel) {
                            noiseLevel = maxNoiseLevel;
                        }
                        broken[currentScreen][i] = true;
                    }
                }
            }

        }

        //check bounds around target
        protected bool checkKill() {
            Rectangle playerHitbox = new Rectangle((int)ninjaPosition.X - 30, (int)ninjaPosition.Y - 35, 60, 96);
            Rectangle targetHitbox = new Rectangle(1090, 670, 295, 140);

            if (playerHitbox.Intersects(targetHitbox)) {

                return true;
            }
            return false;
        }

        //redirect the ninja's bounce based on mouse cursor position
        protected void bounce(Vector2 mouse) {
            float xDiff, yDiff;
            xDiff = Math.Abs(mouse.X - ninjaPosition.X);
            yDiff = Math.Abs(mouse.Y - ninjaPosition.Y);
            if (mouse.X > ninjaPosition.X) {
                xDiff *= -1.0f;
            }
            if (mouse.Y > ninjaPosition.Y) {
                yDiff *= -1.0f;
            }

            velocityX = xDiff * 0.015f;
            velocityY = yDiff * 0.015f;

        }

        /// <summary>
        /// This is called when the game should draw itself.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Draw(GameTime gameTime) {
            GraphicsDevice.Clear(Color.Black);

            spriteBatch.Begin();

            //draw title screen
            if (startScreen) {
                spriteBatch.Draw(titlescreen, new Vector2(0, 0), Color.White);
                spriteBatch.Draw(startButton, new Vector2(476.5f, 333.5f), Color.White);
                //timer on how long to draw for after click, swapping button sprites to show click
            } else if (time < 30) {
                spriteBatch.Draw(titlescreen, new Vector2(0, 0), Color.White);
                if (time < 8) {
                    spriteBatch.Draw(startButtonPressed, new Vector2(476.5f, 333.5f), Color.White);
                } else {
                    spriteBatch.Draw(startButton, new Vector2(476.5f, 333.5f), Color.White);
                }
            } else {
                //draw background and noise meter
                spriteBatch.Draw(background[currentScreen], new Vector2(0, 0), Color.White);
                spriteBatch.Draw(noiseMeterSprites[noiseLevel], new Vector2(20, 25), Color.White);

                //draw the target if it's on the last screen
                if (currentScreen == 4 && !killing) {
                    spriteBatch.Draw(badGuy, new Vector2(1150, 670), Color.White);
                }

                //swap to dead guy sprite when killed
                if (currentScreen == 4 && killing) {
                    spriteBatch.Draw(badGuyDead, new Vector2(1150, 670), Color.White);
                }

                //draw the obstacle sprites based on whether they're broken or not
                for (int i = 0; i < obstacleSprites[currentScreen].Length; i++) {
                    if (!broken[currentScreen][i]) {
                        spriteBatch.Draw(obstacleSprites[currentScreen][i], obstaclePositions[currentScreen][i], Color.White);
                    } else {
                        spriteBatch.Draw(brokenSprites[currentScreen][i], brokenPositions[currentScreen][i], Color.White);
                    }
                }

                //draw the ninja, swap sprites based on game state
                if (currentScreen == 0 && ninjaPosition.X < 1140) {
                    spriteBatch.Draw(ninjaSprite, ninjaPosition, null, Color.White, (float)angle, new Vector2(ninjaSprite.Width / 2, ninjaSprite.Height / 2), 1.0f, SpriteEffects.None, 1);
                } else if (killing) {
                    spriteBatch.Draw(standing, ninjaPosition, null, Color.White, (float)angle, new Vector2(ninjaSprite.Width / 2, ninjaSprite.Height / 2), 1.0f, SpriteEffects.None, 1);
                } else {
                    spriteBatch.Draw(cannonball, ninjaPosition, null, Color.White, (float)angle, new Vector2(ninjaSprite.Width / 2, ninjaSprite.Height / 2), 1.0f, SpriteEffects.None, 1);
                }
                //draw cannon only on the first screen
                if (currentScreen == 0) {
                    spriteBatch.Draw(cannonBody, new Vector2(65, 677), Color.White);
                    spriteBatch.Draw(cannonStand, new Vector2(75, 727), Color.White);
                    spriteBatch.Draw(target, targeting, Color.White);
                }
            }
            
            //draw timer
            if (!startScreen && !fail && !win && moving) {
                string time = timeRemaining.ToString();
                time = time.Substring(0, time.IndexOf('.') + 2);
                spriteBatch.DrawString(font, "Time Remaining: " + time, new Vector2(1200, 50), Color.White);
            }

            //draw fail screen and retry button based on game state; time how long to display and swap button sprites when clicked
            if (fail && retryTimer == 0 && !win) {
                spriteBatch.Draw(failed, new Vector2(0, 0), Color.White);
                spriteBatch.Draw(retry, new Vector2(450, 600), Color.White);

            } else if (fail && retryTimer < 30 && !win) {
                spriteBatch.Draw(failed, new Vector2(0, 0), Color.White);
            }

            if (fail && retryTimer < 8 && !win) {
                spriteBatch.Draw(retryPressedSprite, new Vector2(450, 600), Color.White);
            }

            if (fail && retryTimer >= 8 && !win) {
                spriteBatch.Draw(retry, new Vector2(450, 600), Color.White);
            }

            //draw win screen after 3 seconds from kill
            if (win && winTimer > 180) {
                spriteBatch.Draw(winScreen, new Vector2(0, 0), Color.White);
            }
            spriteBatch.End();

            base.Draw(gameTime);
        }
    }
}
